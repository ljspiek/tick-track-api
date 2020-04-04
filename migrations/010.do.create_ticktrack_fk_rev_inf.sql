ALTER TABLE ticktrack_infectionindicatorslog
DROP CONSTRAINT ticktrack_infectionindicatorslog_symptomlog_id_fkey,
ADD CONSTRAINT ticktrack_infectionindicatorslog_symptomlog_id_fkey
    FOREIGN KEY (symptomlog_id)
    REFERENCES ticktrack_logs(id)
    ON DELETE CASCADE;