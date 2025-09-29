const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /lines → all bus lines
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lines ORDER BY line_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /lines/:id → get specific line details
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Line ID must be a number' 
    });
  }

  try {
    const query = 'SELECT * FROM lines WHERE line_id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Line not found',
        message: `No line found with ID ${id}` 
      });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /lines/:id/stops → stops in order with timetable
router.get('/:id/stops', async (req, res) => {
  const { id } = req.params;
  const { day_type = 'weekday' } = req.query;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Line ID must be a number' 
    });
  }

  try {
    const query = `
      SELECT s.stop_id, s.name, s.lat, s.lng, r.stop_sequence,
             t.departure_time, t.day_type
      FROM routes r
      JOIN stops s ON r.stop_id = s.stop_id
      LEFT JOIN timetables t ON t.stop_id = s.stop_id AND t.line_id = r.line_id AND t.day_type = $2
      WHERE r.line_id = $1
      ORDER BY r.stop_sequence, t.departure_time;
    `;
    const result = await pool.query(query, [id, day_type]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /lines/:id/timetable → complete timetable for a line
router.get('/:id/timetable', async (req, res) => {
  const { id } = req.params;
  const { day_type = 'weekday' } = req.query;
  
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Line ID must be a number' 
    });
  }

  try {
    const query = `
      SELECT s.stop_id, s.name, s.lat, s.lng, r.stop_sequence,
             t.departure_time, t.day_type
      FROM routes r
      JOIN stops s ON r.stop_id = s.stop_id
      JOIN timetables t ON t.stop_id = s.stop_id AND t.line_id = r.line_id
      WHERE r.line_id = $1 AND t.day_type = $2
      ORDER BY r.stop_sequence, t.departure_time;
    `;
    const result = await pool.query(query, [id, day_type]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /lines/search → search lines by code or name
router.get('/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 1) {
    return res.status(400).json({ 
      error: 'Invalid query', 
      message: 'Search query is required' 
    });
  }

  try {
    const query = `
      SELECT line_id, code, name
      FROM lines 
      WHERE LOWER(code) LIKE LOWER($1) OR LOWER(name) LIKE LOWER($1)
      ORDER BY code
      LIMIT 20;
    `;
    const result = await pool.query(query, [`%${q.trim()}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
