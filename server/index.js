'use strict'

const express = require('express')
const cors = require('cors')

const dices = require('./lib/dices')
const dicesRouter = require('./routes/dices')
const sheetsRouter = require('./routes/sheets')
const vtablesRouter = require('./routes/vtables')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'

const DAY_MS = 24 * 60 * 60 * 1000
const HISTORY_MAX_AGE_MS = 7 * DAY_MS
const HISTORY_PURGE_INTERVAL_MS = 60 * 60 * 1000

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8802',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With']
}))
app.use(express.json())

app.use('/api/dices', dicesRouter)
app.use('/api/sheets', sheetsRouter)
app.use('/api/vtables', vtablesRouter)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.use((err, _req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: true, message: 'Invalid JSON body' })
  }
  return next(err)
})

function purgeOldHistory () {
  try {
    const removed = dices.purgeOlderThan(HISTORY_MAX_AGE_MS)
    if (removed > 0) console.log(`Purged ${removed} dice history entries older than ${HISTORY_MAX_AGE_MS / DAY_MS} days`)
  } catch (err) {
    console.error('Dice history purge failed:', err.message)
  }
}

app.listen(PORT, HOST, () => {
  console.log(`Mausritter Colony server listening on http://${HOST}:${PORT}`)
  purgeOldHistory()
  setInterval(purgeOldHistory, HISTORY_PURGE_INTERVAL_MS).unref()
})
