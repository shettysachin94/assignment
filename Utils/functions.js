/**
 * Project          : Firebird
 * Module           : Utility
 * Source filename  : functions.js
 * Description      : Common functions.
 * Author           : Sachin Shetty S <sachin.shetty@robosoftin.com>
 * Copyright        : Copyright © 2017,
 *                    Written under contract by Robosoft Technologies Pvt. Ltd.
 */

"use strict";

var env = process.env.NODE_ENV || 'development';
var config = require('../Configs/config')[env];
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var _ = require('lodash');
var Constants = require('../Configs/constants.js');
var async = require('async');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var CODE = Constants.codes;
var MESSAGE = Constants.messages;


var errFn = function(cb, err) {
    if (err) {
        return cb(err);
    }
};

module.exports = {
    error: function(res, httpStatus, errorMessage, customErrorCode) {
        module.exports.notifyError(res, errorMessage, httpStatus, httpStatus, customErrorCode);
    },
    notifyError: function(res, errorMessage, errorCode, httpStatus, customErrorCode) {
        console.log('error', 'Error code :', errorCode)
        console.log('error', 'Error Message : ', errorMessage);
        res
            .status(httpStatus)
            .json({
                meta: {
                    code: errorCode,
                    errorMessage: errorMessage,
                    customErrorCode: customErrorCode,
                    currentDate: new Date().toISOString()
                }
            });
    },
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        passport.authenticate('bearer', {
            session: false,
        }, function(err, user) {
            var self = this;
            if (err) {
                return module.exports.error(res, 401, err);
            } else if (!user) {
                return next();
            } else {
                var sendContent = function() {
                    req.user = user;
                    res.set({
                        "Authentication": "Success"
                    });
                }
                sendContent();
                return next();
            }
        })(req, res, next);
    },
    ensureAdminAuthenticated: function(req, res, next) {
        return next();
    },
    // Generates a new access and refresh token
    generateTokens: function(data, done) {
        var refreshToken,
            refreshTokenValue,
            accessToken,
            accessTokenValue,
            languagePrefered = 'EN'

        var sendToken = function() {
            done(null, accessTokenValue, refreshTokenValue, {
                'accessTokenExpires_in': config.security.accessTokenLife,
                'refreshTokenExpires_in': config.security.refreshTokenLife
            }, languagePrefered);
        };
        const payload = {
            userId: data._id
        };

        accessTokenValue = jwt.sign(payload, config.security.secretKey, { expiresIn: config.security.accessTokenLife }) // expires in min});
        refreshTokenValue = jwt.sign(payload, config.security.secretKey, { expiresIn: config.security.refreshTokenLife }); // expires in min
        sendToken();
    },
    // Destroys any old access tokens and generates a new access token.
    refreshTokens: function(tokenData, done) {
        var refreshTokenValue,
            accessToken,
            accessTokenValue

        console.log('verbose', 'Refresh token validation ...');

        var sendToken = function() {
            done(null, accessTokenValue, refreshTokenValue, {
                'accessTokenExpires_in': config.security.accessTokenLife,
                'refreshTokenExpires_in': config.security.refreshTokenLife
            });
        };
        const payload = {
            userId: tokenData.userId
        };
        jwt.verify(tokenData.refreshtToken, config.security.secretKey, function(err, decoded) {
            if (err) {
                return done(null, false, err);
            } else {
                accessTokenValue = jwt.sign(payload, config.security.secretKey, { expiresIn: config.security.accessTokenLife }) // expires in min});
                refreshTokenValue = jwt.sign(payload, config.security.secretKey, { expiresIn: config.security.refreshTokenLife }); // expires in min
                sendToken();
            }
        });
    },
    //Success message
    sendData: function(res, data, httpStatus, pagination) {
        //errorCode = (typeof errorCode === 'undefined') ? 0 : errorCode;
        httpStatus = (typeof httpStatus === 'undefined') ? 200 : httpStatus;
        if (data && (data.skip || data.limit)) {
            res.status(httpStatus).json({
                meta: {
                    code: httpStatus,
                    currentDate: new Date().toISOString(),
                },
                pagination: {

                },
                data: data
            });
        } else {
            res.status(httpStatus).json({
                meta: {
                    code: httpStatus,
                    currentDate: new Date().toISOString(),
                },
                data: data
            });
        }
    },
    //Check Required Parameters
    checkRequired: function(req, res, params, cb) {
        async.each(params, function(param, callback) {
            if ((req.method == 'POST' || req.method == 'PUT') && typeof req.body[param] == 'undefined') {
                module.exports.notifyError(res, 'ParameterMissing', 400, 400, 'Parameter `' + param + '\' missing in request');
            } else {
                callback();
            }
        }, function(err) {
            if (err) {
                return cb(err)
            } else {
                return cb(null)
            }
        });
    },
    encryptPassword: function(password, callback) {
        crypto.pbkdf2(password, config.saltKey, 1000, 32, 'sha512', (err, derivedKey) => {
            if (err) {
                return odule.exports.error(res, 500, err);
            } else {
                console.log('verbose', 'encrypting password ...');
                callback(null, derivedKey.toString('hex'));


            }
        });
    }
}
