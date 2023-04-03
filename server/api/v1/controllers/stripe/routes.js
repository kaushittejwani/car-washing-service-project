import Express, { Router } from 'express';
import { express } from 'express-useragent';
const bodyParser=require('body-parser');
const auth = require('../../../../../jwtAuth')

import controller from './controller';



export default Express
    .Router()
    // Post
    .post('/generateCheckoutUrl', auth, controller.generateCheckoutUrl)
    
    .post('/customerPortalSession',controller.customerPortal)
    .post('/customerIdWebhook',auth,bodyParser.raw({type:'application/json'}),controller.webhook)
    .post('/subscriptionUpdatedWebhook',bodyParser.raw({type:'application/json'}),controller.webhook)
    //.post('/webhook',bodyParser.raw({type:'application/json'}),controller.unsucess)


