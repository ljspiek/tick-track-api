const express = require('express')
const FieldService = require('./field-service')
const { requireAuth } = require('../middleware/jwt-auth')

const fieldRouter = express.Router()

fieldRouter
    .route('/')
    //loads all fields for form
    .get((req, res, next) => {
        Promise.all([
            FieldService.getGeneralHealth(req.app.get('db')),
            FieldService.getInfections(req.app.get('db')),
            FieldService.getSymptoms(req.app.get('db'))
        ])
        .then(([generalhealth, newinfectionindicators, symptoms]) => {
            res.json({generalhealth, newinfectionindicators, symptoms})
        })
        .catch(next)
    })


module.exports = fieldRouter