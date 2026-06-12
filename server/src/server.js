require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const { connectDB, getDBStatus } = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const aiRoutes = require('./routes/ai.routes')
const healthRoutes = require('./routes/health.routes')
const reportRoutes = require('./routes/report.routes')

const app = express()
const port = process.env.PORT || 5000

connectDB()

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 240 }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'MediVision AI',
    ai: Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY),
    database: getDBStatus(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/reports', reportRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

app.listen(port, () => {
  console.log(`MediVision AI API running on http://localhost:${port}`)
})
