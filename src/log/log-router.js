const express = require('express')
const LogService = require('./log-service')
const { requireAuth } = require('../middleware/jwt-auth')

const logRouter = express.Router()

logRouter
    .route('/')
    .get((req, res, next) => {
        Promise.all([
            LogService.getAllLoggedSymptoms(req.app.get('db')),
            LogService.getAllLoggedHealthRatings(req.app.get('db')),
            LogService.getAllNewInfections(req.app.get('db'))
        ])
        .then(([symptoms, generalhealth, newinfectionindicators]) => {
            res.json({symptoms, generalhealth, newinfectionindicators})
        })
    })

logRouter
    .route('/:log_id')
    .all(checkLogExists)
    .get((req, res) => {
        res.json(res.log)
    })


async function checkLogExists(req, res, next) {
  try {
    const symptoms = await LogService.getSymptpomLogById(
      req.app.get('db'),
      req.params.log_id
    )

    const health = await LogService.getHealthLogById(
        req.app.get('db'),
        req.params.log_id
    )

    const infections = await LogService.getInfectionLogById(
        req.app.get('db'),
        req.params.log_id
    )


    if (!symptoms || !health || !infections)
      return res.status(404).json({
        error: `Log doesn't exist`
      })

    res.log = [health, infections, symptoms]
    next()
  } catch (error) {
    next(error)
  }
}
module.exports = logRouter
