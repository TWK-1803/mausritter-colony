'use strict'

const { Router } = require('express')

function requireParams (req, res, ...names) {
  const invalid = names.find(name => typeof req.query[name] !== 'string' || req.query[name] === '')
  if (invalid) res.status(400).json({ error: true, message: `missing parameter: ${invalid}` })
  return !invalid
}

function handle (label, fn) {
  return async (req, res) => {
    try {
      return await fn(req, res)
    } catch (err) {
      console.error(`[${label}] ${req.method} error:`, err.message)
      return res.status(500).json({ error: true, message: 'Internal error' })
    }
  }
}

const ok = res => res.json({ error: false, message: 'OK' })

module.exports = { Router, requireParams, handle, ok }
