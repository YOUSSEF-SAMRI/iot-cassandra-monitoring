-- 1. KEYSPACE
CREATE KEYSPACE IF NOT EXISTS iot_keyspace
WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'dc1': 3
};

-- 2. TABLE: SENSORS
CREATE TABLE IF NOT EXISTS iot_keyspace.sensors (
    sensor_id TEXT PRIMARY KEY,
    sensor_type TEXT,
    unit TEXT,
    location TEXT
);

-- 3. TABLE: MEASUREMENTS
CREATE TABLE IF NOT EXISTS iot_keyspace.measurements (
    sensor_id TEXT,
    day DATE,
    date TIMESTAMP,
    value DOUBLE,
    PRIMARY KEY ((sensor_id, day), date)
) WITH CLUSTERING ORDER BY (date DESC);