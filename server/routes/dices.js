'use strict'

const dices = require('../lib/dices')
const { Router, requireParams, handle, ok } = require('./helpers')

const router = Router()

router.get('/', handle('dices', (req, res) => {
  if (!requireParams(req, res, 'vtable')) return
  res.json(dices.getAll(req.query.vtable))
}))

router.post('/', handle('dices', (req, res) => {
  if (!requireParams(req, res, 'vtable', 'sheet')) return
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: true, message: 'missing body' })
  }
  dices.add(req.query.vtable, req.query.sheet, JSON.stringify(req.body))
  ok(res)
}))

router.delete('/', handle('dices', (req, res) => {
  if (!requireParams(req, res, 'vtable')) return
  dices.delAll(req.query.vtable)
  ok(res)
}))

module.exports = router
