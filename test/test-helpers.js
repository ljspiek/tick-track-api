const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return[
        {
            id: 1,
            email: 'testuser1@one.com',
            password: 'Password1!',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            email: 'testuser1@two.com',
            password: 'Password2!',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 3,
            email: 'testuser3@three.com',
            password: 'Password3!',
            date_created: '2029-01-22T16:28:32.615Z'
        }
    ]
}

function makeLogArray() {
    return[
        {
            user_id: 1,
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            general_health_id: 3
        },
        {
            user_id: 1,
            date_created:new Date('2029-01-22T16:28:32.615Z'),
            general_health_id: 2
        },
        {
            user_id: 2,
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            general_health_id: 4
        },
        {
            user_id: 2,
            date_created:new Date('2029-01-22T16:28:32.615Z'),
            general_health_id: 3
        },
        {
            user_id: 3,
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            general_health_id: 5
        },
        {
            user_id: 3,
            date_created:new Date('2029-01-22T16:28:32.615Z'),
            general_health_id: 5
        }
    ]
}

function makeInfIndLogArray() {
    return[
        {
            symptomlog_id: 1,
            newinfectionindicators_id: 1
        },
        {
            symptomlog_id: 1,
            newinfectionindicators_id: 2
        },
        {
            symptomlog_id: 3,
            newinfectionindicators_id: 3
        }
    ]
}

function makeSympsDtArray() {
    return [
        {
            symptomlog_id: 1,
            symptoms_id: 2,
            severity_id: 3
        },
        {
            symptomlog_id: 1,
            symptoms_id: 3,
            severity_id: 3
        },
        {
            symptomlog_id: 1,
            symptoms_id: 4,
            severity_id: 2
        },
        {
            symptomlog_id: 2,
            symptoms_id: 2,
            severity_id: 3
        }
        {
            symptomlog_id: 2,
            symptoms_id: 5,
            severity_id: 3
        },
        {
            symptomlog_id: 3,
            symptoms_id: 1,
            severity_id: 2
        },
        {
            symptomlog_id: 4,
            symptoms_id: 2,
            severity_id: 3
        },
        {
            symptomlog_id: 4,
            symptoms_id: 3,
            severity_id: 3
        },
        {
            symptomlog_id: 5,
            symptoms_id: 4,
            severity_id: 2
        },
        {
            symptomlog_id: 5,
            symptoms_id: 2,
            severity_id: 3
        }
        {
            symptomlog_id: 6,
            symptoms_id: 5,
            severity_id: 3
        },
        {
            symptomlog_id: 6,
            symptoms_id: 1,
            severity_id: 2
        }
    ]
}

function makeLogFixtures() {
    const testUsers = makeUsersArray()
    const testLogs = makeLogArray()
    const testInfs = makeInfIndLogArray()
    const testSymps = makeSympsDtArray()
    return { testUsers, testLogs, testInfs, testSymps }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                ticktrack_users,
                ticktrack_logs,
                ticktrack_infectionindicatorslog,
                ticktrack_symptomsdetail
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE ticktrack_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE ticktrack_logs_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE ticktrack_infectionindicators_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE ticktrack_symptomsdetail_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('ticktrack_users_id_seq', 0)`),
                trx.raw(`SELECT setval('ticktrack_logs_id_seq', 0)`),
                trx.raw(`SELECT setval('ticktrack_infectionindicators_id_seq', 0)`),
                trx.raw(`SELECT setval('ticktrack_symptomsdetail_id_seq', 0)`),
            ])
        )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('ticktrack_users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('ticktrack_users_id_seq', ?)`,
                [users[users.length -1].id]
            )
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }


module.exports = {
    makeUsersArray,
    cleanTables,
    makeAuthHeader,
    makeLogFixtures
}