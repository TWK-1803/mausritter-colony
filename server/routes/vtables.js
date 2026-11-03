'use strict'

const vtables = require('../lib/vtables')
const { Router, requireParams, handle } = require('./helpers')

const router = Router()

router.get('/', handle('vtables', async (req, res) => {
  if (!requireParams(req, res, 'vtable')) return
  res.json(await vtables.get(req.query.vtable) || {})
}))

router.post('/', handle('vtables', async (req, res) => {
  if (!requireParams(req, res, 'vtable')) return

  const { data = '' } = req.body || {}

  await vtables.save(req.query.vtable, data)
  res.json({ error: false, message: 'OK', data })
}))

module.exports = router
