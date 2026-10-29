'use strict'

const vtables = require('../lib/vtables')
const { Router, requireParams, handle } = require('./helpers')

const router = Router()

router.get('/', handle('vtables', (req, res) => {
  if (!requireParams(req, res, 'vtable')) return
  res.json(vtables.get(req.query.vtable) || {})
}))

router.post('/', handle('vtables', (req, res) => {
  if (!requireParams(req, res, 'vtable')) return

  const { vtable } = req.query
  const { data = '' } = req.body || {}

  if (vtables.get(vtable)) vtables.edit(vtable, data)
  else vtables.add(vtable, data)
  res.json({ error: false, message: 'OK', data })
}))

module.exports = router
