const Treeize = require('treeize')


const LogService = {
     getLogHeader(db) {
        return db
            .from('ticktrack_logs as logs')
            .select(
                'logs.id as log_id',
                'logs.date_created as date'
            )
            .select(
                db.raw(
                    "to_char(logs.date_created, 'YYYY-MM-DD') as date"
                )
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
                'sympdt.id',
                'symptoms.id as symptoms_id',
                'symptoms.symptom',
                'sympdt.severity_id',
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
                'infectionlog.id',
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
    //used to display if user has selected a new infection indicator in summary view
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

    getHeaderDataByUser(db, id) {
        return LogService.getLogHeader(db)
            .where('users.id', id)
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

    //get number of infections for summary view
    getCountInfectionLogByUser(db, id) {
        return LogService.getCountNewInfections(db)
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
        .select('infectionlog.symptomlog_id as log_id',
            db.raw(
                `count(DISTINCT infectionlog.newinfectionindicators_id) AS newinfections`
                )
            )
            .groupBy('log_id')
        .where('users.id', id)

    },


    //convert flat array to nested array with objects to allow easy app retrieval and display of information
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
        //using id created by insertLog, update infections
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
        //using id created by insertLog, update symptoms
        const symptomlog_id = id
        const sympToInsert = newSymp.map(symp => 
            ({symptomlog_id, symptoms_id: symp.symptoms_id, severity_id: symp.severity_id}))
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
            .where({id})
            .delete()
    },

    updateLog(db, id, newLogEntries) {
        return db('ticktrack_logs')
            .where({ id })
            .update(newLogEntries)
    },

    updateInfections(db, delInf) {
        //use transaction to update multiple rows
        return db.transaction(trx => {
            const dels = []
            delInf.forEach(inf => {
                const rem = db('ticktrack_infectionindicatorslog')
                    .where('id', inf.id)
                    .delete()
                    .transacting(trx);
                dels.push(rem)
            });
            Promise.all(dels)
                .then(trx.commit)
                .catch(trx.rollback);
        })
        
    },

    updateSymptoms(db, logid, chgSymp) {
        const symptomlog_id = logid
        
        const sympToChg = chgSymp.map(symp => 
            ({
                id: symp.id,
                symptomlog_id, 
                symptoms_id: symp.symptoms_id, 
                severity_id: symp.severity_id}))
        
        //use transaction to update multiple rows
        return db.transaction(trx => {
            const queries = []
            sympToChg.forEach(symp => {
                const query = db('ticktrack_symptomsdetail')
                    .where('id', symp.id)
                    .update({
                        severity_id: symp.severity_id
                    })
                    .transacting(trx);
                queries.push(query);
            });

            Promise.all(queries)
                .then(trx.commit)
                .catch(trx.rollback);
        });
    },

    addSymptoms(db, logid, newSymp) {
        const symptomlog_id = logid

        const sympToAdd = newSymp.map(symp => ({
            symptomlog_id,
            symptoms_id: symp.symptoms_id,
            severity_id: symp.severity_id
        }))
        
        return db
            .insert(sympToAdd)
            .into('ticktrack_symptomsdetail')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
    
}


    
module.exports = LogService