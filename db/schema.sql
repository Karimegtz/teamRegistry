DROP DATABASE IF EXISTS team_registry;
CREATE DATABASE team_registry;

\c team_registry

CREATE TABLE sector (
  sector_id SERIAL PRIMARY KEY,
  sector_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE position (
  position_id SERIAL PRIMARY KEY,
  position_title VARCHAR(30) UNIQUE NOT NULL,
  position_salary DECIMAL NOT NULL,
  sector_id INTEGER NOT NULL,
  CONSTRAINT fk_sector FOREIGN KEY (sector_id) REFERENCES sector(sector_id) ON DELETE CASCADE
);

CREATE TABLE staff (
  staff_id SERIAL PRIMARY KEY,
  given_name VARCHAR(30) NOT NULL,
  surname VARCHAR(30) NOT NULL,
  position_id INTEGER NOT NULL,
  CONSTRAINT fk_position FOREIGN KEY (position_id) REFERENCES position(position_id) ON DELETE CASCADE,
  mentor_id INTEGER,
  CONSTRAINT fk_mentor FOREIGN KEY (mentor_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);
