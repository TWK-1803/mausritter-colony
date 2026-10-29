'use strict'

const db = require('./db')

const TABLE = 'dices'

/** All dice rolls of a virtual table, newest first. */
function getAll (vtable) {
  return db.load(TABLE)
    .filter(row => row.vtable === vtable)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

function add (vtable, sheet, json) {
  const rows = db.load(TABLE)
  rows.push({ vtable, sheet, json, timestamp: new Date().toISOString() })
  db.save(TABLE, rows)
}

function delAll (vtable) {
  db.save(TABLE, db.load(TABLE).filter(row => row.vtable !== vtable))
}

/** Delete rolls older than maxAgeMs from every virtual table. Returns the number deleted. */
function purgeOlderThan (maxAgeMs) {
  const cutoff = Date.now() - maxAgeMs
  const rows = db.load(TABLE)
  const kept = rows.filter(row => new Date(row.timestamp).getTime() >= cutoff)
  if (kept.length < rows.length) db.save(TABLE, kept)
  return rows.length - kept.length
}

module.exports = { getAll, add, delAll, purgeOlderThan }
