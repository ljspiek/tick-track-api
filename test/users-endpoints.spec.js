const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    email: 'happy_path@useremail.com',
                    password: '11AAaa!!'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', {timeZone: 'UTC'})
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res => 
                        db
                        .from('ticktrack_users')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.email).to.eql(newUser.email)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(row.date_created).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)

                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true
                        })
                        )
            })
        })
    })
})