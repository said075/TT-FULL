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

// GET /lines/:id/stops → stops in order with timetable
router.get('/:id/stops', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT s.stop_id, s.name, s.lat, s.lng, t.departure_time
      FROM routes r
      JOIN stops s ON r.stop_id = s.stop_id
      LEFT JOIN timetables t ON t.stop_id = s.stop_id AND t.line_id = r.line_id
      WHERE r.line_id = $1
      ORDER BY r.stop_sequence, t.departure_time;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
