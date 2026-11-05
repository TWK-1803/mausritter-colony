'use strict'

const db = require('./db')

const COLLECTION = 'dices'
const MAX_AGE_DAYS = 30
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000

function getCutoff () {
  return new Date(Date.now() - MAX_AGE_MS)
}

async function getAll (vtable) {
  const rows = await db.collection(COLLECTION)
  const cutoff = getCutoff()

  // Clean out individual rolls older than 30 days
  await rows.updateMany(
    { vtable },
    { $pull: { rolls: { timestamp: { $lt: cutoff } } } }
  )

  // Remove the whole object if no rolls remain in the array
  await rows.deleteMany({
    vtable,
    $or: [
      { rolls: { $size: 0 } },
      { rolls: { $exists: false } }
    ]
  })

  // Fetch remaining active documents and flatten rolls
  const docs = await rows.find({ vtable }, { projection: { _id: 0 } }).toArray()
  const allRolls = []

  for (const doc of docs) {
    if (Array.isArray(doc.rolls)) {
      for (const roll of doc.rolls) {
        allRolls.push({
          vtable: doc.vtable,
          sheet: doc.sheet,
          json: roll.json,
          timestamp: roll.timestamp
        })
      }
    }
  }

  return allRolls.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

async function add (vtable, sheet, json) {
  const rows = await db.collection(COLLECTION)
  const now = new Date()
  const cutoff = getCutoff()

  // Remove individual rolls older than a month for this pair
  await rows.updateOne(
    { vtable, sheet },
    { $pull: { rolls: { timestamp: { $lt: cutoff } } } }
  )

  // Append new roll and update timestamp
  await rows.updateOne(
    { vtable, sheet },
    {
      $push: { rolls: { json, timestamp: now } },
      $set: { updated: now },
      $setOnInsert: { created: now }
    },
    { upsert: true }
  )
}

async function delAll (vtable) {
  const rows = await db.collection(COLLECTION)
  await rows.deleteMany({ vtable })
}

module.exports = { getAll, add, delAll }
