"use strict";


var mongoose    = require('mongoose'); 
var local       = require('./passport/local');

module.exports = function (passport, config) {
  // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    // use these strategies
  passport.use('user_local', local);
};
