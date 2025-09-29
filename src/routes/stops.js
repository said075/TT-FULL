const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /stops → all stops
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stops ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /stops/search → search stops by name
router.get('/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Invalid query', 
      message: 'Search query must be at least 2 characters long' 
    });
  }

  try {
    const query = `
      SELECT stop_id, name, lat, lng
      FROM stops 
      WHERE LOWER(name) LIKE LOWER($1)
      ORDER BY name
      LIMIT 20;
    `;
    const result = await pool.query(query, [`%${q.trim()}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /stops/nearby → find stops within radius
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 1000 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ 
      error: 'Missing parameters', 
      message: 'lat and lng parameters are required' 
    });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = parseFloat(radius);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(radiusNum)) {
    return res.status(400).json({ 
      error: 'Invalid parameters', 
      message: 'lat, lng, and radius must be valid numbers' 
    });
  }

  try {
    // Using Haversine formula for distance calculation
    const query = `
      SELECT stop_id, name, lat, lng,
             (6371000 * acos(cos(radians($1)) * cos(radians(lat)) * 
              cos(radians(lng) - radians($2)) + sin(radians($1)) * 
              sin(radians(lat)))) AS distance
      FROM stops 
      WHERE lat IS NOT NULL AND lng IS NOT NULL
      HAVING distance <= $3
      ORDER BY distance
      LIMIT 20;
    `;
    const result = await pool.query(query, [latNum, lngNum, radiusNum]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /stops/:id → get specific stop details
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Stop ID must be a number' 
    });
  }

  try {
    const query = 'SELECT * FROM stops WHERE stop_id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Stop not found',
        message: `No stop found with ID ${id}` 
      });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /stops/:id/timetable → departures for a stop
router.get('/:id/timetable', async (req, res) => {
  const { id } = req.params;
  const { day_type = 'weekday' } = req.query;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Stop ID must be a number' 
    });
  }

  try {
    const query = `
      SELECT l.code AS line_code, l.name AS line_name, t.departure_time, t.day_type
      FROM timetables t
      JOIN lines l ON t.line_id = l.line_id
      WHERE t.stop_id = $1 AND t.day_type = $2
      ORDER BY t.departure_time;
    `;
    const result = await pool.query(query, [id, day_type]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /stops/:id/lines → get all lines that serve this stop
router.get('/:id/lines', async (req, res) => {
  const { id } = req.params;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Stop ID must be a number' 
    });
  }

  try {
    const query = `
      SELECT DISTINCT l.line_id, l.code, l.name, r.stop_sequence
      FROM routes r
      JOIN lines l ON r.line_id = l.line_id
      WHERE r.stop_id = $1
      ORDER BY r.stop_sequence;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
