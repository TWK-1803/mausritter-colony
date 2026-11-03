'use strict'

const { MongoClient } = require('mongodb')

const DB_NAME = process.env.STRG_MONGODB_DB || 'mausritter-colony'
const HISTORY_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

// The connection is cached at module level so warm serverless invocations reuse it.
let dbPromise

async function ensureIndexes (db) {
  await Promise.all([
    db.collection('dices').createIndex({ vtable: 1, timestamp: -1 }),
    // MongoDB removes old rolls itself: a serverless function has no process to run a purge timer.
    db.collection('dices').createIndex({ timestamp: 1 }, { expireAfterSeconds: HISTORY_MAX_AGE_SECONDS }),
    db.collection('sheets').createIndex({ vtable: 1, name: 1 }, { unique: true }),
    db.collection('vtables').createIndex({ id: 1 }, { unique: true })
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
