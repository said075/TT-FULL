const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /journey/plan → plan journey between two stops
router.get('/plan', async (req, res) => {
  const { from, to, day_type = 'weekday' } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ 
      error: 'Missing parameters', 
      message: 'from and to stop IDs are required' 
    });
  }

  const fromId = parseInt(from);
  const toId = parseInt(to);

  if (isNaN(fromId) || isNaN(toId)) {
    return res.status(400).json({ 
      error: 'Invalid parameters', 
      message: 'from and to must be valid stop IDs' 
    });
  }

  if (fromId === toId) {
    return res.status(400).json({ 
      error: 'Invalid journey', 
      message: 'Origin and destination cannot be the same' 
    });
  }

  try {
    // Find direct connections
    const directQuery = `
      SELECT DISTINCT l.line_id, l.code, l.name,
             r1.stop_sequence as from_sequence,
             r2.stop_sequence as to_sequence,
             s1.name as from_stop,
             s2.name as to_stop
      FROM lines l
      JOIN routes r1 ON l.line_id = r1.line_id AND r1.stop_id = $1
      JOIN routes r2 ON l.line_id = r2.line_id AND r2.stop_id = $2
      JOIN stops s1 ON r1.stop_id = s1.stop_id
      JOIN stops s2 ON r2.stop_id = s2.stop_id
      WHERE r1.stop_sequence < r2.stop_sequence
      ORDER BY l.code;
    `;
    
    const directResult = await pool.query(directQuery, [fromId, toId]);
    
    // Find connecting routes (simplified - one transfer)
    const connectingQuery = `
      WITH direct_routes AS (
        SELECT DISTINCT l1.line_id as line1_id, l1.code as line1_code, l1.name as line1_name,
               l2.line_id as line2_id, l2.code as line2_code, l2.name as line2_name,
               r1.stop_sequence as from_sequence,
               r2.stop_sequence as to_sequence,
               s1.name as from_stop,
               s2.name as to_stop,
               s3.name as transfer_stop,
               r3.stop_sequence as transfer_sequence1,
               r4.stop_sequence as transfer_sequence2
        FROM lines l1
        JOIN routes r1 ON l1.line_id = r1.line_id AND r1.stop_id = $1
        JOIN routes r3 ON l1.line_id = r3.line_id
        JOIN routes r4 ON r4.stop_id = r3.stop_id AND r4.line_id != l1.line_id
        JOIN lines l2 ON r4.line_id = l2.line_id
        JOIN routes r2 ON l2.line_id = r2.line_id AND r2.stop_id = $2
        JOIN stops s1 ON r1.stop_id = s1.stop_id
        JOIN stops s2 ON r2.stop_id = s2.stop_id
        JOIN stops s3 ON r3.stop_id = s3.stop_id
        WHERE r1.stop_sequence < r3.stop_sequence 
          AND r4.stop_sequence < r2.stop_sequence
          AND l1.line_id != l2.line_id
      )
      SELECT * FROM direct_routes
      ORDER BY line1_code, line2_code;
    `;
    
    const connectingResult = await pool.query(connectingQuery, [fromId, toId]);
    
    res.json({
      from_stop_id: fromId,
      to_stop_id: toId,
      day_type,
      direct_routes: directResult.rows,
      connecting_routes: connectingResult.rows,
      total_options: directResult.rows.length + connectingResult.rows.length
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /journey/nearby → find nearby stops and their next departures
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 500, limit = 10 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ 
      error: 'Missing parameters', 
      message: 'lat and lng parameters are required' 
    });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = parseFloat(radius);
  const limitNum = parseInt(limit);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(radiusNum) || isNaN(limitNum)) {
    return res.status(400).json({ 
      error: 'Invalid parameters', 
      message: 'All parameters must be valid numbers' 
    });
  }

  try {
    const query = `
      WITH nearby_stops AS (
        SELECT s.stop_id, s.name, s.lat, s.lng,
               (6371000 * acos(cos(radians($1)) * cos(radians(s.lat)) * 
                cos(radians(s.lng) - radians($2)) + sin(radians($1)) * 
                sin(radians(s.lat)))) AS distance
        FROM stops s
        WHERE s.lat IS NOT NULL AND s.lng IS NOT NULL
        HAVING distance <= $3
        ORDER BY distance
        LIMIT $4
      ),
      next_departures AS (
        SELECT ns.stop_id, ns.name, ns.lat, ns.lng, ns.distance,
               l.code as line_code, l.name as line_name,
               t.departure_time, t.day_type
        FROM nearby_stops ns
        LEFT JOIN timetables t ON ns.stop_id = t.stop_id
        LEFT JOIN lines l ON t.line_id = l.line_id
        WHERE t.day_type = 'weekday' OR t.day_type IS NULL
        ORDER BY ns.distance, t.departure_time
      )
      SELECT * FROM next_departures
      ORDER BY distance, departure_time;
    `;
    
    const result = await pool.query(query, [latNum, lngNum, radiusNum, limitNum]);
    res.json(result.rows);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
