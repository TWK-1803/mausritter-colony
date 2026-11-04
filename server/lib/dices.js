'use strict'

const db = require('./db')

const COLLECTION = 'dices'

async function getAll (vtable) {
  const rows = await db.collection(COLLECTION)
  return rows.find({ vtable }, { projection: { _id: 0 } }).sort({ timestamp: -1 }).toArray()
}

async function add (vtable, sheet, json) {
  const rows = await db.collection(COLLECTION)
  await rows.insertOne({ vtable, sheet, json, timestamp: new Date() })
}

async function delAll (vtable) {
  const rows = await db.collection(COLLECTION)
  await rows.deleteMany({ vtable })
}

module.exports = { getAll, add, delAll }
