const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Log Endpoints', function() {
    let db

    const {
        testUsers,
        testLogs,
        testInfs,
        testSymps
    } = helpers.makeLogFixtures()

    before('make knex instance', () => {
        db =knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    
    before('cleanup', () => helpers.cleanTables(db))
    
    beforeEach('insert logs', () => 
        helpers.seedLogTables(
            db,
            testUsers,
            testLogs,
            testInfs,
            testSymps
        )
    )

    afterEach('cleanup', () => helpers.cleanTables(db))

    after('disconnect from db', () => db.destroy())

    describe(`POST /api/log`, () => {
        context(`Happy path POST`, () => {
            it(`creates a log, responding with 201`, () => {
              
                this.retries(3)
                const testUser = testUsers[0]
                const newLog = {
                    date_created: '2020-04-26',
                    general_health_id: 3,
                    user_id: testUser.id,
                    newinfectionindicators: [],
                    symptoms: [
                        {
                            symptoms_id: 2,
                            severity_id: 3
                        },
                        {
                            symptoms_id: 4,
                            severity_id: 2
                        }
                    ]
                }
             

                return supertest(app) 
                    .post('/api/log')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newLog)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.be.a('object');
                        expect(res.headers.location).to.equal(`/api/log/${res.body.id}`)
                        
                    })
            })
        })
    })

    describe(`GET /api/log`, () => {
        context(`Happy path`, () => {
            it('responds 200', () => {
              
                return supertest(app)
                    .get('/api/log')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
            })
        })
    })

    

    describe(`GET /api/log/:log_id`, () => {
        context('Happy path', () => {
            it(`gets a log, responding with 200`, () => {
                const logId = 1
                
                return supertest(app)
                    .get(`/api/log/${logId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.be.a('object')
                        expect(res.body).to.include.keys('header', 'generalhealth', 'newinfectionindicators', 'symptoms')
                        expect(res.body).to.have.property('header')
                        expect(res.body.header).to.be.a('array')
                        expect(res.body.header[0].log_id).to.eql(logId)
                        expect(res.body.generalhealth).to.be.a('array')
                        expect(res.body.generalhealth[0].log_id).to.eql(logId)
                        expect(res.body.newinfectionindicators).to.be.a('array')
                        expect(res.body.symptoms).to.be.a('array')
                    })
            })
        })
    })

    describe(`DELETE /api/log/:log_id`, () => {
        context('Happy path for DELETE', () => {
            it(`deletes a log, responding with 204`, () => {
                const logId = 2

                return supertest(app)
                    .delete(`/api/log/${logId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
            })
        })
    })

    describe(`PATCH /api/log/:log_id`, () => {
        context('Happy path for PATCH', () => {
            it(`updates a log when given valid data and id, responding with 204`, () => {
                const logId = 3
                const logUpdate = {
                    date_created: '2020-04-29',
                    general_health_id: 3,
                    user_id: 1,
                    newinfectionindicators: [],
                    symptomsnew: [],
                    symptomschg: [],
                    deletedinfs: []

                }

               
                return supertest(app)
                    .patch(`/api/log/${logId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(logUpdate)
                    .expect(204)
                    
            })
        })
    })
})