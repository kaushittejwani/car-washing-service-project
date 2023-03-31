import Express, { Router } from 'express';
import { express } from 'express-useragent';
const bodyParser=require('body-parser');

import controller from './controller';



export default Express
    .Router()
    // Post
    .post('/basicMonthly',  controller.createBasicMonthly)
    .post('basicYearly',  controller.createBasicYearly)
    .post('/standardMonthly',  controller.createStandardMonthly)
    .post('/standardYearly', controller.createStandardYearly)
    .post('/premiumMonthly',  controller.createPremiumMonthly)
    .post('/premiumYearly',  controller.createPremiumYearly)
    .post('/customerPortalSession',controller.customerPortal)
    .post('/webhook',bodyParser.raw({type:'application/json'}),controller.webhook)
    //.post('/webhook',bodyParser.raw({type:'application/json'}),controller.unsucess)


