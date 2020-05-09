const express = require('express')
const logger = require('../logger')
const LogService = require('./log-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')
const bodyParser = express.json()

const logRouter = express.Router()

logRouter
    //gets all logs for authenticated user
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const id = req.user.id
        Promise.all([
            LogService.getHeaderDataByUser(req.app.get('db'), id),
            LogService.getHealthLogByUser(req.app.get('db'), id),
            LogService.getCountInfectionLogByUser(req.app.get('db'), id)
        ])
        .then(([header, generalhealth, newinfectionindicators]) => {
            
            res.json(LogService.treeizeLog(header, generalhealth, newinfectionindicators))
        })
        .catch(next)
    })
    //post a new log by the authenticated user logged in
    .post(bodyParser, (req, res, next) => {
        
      const { date_created, general_health_id, newinfectionindicators, symptoms, } = req.body;
      const newLog = { date_created, general_health_id }
      const newInf = newinfectionindicators
      const newSymp = symptoms
      
      newLog.user_id = req.user.id
      //first create log and obtain id for subsequent Promises to insert infections and symptoms
      LogService.insertLog(
        req.app.get('db'),
        newLog
        )
        .then((log) => {
          id = log.id
          return id
        })
        //using id created, update infections and symptoms
        .then(function(id) {
          Promise.all([
            
            LogService.insertInfections(
              req.app.get('db'),
              newInf, id 
              ),
            LogService.insertSymptoms(
              req.app.get('db'),
              newSymp, id 
              )
          ])
              
        })
        .then((id) => {
          res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${id}`))
          .json({
            id: id,
          })
        })
        .catch(next)
        
    })

logRouter
    .route('/:log_id')
    .all(requireAuth)
    .all(checkLogExists)
    //get exact log by log id
    .get((req, res) => {
        res.json(res.log)
    })
    //delete log by log id
    .delete((req, res, next) => {
      LogService.deleteLog(
        req.app.get('db'),
        req.params.log_id
      )
        .then(numRowsAffected => {
          
          res
          .status(204)
          .end()
        })
        .catch(next)
    })
    //update existing log - several calls happening to allow new symptoms (newSymp) or infection indicators (new Inf) to be added
    //this route also allows user to delete infection indicators (delInf) if entered in error
    //traditional patch/update occurring for all others (date_created, general_health_id, chgSymp)
    .patch(bodyParser, (req, res, next) => {
        const { date_created, general_health_id, user_id, newinfectionindicators, symptomsnew, symptomschg, deletedinfs } = req.body;
        const updateField = { date_created, general_health_id, user_id, newinfectionindicators, symptomsnew, symptomschg, deletedinfs }
        const newLog = { date_created, general_health_id, user_id }
        const delInf = deletedinfs
        const newInf = newinfectionindicators
        const newSymp = symptomsnew
        const chgSymp = symptomschg
        

        const numberOfValues = Object.values(updateField).filter(Boolean).length
        if(numberOfValues === 0) 
          return res.status(400).json({
            error: {
              message: `Request body must contain either 'date_created', 'general_health_id', 'newinfectionindicators', or 'symptoms'`
            }
          })
          
          
          Promise.all([
            LogService.updateLog(
              req.app.get('db'),
              req.params.log_id,
              newLog,
            ),
            LogService.insertInfections(
              req.app.get('db'),
              newInf,
              req.params.log_id
            ),
            LogService.updateInfections(
              req.app.get('db'),
              delInf
            ),
            LogService.updateSymptoms(
              req.app.get('db'),
              req.params.log_id,
              chgSymp
            ),
            LogService.addSymptoms(
              req.app.get('db'),
              req.params.log_id,
              newSymp
            )
          ])
          .then(() => {
            res
            .status(204).end()
          })
          .catch(next)
        })
    

logRouter
    //obtain users
    .route('/user/:user_id')
    .all(requireAuth)
    .all(checkUserLogExists)
    .get((req, res) => {
        res.json(res.log)
    })


    //asynchronous functions to check if a Log Exists before completing a PATCH, DELETE, or GET by id
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

//asynchronous functions to check if a USER Exists before completing a PATCH, DELETE, or GET by id
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
