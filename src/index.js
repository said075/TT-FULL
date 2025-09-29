const express = require('express');
const cors = require('cors');

const linesRouter = require('./routes/lines');
const stopsRouter = require('./routes/stops');
const journeyRouter = require('./routes/journey');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/lines', linesRouter);
app.use('/api/stops', stopsRouter);
app.use('/api/journey', journeyRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Tuzla Transport API',
    version: '1.0.0',
    description: 'Public transport API for Tuzla',
    endpoints: {
      health: 'GET /api/health',
      lines: {
        all: 'GET /api/lines',
        stops: 'GET /api/lines/:id/stops'
      },
      stops: {
        all: 'GET /api/stops',
        by_id: 'GET /api/stops/:id',
        timetable: 'GET /api/stops/:id/timetable',
        lines: 'GET /api/stops/:id/lines',
        nearby: 'GET /api/stops/nearby?lat=:lat&lng=:lng&radius=:radius',
        search: 'GET /api/stops/search?q=:query'
      },
      journey: {
        plan: 'GET /api/journey/plan?from=:from&to=:to&day_type=:day_type',
        nearby: 'GET /api/journey/nearby?lat=:lat&lng=:lng&radius=:radius&limit=:limit'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚌 Tuzla Transport API running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
});
