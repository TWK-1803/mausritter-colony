'use strict'

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '..', 'data')

const tablePath = table => path.join(DATA_DIR, `${table}.json`)

/** Load all rows of a table from its JSON file. */
function load (table) {
  try {
    return JSON.parse(fs.readFileSync(tablePath(table), 'utf8'))
  } catch {
    return []
  }
}

/** Persist all rows of a table to its JSON file. */
function save (table, rows) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(tablePath(table), JSON.stringify(rows, null, 2), 'utf8')
}

module.exports = { load, save }
