'use strict'

const sheets = require('../lib/sheets')
const { Router, requireParams, handle, ok } = require('./helpers')

const router = Router()

router.get('/', handle('sheets', async (req, res) => {
  if (!requireParams(req, res, 'vtable')) return
  res.json(await sheets.getAll(req.query.vtable))
}))

router.post('/', handle('sheets', async (req, res) => {
  if (!requireParams(req, res, 'vtable', 'name', 'str', 'str_max', 'dex', 'dex_max', 'wil', 'wil_max', 'hp', 'hp_max', 'level')) return

  const { vtable, name, str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level } = req.query
  const { data = '', hirelings } = req.body || {}

  await sheets.save(vtable, name, {
    str, str_max, dex, dex_max, wil, wil_max, hp, hp_max, level,
    hirelings: JSON.stringify(hirelings || []),
    data
  })
  ok(res)
}))

router.delete('/', handle('sheets', async (req, res) => {
  if (!requireParams(req, res, 'vtable', 'name')) return
  await sheets.del(req.query.vtable, req.query.name)
  ok(res)
}))

module.exports = router
