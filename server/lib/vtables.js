'use strict'

const db = require('./db')

const COLLECTION = 'vtables'

async function get (id) {
  const rows = await db.collection(COLLECTION)
  return rows.findOne({ id }, { projection: { _id: 0 } })
}

/** Create the virtual table, or update its data when it already exists. */
async function save (id, data) {
  const rows = await db.collection(COLLECTION)
  const now = new Date()
  await rows.updateOne(
    { id },
    { $set: { data, updated: now }, $setOnInsert: { opened: 0, created: now } },
    { upsert: true }
  )
}

module.exports = { get, save }
