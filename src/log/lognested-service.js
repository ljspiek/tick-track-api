const joinjs = require('join-js').default

const resultMaps = [
    {
        mapId: 'logMap',
        idProperty: 'id',
        properties: ['name', {'date': 'log_date' }],
        associations: [
            { name: 'generalhealth', mapdId: 'generalhealthMap', columnPrefix: 'generalhealth_'}
        ],
        // collections: [
        //     { name: 'infectionindicators', mapId: 'infectionMap', columnPrefix: 'infection_' },
        //     { name: 'symptoms', mapdId: 'symptomsMap', columnPrefix: 'symptoms_' }
        // ]
    },
    {
        mapId: 'generalhealthMap',
        idProperty: 'id',
        properties: ['name']
    },
    
];

const LogNestedService = {
    getNested(db) {
        return db
        .from('ticktrack_logs as logs')
        .select(
            'logs.id as log_id',
            'logs.date_created as log_date',
            'generalhealth.id as generalhealth_id',
            'generalhealth.rating as generalhealth_rating'
        )
        .leftJoin(
            'ticktrack_generalhealth as gh',
            'gh.generalhealth_id',
            'logs.general_health_id'
        )
        .then(function(resultSet) {
            return joinjs.map(resultSet, resultMaps, 'logMap','log_')
        })
    }
}



module.exports = LogNestedService