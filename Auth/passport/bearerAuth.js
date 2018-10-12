
/**
 * Module dependencies.
 */
var env             = process.env.NODE_ENV || 'development';
var config          = require('../../Configs/config')[env];
var mongoose        = require('mongoose');
var functions       = require('../../Utils/functions');
var jwt             = require('jsonwebtoken')

