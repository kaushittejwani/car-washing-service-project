import {
    inspect,
} from 'util';


export default class ErrorHandler {
    constructor({
        logMethod,
        shouldLog = false,
    }) {
        this.shouldLog = shouldLog;
        this.logMethod = logMethod;
    }

    /**
     * @param  {} val
     */
    stringify(val) {
        const {
            stack,
        } = val;
        if (stack) {
            return String(stack);
        }

        const str = String(val);
        return str === toString.call(val) ?
            inspect(val) :
            str;
    }
    /**
     * @param  {} err
     */
    logError(err) {
        if (this.shouldLog) {
            const errorString = this.stringify(err);
            if (typeof this.logMethod === 'function') {
                this.logMethod(errorString);
            } else {
                //console.log(errorString);
            }
        }
    }

    /**
     */
    build() {
        return (err, req, res, next) => {
            console.log('err',err)
            if (err && !res.headersSent) {
                this.logError(err);

                // Handle Boom Errors
                if (err.isBoom) {
                    return res.status(200).json(err.output.payload);
                }

                // Handle statusCode sent by methods
                if (err.statusCode) {
                    return res.status(200).json({
                        message: err.message,
                        error: err.name,
                        statusCode: err.statusCode,
                    });
                }

                // Handle Mongoose casting Errors
                if (err.name === 'CastError') {
                    return res.status(200).json({
                        message: 'A cast error occured.',
                        error: 'Bad Request',
                        statusCode: 400,
                    });
                }

                if (err.name === 'AuthenticationError') {
                    return res.status(200).json({
                        message: err.message,
                        error: err.name,
                        statusCode: 401,
                    });
                }


                // Handle Mongoose casting Errors
                if (err.name === 'MongoError') {
                    return res.status(200).json({
                        message: 'Problem with database operation',
                        error: err.name,
                        statusCode: 500,
                    });
                }

                // Handle Joi validation Errors
                if (err.name === 'ValidationError') {
                    // return res.status(200).json({
                    //     message: err.isJoi ?
                    //         err.message : 'A validation error occured.',
                    //     error: 'Bad Request',
                    //     statusCode: 400,
                    // });
                    return res.status(400).send(err.message);
                }

                // Handle other Internal Error
                return res.status(200).json({
                    message: 'An internal server error occurred',
                    error: 'Internal Server Error',
                    statusCode: 500,
                });
            }

            return next();
        };
    }
    /**
     */
    unhandledRequest() {
        return (req, res, next) => {
            if (!res.headersSent) {
                // Handle unhandled requests
                return res.status(501).json({
                    message: 'Request is not handled',
                    error: 'Not Implemented',
                    statusCode: 501,
                });
            }
            return next();
        };
    }
}