import Express, { Router } from 'express';
const express = require(
    'express'
)
const app = express()
import adminAuth from "../../../../../jwtAuth"
import controller from './controller';


export default Express
    .Router()
    // Post
    .post('/service/plans', adminAuth, controller.createPlans)


    // Fetch
    .get('/showAll/Plans', adminAuth, controller.showPlans)

    // Update
    .put('/updatePlan/:carType/:_id', adminAuth, controller.updatePlan)

    // delete
    .delete('/deleteCar/:carType', adminAuth, controller.deleteCar)
    .delete('/deletePlan/:carType/:objectId', adminAuth, controller.deletePlan)




