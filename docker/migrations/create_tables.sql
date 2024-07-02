CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);

CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_station_id UUID NOT NULL REFERENCES stations(id),
  to_station_id UUID NOT NULL REFERENCES stations(id)
);

-- many-to-many relationship between `journeys` and `stations`
CREATE TABLE journey_via_stations (
  journey_id UUID NOT NULL REFERENCES journeys(id),
  station_id UUID NOT NULL REFERENCES stations(id),
  PRIMARY KEY (journey_id, station_id)
);

-- DO NOT REMOVE
-- MUST BE THE LAST STATEMENT IN THIS FILE
-- Creates a duplicate of the 'assignment' database for the E2E tests
CREATE DATABASE assignment_test
WITH TEMPLATE assignment
OWNER postgres;