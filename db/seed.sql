-- Insert lines
INSERT INTO lines (code, name) VALUES
('1', 'Slatina → Centar'),
('2', 'Bukinje → Centar');

-- Insert stops
INSERT INTO stops (name, lat, lng) VALUES
('Slatina', 44.540, 18.670),
('Centar', 44.545, 18.675),
('Bukinje', 44.550, 18.660);

-- Insert routes
INSERT INTO routes (line_id, stop_id, stop_sequence) VALUES
(1, 1, 1),  -- Line 1: Slatina (first stop)
(1, 2, 2),  -- Line 1: Centar (second stop)
(2, 3, 1),  -- Line 2: Bukinje (first stop)
(2, 2, 2);  -- Line 2: Centar (second stop)

-- Insert timetables
INSERT INTO timetables (line_id, stop_id, departure_time, day_type) VALUES
(1, 1, '07:15', 'weekday'),
(1, 2, '07:30', 'weekday'),
(2, 3, '08:00', 'weekday'),
(2, 2, '08:20', 'weekday');
