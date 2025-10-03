-- Drop tables if they already exist (for clean re-runs)
DROP TABLE IF EXISTS timetables CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS lines CASCADE;

-- 1. Bus lines
CREATE TABLE lines (
    line_id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,   -- e.g. "1", "5A"
    name TEXT NOT NULL                  -- e.g. "Slatina → Centar"
);

-- 2. Stops
CREATE TABLE stops (
    stop_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- 3. Routes (ordered stops for each line)
CREATE TABLE routes (
    route_id SERIAL PRIMARY KEY,
    line_id INT REFERENCES lines(line_id) ON DELETE CASCADE,
    stop_id INT REFERENCES stops(stop_id) ON DELETE CASCADE,
    stop_sequence INT NOT NULL
);

-- 4. Timetables (departures per stop per line)
CREATE TABLE timetables (
    timetable_id SERIAL PRIMARY KEY,
    line_id INT REFERENCES lines(line_id) ON DELETE CASCADE,
    stop_id INT REFERENCES stops(stop_id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    day_type VARCHAR(20) DEFAULT 'weekday'  -- weekday, weekend, holiday
);
