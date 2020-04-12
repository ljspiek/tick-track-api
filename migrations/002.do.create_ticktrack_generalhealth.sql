DROP TABLE IF EXISTS ticktrack_generalhealth;

CREATE TABLE ticktrack_generalhealth (
    id SERIAL PRIMARY KEY,
    rating TEXT NOT NULL
);