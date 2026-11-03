'use strict'

const db = require('./db')

const COLLECTION = 'vtables'

/**
 * Turn the payload sent by the client into a plain object so it is stored as a
 * readable MongoDB document instead of one JSON string. Accepts an object or a
 * JSON string (older clients); throws on anything else.
 */
function parseData (data) {
  if (data === undefined || data === '') return {}
  const value = typeof data === 'string' ? JSON.parse(data) : data
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('data must be an object')
  }
  return value
}

async function get (id) {
  const rows = await db.collection(COLLECTION)
  const row = await rows.findOne({ id }, { projection: { _id: 0 } })
  // Documents saved before data became an object hold a JSON string: return them as objects too
  if (row && typeof row.data === 'string') {
    try { row.data = parseData(row.data) } catch { /* leave unreadable legacy data untouched */ }
  }
  return row
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

module.exports = { get, save, parseData }
