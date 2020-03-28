const Treeize = require('treeize')

const LogService = {
    getAllFields(db) {
        return db
            .from('ticktrack_generalhealth as generalhealth')
            .select(
                'generalhealth.id',
                'generalhealth.rating'
            )
    },

    serializeFields(fields) {
        

        return {
            id: fields.id,
            rating: field.rating
        }
    }
}


module.exports = LogService