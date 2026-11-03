'use strict'

const { Router } = require('express')

/**
 * Respond with 400 and return false when a required query parameter is missing.
 * Parameters must be plain strings: Express parses `?a[$ne]=x` into an object,
 * which would otherwise reach MongoDB as a query operator.
 */
function requireParams (req, res, ...names) {
  const invalid = names.find(name => typeof req.query[name] !== 'string' || req.query[name] === '')
  if (invalid) res.status(400).json({ error: true, message: `missing parameter: ${invalid}` })
  return !invalid
}

/** Wrap an (async) route handler so errors are logged and answered with a generic 500. */
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
