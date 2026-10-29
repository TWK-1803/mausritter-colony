'use strict'

const db = require('./db')

const TABLE = 'sheets'

/** All sheets of a virtual table, sorted by name. */
function getAll (vtable) {
  return db.load(TABLE)
    .filter(row => row.vtable === vtable)
    .sort((a, b) => a.name.localeCompare(b.name))
}

function get (vtable, name) {
  return db.load(TABLE).find(row => row.vtable === vtable && row.name === name)
}

function add (vtable, name, str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level, hirelings, data) {
  const rows = db.load(TABLE)
  const now = new Date().toISOString()
  rows.push({ vtable, name, str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level, hirelings, data, created: now, updated: now })
  db.save(TABLE, rows)
}

function edit (vtable, name, str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level, hirelings, data) {
  const rows = db.load(TABLE)
  const index = rows.findIndex(row => row.vtable === vtable && row.name === name)
  if (index === -1) return
  rows[index] = { ...rows[index], str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level, hirelings, data, updated: new Date().toISOString() }
  db.save(TABLE, rows)
}

function del (vtable, name) {
  db.save(TABLE, db.load(TABLE).filter(row => !(row.vtable === vtable && row.name === name)))
}

module.exports = { getAll, get, add, edit, del }
