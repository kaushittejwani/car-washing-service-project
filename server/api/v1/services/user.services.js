import Boom from 'boom';
import Mongoose from 'mongoose';

import User from '../models/user';

export class UserServices {
    checkDuplicateUser(email, done) {
        const _user = new User();
        _user.model.find({
            email,
        }, (err, result) => {
            if (err) {
                return done(err);
            }
            if (result.length) {
                return done(null, true);
            }

            return done(null);
        });
    }

    insertUser(userInfo, done) {
        const _user = new User();

        _user.model.create(userInfo, (err, doc) => {
            if (err) {
                return done(err);
            }

            return done(null, doc.toJSON());
        });
    }

    updateUser(condition, updateObject, projection, done) {
        const _user = new User();
        _user.model.findOneAndUpdate(condition, updateObject, { new: true, projection }, (err, info) => {
            if (err) {
                return done(err);
            }

            return done(null, info ? info.toJSON() : null);
        });
    }
}

export default new UserServices();
