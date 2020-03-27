DROP TABLE IF EXISTS ticktrack_symptomsdetail;

CREATE TABLE ticktrack_symptomsdetail(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    symptomlog_id INTEGER
        REFERENCES ticktrack_logs(id),
    symptoms_id INTEGER
        REFERENCES ticktrack_symptoms(id),
    severity_id INTEGER
        REFERENCES ticktrack_severity(id)
);