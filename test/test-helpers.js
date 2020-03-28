const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
function makeUsersArray() {
    return[
        {
            id: 1,
            email: 'testuser1@one.com',
            password: 'password1',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            email: 'testuser1@two.com',
            password: 'password2',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 3,
            email: 'testuser3@three.com',
            password: 'password3',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 4,
            email: 'testuser4@one.com',
            password: 'password4',
            date_created: '2029-01-22T16:28:32.615Z'
        }
    ]
}