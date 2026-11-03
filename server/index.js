'use strict'

const express = require('express')
const cors = require('cors')

const dicesRouter = require('./routes/dices')
const sheetsRouter = require('./routes/sheets')
const vtablesRouter = require('./routes/vtables')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'

// Comma-separated list of allowed front-end origins, e.g. "https://my-app.vercel.app,http://localhost:8802"
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:8802').split(',').map(origin => origin.trim())

const app = express()

app.use(cors({
  origin: CORS_ORIGINS,
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

// Vercel imports the exported app; only listen when started directly (npm start / npm run dev).
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Mausritter Colony server listening on http://${HOST}:${PORT}`)
  })
}

module.exports = app
