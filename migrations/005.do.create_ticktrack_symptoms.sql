DROP TABLE IF EXISTS ticktrack_symptoms;

CREATE TABLE ticktrack_symptoms (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    symptom VARCHAR
)