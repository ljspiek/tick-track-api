const Treeize = require('treeize')

const LogService = {
    getAllLoggedSymptoms(db) {
        return db
            .from('ticktrack_logs as logs')
            .select(
                'logs.id as log_id',
                'symptoms.id as symptom_id',
                'symptoms.symptom',
                'severity.severity'
            )
            .leftJoin(
                'ticktrack_symptomsdetail as sympdt',
                'sympdt.symptomlog_id',
                'logs.id'
            )
            .leftJoin(
                'ticktrack_symptoms as symptoms',
                'symptoms.id',
                'sympdt.symptoms_id'
            )
            .leftJoin(
                'ticktrack_severity as severity',
                'severity.id',
                'sympdt.severity_id'
            )
    },

    getAllLoggedHealthRatings(db) {
        return db
            .from('ticktrack_logs as logs')
            .select(
                'logs.id as log_id',
                'generalhealth.id',
                'generalhealth.rating as rating'
            )
            .leftJoin(
                'ticktrack_generalhealth as generalhealth',
                'generalhealth.id',
                'logs.general_health_id'
            )
            
    },

    getAllNewInfections(db) {
        return db
            .from('ticktrack_infectionindicatorslog as infectionlog')
            .select(
                'logs.id as log_id',
                'newinfections.id',
                'newinfections.indicator'
            )
            .leftJoin(
                'ticktrack_logs as logs',
                'logs.id',
                'infectionlog.symptomlog_id'
            )
            .leftOuterJoin(
                'ticktrack_newinfections as newinfections',
                'newinfections.id',
                'infectionlog.newinfectionindicators_id'
            )
    },
    

    
}


module.exports = LogService