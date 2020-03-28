const FieldService = {
    getGeneralHealth(db) {
        return db
            .from('ticktrack_generalhealth as generalhealth')
            .select(
                'generalhealth.id',
                'generalhealth.rating'
            )
    },

    getSymptoms(db) {
        return db
            .from('ticktrack_symptoms as symptoms')
            .select(
                'symptoms.id',
                'symptoms.symptom'
            )
    },

    getInfections(db) {
        return db 
            .from('ticktrack_newinfections as newinfectionindicators')
                .select(
                    'newinfectionindicators.id',
                    'newinfectionindicators.indicator'
                )
    }
}

module.exports = FieldService