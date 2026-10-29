'use strict'

const sheets = require('../lib/sheets')
const { Router, requireParams, handle, ok } = require('./helpers')

const router = Router()

router.get('/', handle('sheets', (req, res) => {
  if (!requireParams(req, res, 'vtable')) return
  res.json(sheets.getAll(req.query.vtable))
}))

router.post('/', handle('sheets', (req, res) => {
  if (!requireParams(req, res, 'vtable', 'name', 'str', 'str_max', 'dex', 'dex_max', 'wil', 'wil_max', 'hp', 'hp_max', 'level')) return

  const { vtable, name, str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level } = req.query
  const { data = '', hirelings } = req.body || {}
  const args = [vtable, name, str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level, JSON.stringify(hirelings || []), data]

  if (sheets.get(vtable, name)) sheets.edit(...args)
  else sheets.add(...args)
  ok(res)
}))

router.delete('/', handle('sheets', (req, res) => {
  if (!requireParams(req, res, 'vtable', 'name')) return
  sheets.del(req.query.vtable, req.query.name)
  ok(res)
}))

module.exports = router
