'use strict'

const db = require('./db')

const COLLECTION = 'vtables'

// Transform from JSON string or object to readable MongoDB document
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
  if (row && typeof row.data === 'string') {
    // in case of incompatible data already in DB
    try { row.data = parseData(row.data) } catch {  }
  }
  return row
}

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
