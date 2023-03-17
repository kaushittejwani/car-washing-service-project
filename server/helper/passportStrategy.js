import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';
import Config from 'config';
import Jwt from 'jsonwebtoken';
import Passport from 'passport';
import Boom from 'boom';
import User from '../api/v1/models/user';
import Mongoose from 'mongoose';


const jwtStrategy = new Strategy({
    secretOrKey: Config.get('jwtsecret'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (jwtPayload, done) => {
    const _user = new User();
    
    _user.model.findOne({ _id: Mongoose.Types.ObjectId(jwtPayload.id) }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

Passport.serializeUser((user, done) => {
    done(null, user);
});

Passport.deserializeUser((user, done) => {
    done(null, user);
});

const generateJwt = (payload, done) => {
    Jwt.sign(
        payload, Config.get('jwtsecret'),
        Config.get('jwtOptions'),
        (tokenError, token) => {
            if (tokenError) {
                return done(Boom.badImplementation(tokenError.message, tokenError));
            }
            return done(null, token);
        },
    );
};


const authenticate = () =>
    Passport.authenticate('jwt', {
        failWithError: true,
    });

const authenticIPs = (request, response, next) => {
    const whiteListedIPs = Config.get('whiteListedIPs');
    const reqIP = (request.headers['x-real-ip'] || request.connection.remoteAddress).replace(/^.*:/, '');

    if (whiteListedIPs.indexOf(reqIP) > -1) {
        next();
    } else {
        response.send(Boom.unauthorized('Unauthorized access'));
    }
};

module.exports = {
    jwtStrategy,
    generateJwt,
    authenticate,
    authenticIPs,
};