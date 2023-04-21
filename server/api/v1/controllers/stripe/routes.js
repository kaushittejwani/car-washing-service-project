import Express, { Router } from 'express';

import { express } from 'express-useragent';

const bodyParser = require('body-parser');

const auth = require('../../../../../jwtAuth')

import controller from './controller';



export default Express
   .Router()
   // Post
   .post('/generateCheckoutUrl', auth, controller.generateCheckoutUrl)

   .post('/saveCustomerIdWebhook', bodyParser.raw({ verify: (req, res, buf) => { req.body = buf } }), controller.saveCustomerIdWebhook)

   .post('/subscriptionUpdatedWebhook', bodyParser.raw({ type: 'application/json' }), controller.subscriptionUpdatedWebhook)

   .post('/customerPortal', auth, bodyParser.raw({ type: 'application/json' }), controller.customerPortal)

   .post('/cancelSubscription', bodyParser.raw({ type: 'application/json' }), controller.cancelSubscription)

   .post('/createCustomerSubscriptionWebhook', bodyParser.raw({ type: 'application/json' }), controller.createCustomerSubscriptions)







