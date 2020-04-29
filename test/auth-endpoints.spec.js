const knex = require('knex')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', function() {
    let db

    const { testUsers } = helpers.makeLogFixtures()
    const testUser = testUsers[0]

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

    describe(`POST /api/auth/login`, () => {
        beforeEach('insert users', () => 
            helpers.seedUsers(
                db,
                testUsers
            )
        )

        context(`Happy Path`, () => {
            it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
                const userValidCreds = {
                    email: testUser.email,
                    password: testUser.password
                }
               
                const expectedToken = jwt.sign(
                    { user_id: testUser.id },
                    process.env.JWT_SECRET,
                    {
                        subject: testUser.email,
                        algorithm: 'HS256'
                    }
                )
                return supertest(app)
                    .post('/api/auth/login')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(userValidCreds)
                    .expect(200, {
                        authToken: expectedToken
                    })
            })
        })
    })
})