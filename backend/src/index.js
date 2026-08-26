import 'dotenv/config'
import dns from 'node:dns'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import analysisRoutes from './routes/analysis.js'
import jobsRoutes from './routes/jobs.js'

const app = express()
// Atlas uses SRV records. This fallback avoids a local DNS resolver that rejects SRV queries.
dns.setServers([process.env.MONGODB_DNS_SERVER || '1.1.1.1'])
app.use(cors())
app.use(express.json())
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/jobs', jobsRoutes)
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ message: error.message || 'Something went wrong. Please try again.' }) })

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`Jobekaa API listening on port ${process.env.PORT || 5000}`)))
  .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1) })
