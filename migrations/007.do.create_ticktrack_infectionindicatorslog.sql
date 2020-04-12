DROP TABLE IF EXISTS ticktrack_infectionindicatorslog;

CREATE TABLE ticktrack_infectionindicatorslog(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    symptomlog_id INTEGER
        REFERENCES ticktrack_logs(id),
    newinfectionindicators_id INTEGER
        REFERENCES ticktrack_newinfections(id)
);