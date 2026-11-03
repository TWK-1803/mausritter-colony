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

const INDEX_NOT_FOUND = 27

// Create a TTL index on `field`, or replace the existing one when the retention changed.
// The index is dropped and recreated rather than changed with collMod: collMod needs the
// dbAdmin role, which the usual Atlas readWrite database user does not have.
async function ensureTtlIndex (db, name, field) {
  const collection = db.collection(name)
  const key = { [field]: 1 }
  const options = { expireAfterSeconds: MAX_AGE_SECONDS }
  try {
    await collection.createIndex(key, options)
  } catch (err) {
    if (err.code !== INDEX_OPTIONS_CONFLICT && err.code !== INDEX_KEY_SPECS_CONFLICT) throw err
    // Another cold start may have dropped it already
    await collection.dropIndex(`${field}_1`).catch(dropErr => {
      if (dropErr.code !== INDEX_NOT_FOUND) throw dropErr
    })
    await collection.createIndex(key, options)
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
// Indexes tidy up and speed up the data but the routes work without them, so a failure here
// is logged instead of failing every request that needs the database.
async function ensureIndexes (db) {
  const results = await Promise.allSettled([
    db.collection('dices').createIndex({ vtable: 1, timestamp: -1 }),
    db.collection('sheets').createIndex({ vtable: 1, name: 1 }, { unique: true }),
    db.collection('vtables').createIndex({ id: 1 }, { unique: true }),
    ensureTtlIndex(db, 'dices', 'timestamp'),
    ensureTtlIndex(db, 'sheets', 'updated'),
    ensureTtlIndex(db, 'vtables', 'updated')
  ])
  results
    .filter(result => result.status === 'rejected')
    .forEach(result => console.error('[db] index setup failed:', result.reason.message))
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
