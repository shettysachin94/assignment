"use strict";

/**
 * Module dependencies.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
const validators = require('mongoose-validators');


/*
 * User Schema
 */
let UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    verificationCode: {
        code: String,
        createdTimeStamp: String
    },
    isActive: {
        type: Boolean,
        default: true
    }

});


UserSchema.method('toJSON', function() {
    let user = this.toObject();
    delete user.password;
    return user;
});


UserSchema = require('./index.js')(UserSchema);

module.exports = mongoose.model('User', UserSchema);
