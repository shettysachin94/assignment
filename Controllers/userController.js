'use-strict';

let mongoose = require('mongoose');;
let functions = require('../Utils/functions');
let Constants = require('../Configs/constants.js');
let passport = require('passport');
let TOTP = require('onceler').TOTP;
let User = mongoose.model('User');
let MESSAGE = Constants.messages;
let CODE = Constants.codes;

module.exports = (function() {
    return {
        create: function(req, res, next) {
            functions.checkRequired(req, res, ['email', 'password'],
                function(err) {
                    let user = new User();
                    if (req.body.email) {
                        user.email = req.body.email;
                    }
                    functions.encryptPassword(req.body.password, function(err, password) {
                        if (err) {
                            return functions.error(res, CODE.DB_FAILURE, MESSAGE.PASSWORD_ENCRYPTION_FAILED, 1013);
                        } else {
                            user.password = password;
                        }
                        user.save(function(err, user) {
                            if (err) {
                                return functions.error(res, CODE.DB_FAILURE, err.message, 1005);
                            } else {
                                functions.sendData(res, user);
                            }
                        })
                    });
                });
        },


        //login
        login: function(req, res, next) {
            functions.checkRequired(req, res, ['email', 'password'],
                function(err) {
                    if (!err) {
                        passport.authenticate('user_local', function(err, user, info) {
                            if (err) {
                                return next(err);
                            }
                            if (info) {
                                if (info.message === 'invalidEmail') {
                                    return functions.error(res, CODE.NOT_AUTHERIZED, MESSAGE.INVALID_EMAIL, 1002);
                                }
                                if (info.message === 'invalidPassword') {
                                    return functions.error(res, CODE.NOT_AUTHERIZED, MESSAGE.INVALID_PASSWORD, 1003);
                                }
                                if (info.message === 'notVerified') {
                                    return functions.error(res, CODE.NOT_AUTHERIZED, MESSAGE.NOT_letIFIED, 1012);
                                }
                            }
                            if (!user) {
                                return functions.error(res, CODE.NOT_FOUND, 'User Not Found', 3004);
                            }
                            user.lastLoginTimestamp = Date.now;
                            functions.generateTokens(user, function(err, tokenValue, refreshTokenValue, expires, en) {
                                if (!err) {
                                    functions.sendData(res, {
                                        'accessToken': { tokenValue: tokenValue, expiresInMin: expires.accessTokenExpires_in },
                                        'refreshToken': { refreshTokenValue: refreshTokenValue, expiresInMin: expires.refreshTokenExpires_in },
                                        'user': user,
                                    });
                                } else {
                                    return functions.error(res, CODE.FORBIDDEN, MESSAGE.UNABLE_TO_GENERATE_TOKEN, 1013);
                                }
                            });
                        })(req, res, next);
                    }
                }
            );
        },

        //Logout
        forgotPassword: function(req, res) {
            functions.checkRequired(req, res, ['email'],
                function(err) {
                    if (!err) {
                        let totp = new TOTP('IFAUCQKCIJBEE===');
                        //here send the code to email
                        let query = { email: req.query.email }
                        User.findOne(query, function(err, user) {
                            if (err) {
                                return functions.error(res, CODE.DB_FAILURE, MESSAGE.DB_FAILURE, 1005);
                            } else if (!user) {
                                return functions.error(res, CODE.NOT_FOUND, MESSAGE.NO_RECORDS, 5001);
                            } else {
                                verificationCode = { code: totp.now(), createdTimeStamp: Date.now() };
                                user.verificationCode = verificationCode;
                                user.save(function(err, user1) {
                                    if (err) {
                                        return functions.error(res, CODE.DB_FAILURE, err.message, 1005);
                                    } else {
                                        functions.sendData(res, { verificationCode: verificationCode, message: "Please use this code to reset the password" });
                                    }
                                });
                            }
                        });
                    }
                });
        },

        reset: function(req, res) {
            functions.checkRequired(req, res, ['email', 'verificationCode', 'newPassword'],
                function(err) {
                    if (!err) {
                        let query = { email: req.body.email, "verificationCode.code": req.body.verificationCode }
                        User.findOne(query, function(err, user) {
                            console.log(err, user, query, "<>>>>>>>>>>>>.")
                            if (err) {
                                return functions.error(res, CODE.DB_FAILURE, MESSAGE.DB_FAILURE, 1005);
                            } else if (!user) {
                                return functions.error(res, CODE.NOT_FOUND, MESSAGE.NO_RECORDS, 5001);
                            } else {
                                functions.encryptPassword(req.body.newPassword, function(err, password) {
                                    if (err) {
                                        return functions.error(res, CODE.DB_FAILURE, MESSAGE.PASSWORD_ENCRYPTION_FAILED, 1013);
                                    } else {
                                        user.password = password;
                                        user.save(function(err, newUser) {
                                            res.send(newUser);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
        }
    }

}());
