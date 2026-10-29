'use strict'

const { Router } = require('express')

/** Respond with 400 and return false when a required query parameter is missing. */
function requireParams (req, res, ...names) {
  const missing = names.find(name => req.query[name] === undefined || req.query[name] === '')
  if (missing) res.status(400).json({ error: true, message: `missing parameter: ${missing}` })
  return !missing
}

/** Wrap a route handler so errors are logged and answered with a generic 500. */
function handle (label, fn) {
  return (req, res) => {
    try {
      return fn(req, res)
    } catch (err) {
      console.error(`[${label}] ${req.method} error:`, err.message)
      return res.status(500).json({ error: true, message: 'Internal error' })
    }
  }
}

const ok = res => res.json({ error: false, message: 'OK' })

module.exports = { Router, requireParams, handle, ok }
