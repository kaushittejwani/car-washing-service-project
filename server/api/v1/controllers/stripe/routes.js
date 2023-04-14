import Express, { Router } from 'express';
import { express } from 'express-useragent';
const bodyParser = require('body-parser');
const auth = require('../../../../../jwtAuth')
import controller from './controller';

export default Express
   .Router()
   // Post
   .post('/generateCheckoutUrl', auth, controller.generateCheckoutUrl)
   .post('/saveCustomerIdWebhook', auth, bodyParser.raw({ type: 'application/json' }), controller.saveCustomerIdWebhook)
   .post('/subscriptionUpdatedWebhook', auth, bodyParser.raw({ type: 'application/json' }), controller.subscriptionUpdatedWebhook)
   .post('/customerPortal', auth, bodyParser.raw({ type: 'application/json' }), controller.customerPortal)


