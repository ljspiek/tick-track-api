const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    //creates new user
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, email } = req.body
    //first confirms required information is present
    for (const field of ['email', 'password'])
        if (!req.body[field])
            return res.status(400).json({
            error: `Missing '${field}' in request body`
            })

        const passwordError = UsersService.validatePassword(password)
    
        if (passwordError)
            return res.status(400).json({ error: passwordError })
//compares to existing user with same email address
        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(hasUserWithEmail => {
            if (hasUserWithEmail)
                return res.status(400).json({ error: `Email already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            email,
                            password: hashedPassword,
                            date_created: 'now()',
                            }
                
                    return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                    )
                    .then(user => {
                        res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(UsersService.serializeUser(user))
                    })
                })
                    
    res.send('ok')
    
  })
  .catch(next)
})

module.exports = usersRouter