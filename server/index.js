import Config from 'config';
import Routes from './routes';
import Server from './common/server';
require('dotenv').config();
const dbUrl = process.env.dbUrl
const server = new Server()
    .router(Routes)
    .configureSwagger(Config.get('swaggerDefinition'))
    .handleError()
    .configureDb(dbUrl)
    .then(_server => _server.listen(Config.get('port')));

export default server;