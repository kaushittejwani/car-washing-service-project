import { transports, format, createLogger } from 'winston';
import fs from 'fs';
import path from 'path';


const logDir = path.normalize(`${__dirname}/../../log`);
const {
    combine,
    timestamp,
    label,
    prettyPrint,
} = format;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const console = createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        new transports.File({
            filename: `${logDir}/info.log`,
            level: 'info',
        }),
        new transports.File({
            filename: `${logDir}/errors.log`,
            level: 'error',
        }),
        new transports.File({
            filename: `${logDir}/warn.log`,
            level: 'warn',
        }),
        new transports.File({
            filename: `${logDir}/debug.log`,
            level: 'debug',
        }),
    ],
});

export class Logger {
    log(msg) {
        console.info(msg);
    }
    info(msg) {
        console.info(msg);
    }
    warn(msg) {
        console.warn(msg);
    }
    debug(msg) {
        console.debug(msg);
    }
    error(msg) {
        console.error(msg);
    }
}

export default new Logger();