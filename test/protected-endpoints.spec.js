const knex = require('knex')
const app = require('../src/auth')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
    let db

    const {
        testUsers,
        testLogs,
        testInfs,
        testSymps
    } = helpers.makeLogFixtures

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db)) 
    
    afterEach('cleanup', () => helpers.cleanTables(db))

    beforeEach('insert logs', () => 
    //seed logs
    )
})