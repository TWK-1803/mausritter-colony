'use strict'

const db = require('./db')

const TABLE = 'vtables'

function get (id) {
  return db.load(TABLE).find(row => row.id === id)
}

function add (id, data) {
  const rows = db.load(TABLE)
  const now = new Date().toISOString()
  rows.push({ id, opened: 0, data, created: now, updated: now })
  db.save(TABLE, rows)
}

function edit (id, data) {
  const rows = db.load(TABLE)
  const index = rows.findIndex(row => row.id === id)
  if (index === -1) return
  rows[index] = { ...rows[index], data, updated: new Date().toISOString() }
  db.save(TABLE, rows)
}

module.exports = { get, add, edit }
