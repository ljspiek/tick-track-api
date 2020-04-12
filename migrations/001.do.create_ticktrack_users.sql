CREATE TABLE ticktrack_users (
    id SERIAL PRIMARY KEY,
    email citext UNIQUE NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);