ALTER TABLE ticktrack_symptomsdetail
DROP CONSTRAINT ticktrack_symptomsdetail_symptomlog_id_fkey,
ADD CONSTRAINT ticktrack_symptomsdetail_symptomlog_id_fkey
    FOREIGN KEY (symptomlog_id)
    REFERENCES ticktrack_logs(id)
    ON DELETE CASCADE;