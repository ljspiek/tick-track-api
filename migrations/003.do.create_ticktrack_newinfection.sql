DROP TABLE IF EXISTS ticktrack_newinfections;

CREATE TABLE ticktrack_newinfections (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    indicator VARCHAR
)