import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import destinationRoutes from './destinations/destination.routes.js'
import { testDatabaseConnection } from './services/databaseTest.js'
import { errorHandler } from './middleware/errorHandler.js'
import { sendSuccess, sendError } from './utils/apiResponse.js'
import authRoutes from './auth/auth.routes.js'
import intelligenceRoutes from './recommendations/intelligence.routes.js'
import recommendationRoutes from './recommendations/recommendation.routes.js'
import preferenceRoutes from './preferences/preference.routes.js'
import partnerRoutes from './partners/partner.routes.js'
import partnerApplicationRoutes from './partners/partnerApplication.routes.js'
import adminRoutes from './admin/admin.routes.js'

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  return sendSuccess(
    res,
    null,
    'KHOJ INDIA backend is healthy.',
  )
})

// Database health check
app.get('/api/health/database', async (_req, res) => {
  try {
    const data = await testDatabaseConnection()

    return sendSuccess(
      res,
      {
        sampleDestination: data[0] ?? null,
      },
      'KHOJ INDIA backend is connected to Supabase.',
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown database error.'

    return sendError(
      res,
      message,
      500,
      'DATABASE_CONNECTION_FAILED',
    )
  }
})

// Destination routes
app.use('/api/destinations', destinationRoutes)

// Authentication Routes
app.use('/api/auth', authRoutes)
app.use('/api/intelligence', intelligenceRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/preferences', preferenceRoutes)
app.use('/api/partner', partnerRoutes)
app.use('/api/partner-applications', partnerApplicationRoutes)
app.use('/api/admin', adminRoutes)

// 404 handler
app.use((_req, res) => {
  return sendError(
    res,
    'API endpoint not found.',
    404,
    'API_ENDPOINT_NOT_FOUND',
  )
})

// Global error handler
app.use(errorHandler)

export default app