import Express, { Router } from 'express';

const express = require(
    'express'
)

const app = express()

import controller from './controller';

import auth from '../../../../../jwtAuth';



export default Express
    .Router()
    // Post
    .post('/signup', controller.signup)

    .post('/login', controller.login)

    .post('/add', auth, controller.addAddress)

    .post('/carRegistration', auth, controller.carRegistration)

    .post('/selectServices', auth, controller.selectService)

    // Fetch
    .get('/plan/:carType', auth, controller.plansByCarType)

    .get('/allUserServices/:status', auth, controller.getServices)

    // Update
    .put('/updateAddress', auth, controller.update)

    .put('/cancelService/:_id', auth, controller.cancelService)

    //delete
    .delete('/delete/:_id', auth, controller.delete)
