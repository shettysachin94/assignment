/**
 * Module dependencies.
 */
let env = process.env.NODE_ENV || 'development';
let config = require('../../Configs/config')[env];
let mongoose = require('mongoose');
let LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
let User = mongoose.model('User');

module.exports = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        query = { email: email };
        User.findOne(query, function(err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message: 'invalidEmail' });
            } else {
                crypto.pbkdf2(password, config.saltKey, 1000, 32, 'sha512', (err, derivedKey) => {
                    if (err) {
                        return done(null, false, { message: 'invalidPassword' });
                    } else {
                        if (derivedKey.toString('hex') === user.password) {
                            user.password = null;
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'invalidPassword' });
                        }
                    }
                });
            }
        });
    }
);
