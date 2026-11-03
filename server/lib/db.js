'use strict'

const { MongoClient } = require('mongodb')

const DB_NAME = process.env.STRG_MONGODB_DB || 'mausritter-colony'
const MAX_AGE_DAYS = 30
const MAX_AGE_SECONDS = MAX_AGE_DAYS * 24 * 60 * 60

// createIndex error codes raised when an index exists with different options (e.g. an older TTL)
const INDEX_OPTIONS_CONFLICT = 85
const INDEX_KEY_SPECS_CONFLICT = 86

// The connection is cached at module level so warm serverless invocations reuse it.
let dbPromise

// Create a TTL index on `field`, or change the expiry of the existing one when the retention changed.
async function ensureTtlIndex (db, name, field) {
  try {
    await db.collection(name).createIndex({ [field]: 1 }, { expireAfterSeconds: MAX_AGE_SECONDS })
  } catch (err) {
    if (err.code !== INDEX_OPTIONS_CONFLICT && err.code !== INDEX_KEY_SPECS_CONFLICT) throw err
    await db.command({
      collMod: name,
      index: { keyPattern: { [field]: 1 }, expireAfterSeconds: MAX_AGE_SECONDS }
    })
  }
}

// Data is purged by MongoDB itself through TTL indexes: a serverless function has no
// long-running process to run a purge timer, and the database deletes expired documents
// (checked about once a minute) whether or not the server is awake.
//   dices:   a roll expires MAX_AGE_DAYS after it was made
//   sheets:  a sheet expires MAX_AGE_DAYS after it was last saved
//   vtables: a table expires MAX_AGE_DAYS after its data last changed
// TTL only applies to BSON Date fields, which is what the lib/ modules write.
// The frontend welcome text (App.vue) states this period: keep both in sync.
async function ensureIndexes (db) {
  await Promise.all([
    db.collection('dices').createIndex({ vtable: 1, timestamp: -1 }),
    db.collection('sheets').createIndex({ vtable: 1, name: 1 }, { unique: true }),
    db.collection('vtables').createIndex({ id: 1 }, { unique: true }),
    ensureTtlIndex(db, 'dices', 'timestamp'),
    ensureTtlIndex(db, 'sheets', 'updated'),
    ensureTtlIndex(db, 'vtables', 'updated')
  ])
}

function getDb () {
  if (!dbPromise) {
    const uri = process.env.STRG_MONGODB_URI
    if (!uri) return Promise.reject(new Error('STRG_MONGODB_URI is not set'))

    dbPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
      .connect()
      .then(async client => {
        const db = client.db(DB_NAME)
        await ensureIndexes(db)
        return db
      })
      .catch(err => {
        dbPromise = undefined // allow a retry on the next request
        throw err
      })
  }
  return dbPromise
}

/** Get a MongoDB collection by name. */
async function collection (name) {
  return (await getDb()).collection(name)
}

module.exports = { collection }
