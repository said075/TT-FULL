const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /stops/:id/timetable → departures for a stop
router.get('/:id/timetable', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT l.code AS line_code, l.name AS line_name, t.departure_time
      FROM timetables t
      JOIN lines l ON t.line_id = l.line_id
      WHERE t.stop_id = $1
      ORDER BY t.departure_time;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
