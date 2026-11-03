'use strict'

const db = require('./db')

const COLLECTION = 'sheets'

/** All sheets of a virtual table, sorted by name. */
async function getAll (vtable) {
  const rows = await db.collection(COLLECTION)
  return rows.find({ vtable }, { projection: { _id: 0 } }).collation({ locale: 'en' }).sort({ name: 1 }).toArray()
}

/** Create the sheet, or update it when it already exists. */
async function save (vtable, name, fields) {
  const rows = await db.collection(COLLECTION)
  const now = new Date()
  await rows.updateOne(
    { vtable, name },
    { $set: { ...fields, updated: now }, $setOnInsert: { created: now } },
    { upsert: true }
  )
}

async function del (vtable, name) {
  const rows = await db.collection(COLLECTION)
  await rows.deleteOne({ vtable, name })
}

module.exports = { getAll, save, del }
