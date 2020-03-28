const express = require('express')
const LogService = require('./log-service')
const { requireAuth } = require('../middleware/jwt-auth')

const logRouter = express.Router()

logRouter
    .route('/')
    .get((req, res, next) => {
        LogService.getAllFields(req.app.get('db'))
            .then(fields => {
                console.log(fields)
                res.json(fields)
            })
            .catch(next)
    })


module.exports = logRouter
