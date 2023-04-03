import Express, { Router } from 'express';
import { express } from 'express-useragent';
const bodyParser=require('body-parser');
const auth = require('../../../../../jwtAuth')

import controller from './controller';



export default Express
    .Router()
    // Post
    .post('/generateCheckoutUrl', auth, controller.generateCheckoutUrl)
    
 //   .post('/customerPortalSession',auth,controller.customerPortal)
    .post('/saveCustomerIdWebhook',auth,bodyParser.raw({type:'application/json'}),controller.saveCustomerIdWebhook)
 //   .post('/subscriptionUpdatedWebhook',auth,bodyParser.raw({type:'application/json'}),controller.subscriptionUpdatedWebhook)
    //.post('/webhook',bodyParser.raw({type:'application/json'}),controller.unsucess)


