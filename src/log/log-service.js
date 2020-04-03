const Treeize = require('treeize')


const LogService = {
     getLogHeader(db) {
        return db
            .from('ticktrack_logs as logs')
            .select(
                'logs.id as log_id',
                'logs.date_created as date'
            )
            .leftJoin(
                'ticktrack_users as users',
                'users.id', 
                'logs.user_id'
            )
    },

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
            .leftJoin(
                'ticktrack_users as users',
                'users.id', 
                'logs.user_id'
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
            .leftJoin(
                'ticktrack_users as users',
                'users.id', 
                'logs.user_id'
            )
            
    },

    getAllNewInfections(db) {
        return db
            .from('ticktrack_infectionindicatorslog as infectionlog')
            .select(
                'logs.id as log_id',
                'newinfections.id as infection_id',
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
            .leftJoin(
                'ticktrack_users as users',
                'users.id', 
                'logs.user_id'
            )
    },

    getCountNewInfections(db) {
        return db 
            .from('ticktrack_infectionindicatorslog as infectionlog')
            .select('infectionlog.symptomlog_id as log_id',
            db.raw(
                `count(DISTINCT infectionlog.newinfectionindicators_id) AS newinfections`
                )
            )
            .groupBy('log_id')
            
            
    },

    getHeaderDatabyId(db, id) {
        return LogService.getLogHeader(db)
            .where('logs.id', id)
    },
    
    getSymptpomLogById(db, id) {
        return LogService.getAllLoggedSymptoms(db)
            .where('logs.id', id)
            
    },

    getHealthLogById(db, id) {
        return LogService.getAllLoggedHealthRatings(db)
            .where('logs.id', id)
    },

    getInfectionLogById(db, id) {
        return LogService.getAllNewInfections(db)
            .where('logs.id', id)
    },

    getSymptpomLogByUser(db, id) {
        return LogService.getAllLoggedSymptoms(db)
            .where('users.id', id)
            
    },

    getHealthLogByUser(db, id) {
        return LogService.getAllLoggedHealthRatings(db)
            .where('users.id', id)
    },

    getInfectionLogByUser(db, id) {
        return LogService.getAllNewInfections(db)
            .where('users.id', id)
    },

    treeizeLog(header, generalhealth, newinfectionindicators) {
            const log = header.concat(generalhealth, newinfectionindicators)
            const logTree = new Treeize()
            
            const seed = log.map(logs => ({
                'id*': logs.log_id,
                'date': logs.date,
                'generalhealth': logs.rating,
                'newinfections': logs.newinfections
                                
            }))

            logTree.grow(seed);
            return logTree.getData();
    },
    
    insertLog(db, newLog) {
        return db
            .insert(newLog)
            .into('ticktrack_logs')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    insertInfections(db, newInf, id) {
        console.log(newInf, id)
        const symptomlog_id = id
        const infToInsert = newInf.map(inf => 
            ({symptomlog_id, newinfectionindicators_id: inf.newinfectionindicators_id}))
        return db
            .insert(infToInsert)
            .into('ticktrack_infectionindicatorslog')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    insertSymptoms(db, newSymp, id) {
        const symptomlog_id = id
        const sympToInsert = newSymp.map(symp => 
            ({
                symptomlog_id, symptoms_id: symp.symptoms_id, severity_id: symp.severity_id
            }))
        console.log(sympToInsert)
        return db
            .insert(sympToInsert)
            .into('ticktrack_symptomsdetail')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteLog(db, id) {
        return db('ticktrack_logs')
            .where(id)
            .delete()
    },

    updateLog(db, id, newLogEntries) {
        return db('ticktrack_logs')
            .where({ id })
            .update(newLogEntries)
    }
    
}


    
module.exports = LogService