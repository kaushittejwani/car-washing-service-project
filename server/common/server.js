import Express from 'express';
import Mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import Passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import useragent from 'express-useragent';
import Config from 'config';
import logger from '../helper/logger';
import uncaughtExceptions from '../helper/uncaughtExceptions';
import {
    jwtStrategy,
} from '../helper/passportStrategy';
import ErrorHandler from '../helper/errorHandler';

const app = new Express();
const root = path.normalize(`${__dirname}/../..`);
 

class ExpressServer {
    constructor() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true,
        }));
        Passport.use(jwtStrategy);
        app.use(Passport.initialize());
        app.use(helmet());
        app.use(useragent.express());
        app.use(Express.static(`${root}/public/dist`));
        app.use(Express.static(`${root}/views`))
        app.use(Express.static(`${root}/public`))
          
        app.use('/uploads', Express.static(`${root}/public/uploads`));
        app.use(cors({
            allowedHeaders: ['Content-Type', 'token'],
            exposedHeaders: ['token'],
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
        }));
    }
    router(routes) {
        routes(app);
        return this;
    }

    configureSwagger(swaggerDefinition) {
        const options = {
            swaggerDefinition,
            apis: [path.resolve(`${root}/server/api/v1/controllers/**/*.js`), path.resolve(`${root}/api.yaml`)],
        };
        function requireLogin(request, response, next){
            // console.log('request rec',process.env.swaggerLogin)
            if (Date.now()-process.env.swaggerLogin < 15*60*1000 || true) {
                next();
              } else {
                process.env.swaggerLogin = 0;
                response.sendFile(path.resolve(`${root}/views/login.html`));
              }
        }
        app.use('/api-docs',requireLogin, swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
        app.get('/*', (request, response) => { response.sendFile(path.resolve(`${root}/public/dist/index.html`)); });
        return this;
    }

    handleError() {
        const errorHandler = new ErrorHandler({
            logger,
            shouldLog: true,
        });
        app.use(errorHandler.build());
        app.use(errorHandler.unhandledRequest());

        return this;
    }
    configureDb(dbUrl) {
        return new Promise((resolve, reject) => {
            Mongoose.set('useNewUrlParser', true);
            Mongoose.set('useFindAndModify', false);
            Mongoose.set('useCreateIndex', true);
            Mongoose.connect(dbUrl, err => {
                if (err) {
                    console.log(`Error in mongodb connection ${err.message}`);
                    return reject(err);
                }
                console.log('Mongodb connection established');
                return resolve(this);
            });
        });
    }
    
    listen(port) {
        http.createServer(app).listen(port, () => {
            console.log(`secure app is listening @port ${port}`);
            logger.info(`secure app is listening @port ${port}`);
        });
        return app;
    }
}

export default ExpressServer;