const express = require('express')
const LogNestedService = require('./lognested-service')

const lognestedRouter = express.Router()

lognestedRouter
    .route('/')
    .get((req, res) => {
        LogNestedService.getNested(req.app.get('db'))
        .then((response) => {
            res.json(response)
            console.log(response)
        })
    })

module.exports = lognestedRouter