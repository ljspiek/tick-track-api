const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
    let db

    const {
        testUsers,
        testLogs,
        testInfs,
        testSymps
    } = helpers.makeLogFixtures()

    


    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db)) 
    
    afterEach('cleanup', () => helpers.cleanTables(db))

    this.beforeEach('insert logs', () => 
        helpers.seedLogTables(
            db,
            testUsers,
            testLogs,
            testInfs,
            testSymps
        )
    )

    const protectedEndpoints = [
        {
            name: 'GET /api/log',
            path: '/api/log',
            method: supertest(app).get
        },
        {
            name: 'GET /api/log/:log_id',
            path: '/api/log/1',
            method: supertest(app).get
        },
        {
            name: 'POST /api/log',
            path: '/api/log',
            method: supertest(app).post,
        },
        {
            name: 'DELETE /api/log/:log_id',
            path: '/api/log/2',
            method: supertest(app).delete,
        },
        {
            name: 'PATCH /api/log/:log_id',
            path: '/api/log/1',
            method: supertest(app).patch,
        }
    ]

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds 401 'Unauthorized request' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: 'Missing bearer token' })
            })
            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: 'Unauthorized request'})
            })
            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { email: 'email@nonexistent.com', id: 1 }
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: 'Unauthorized request' })
            })
        })

    })

   
})