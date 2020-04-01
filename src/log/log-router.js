const express = require('express')
const LogService = require('./log-service')
const LogNestedService = require('./lognested-service')
const { requireAuth } = require('../middleware/jwt-auth')
const bodyParser = express.json()

const logRouter = express.Router()

logRouter
    .route('/')
    .get((req, res, next) => {
        Promise.all([
            LogService.getLogHeader(req.app.get('db')),
            LogService.getAllLoggedHealthRatings(req.app.get('db')),
            LogService.getCountNewInfections(req.app.get('db'))
        ])
        .then(([header, generalhealth, newinfectionindicators]) => {
            res.json(LogService.treeizeLog(header, generalhealth, newinfectionindicators))
        })
        .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        
    })

logRouter
    .route('/:log_id')
    .all(checkLogExists)
    .get((req, res) => {
        res.json(res.log)
    })

logRouter
    .route('/user/:user_id')
    .all(checkUserLogExists)
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

    const header = await LogService.getHeaderDatabyId(
      req.app.get('db'),
      req.params.log_id
    )


    if (!symptoms || !health || !infections || !header) 
      return res.status(404).json({
        error: `Log doesn't exist`
      })

    res.log = {
        header: header,
        generalhealth: health, 
        newinfectionindicators: infections,
        symptoms: symptoms}
    next()
  } catch (error) {
    next(error)
  }
}

async function checkUserLogExists(req, res, next) {
    try {
      const symptoms = await LogService.getSymptpomLogByUser(
        req.app.get('db'),
        req.params.user_id
      )
  
      const health = await LogService.getHealthLogByUser(
          req.app.get('db'),
          req.params.user_id
      )
  
      const infections = await LogService.getInfectionLogByUser(
          req.app.get('db'),
          req.params.user_id
      )
  
  
      if (!symptoms || !health || !infections)
        return res.status(404).json({
          error: `Log doesn't exist`
        })
  
      res.log = {
          generalhealth: health, 
          newinfectionindicators: infections,
          symptoms: symptoms}
      next()
    } catch (error) {
      next(error)
    }
  }
module.exports = logRouter
