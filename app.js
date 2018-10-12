
"use strict";
/*
 * Cluster Imports
 */
var env             = process.env.NODE_ENV || 'development';
var config          = require('./Configs/config')[env];
var url             = require('url');
var autoIncrement   = require('mongoose-auto-increment');
var passport        = require('passport');

console.log('\n\x1b[32m%s\x1b[0m','Entering environment \'' + env + '\'');
// Require Modules
var express         = require('express');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var useragent       = require('express-useragent');
var fs              = require('fs');
var server          = express();
var mongoose        = require('mongoose');
/*------------------------------------------------------------------------------------------*/
// Paths
var routesPath = config.root + '/Routes';
var modelsPath = config.root + '/Models';
var controllerPath = config.root + '/Controllers';


// Connect to MongoDB
if (config.options !== undefined) {
    mongoose.connect(config.dbURL, config.options);
} else {
    mongoose.connect(config.dbURL);
}

// mongoose.connect(config.dbURL);
var db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('info','Database connection to MongoDB opened.');
});

// Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {    
    console.log('info','Loading model      --- ' + file);    
    require(modelsPath + '/' + file + '/schema.js');
});


require('./Auth/auth')(passport, config);
server.use(require('morgan')('combined'));
server.use(require('cookie-parser')());
server.use(require('body-parser').urlencoded({ extended: true}));

server.use(passport.initialize());

//Cross Domain
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    if (req.headers.origin !== undefined) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    } else {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Accept-Encoding, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,PATCH');
    //res.header('Access-Control-Max-Age', '3000');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    } 
});  

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true,
}));

server.use(useragent.express());
var functions = require('./Utils/functions');

server.use(morgan('dev'));
server.use(morgan(':method :url :status :response-time ms - :res[content-length] :req[headers]'));
server.all('*', function(req, res, next) {
    console.log('info','---------------------------------------------------------------------------');
    console.log('info','%s %s on %s from ', req.method, req.url, new Date(), req.useragent.source);
    console.log('info','Request Authorized User: ', (req.isAuthenticated()) ? req.user._id : 'Not authenticated');
    console.log('info','Request Headers: ', req.headers);
    console.log('verbose','Request Body: ', req.body);
    console.log('verbose','Request Files: ', req.files);
    req.config = config;
    req.console = console
    next();
});

// Bootstrap routes
fs.readdirSync(routesPath).forEach(function(file) {
    if (file.substr(file.lastIndexOf('.') + 1) !== 'js') {
        return;
    }
    console.log('info','Loading route      --- ' + file);
    require(routesPath + '/' + file)(server, config, functions);
});

// Bootstrap routes
fs.readdirSync(controllerPath).forEach(function(file) {
    if (file.substr(file.lastIndexOf('.') + 1) !== 'js') {
        return;
    }
    console.log('info','Loading Controller --- ' + file);
    require(controllerPath + '/' + file);
});

server.use(passport.initialize());
require('./Auth/auth')(passport, config);

server.use('/api/doc', express.static(__dirname + '/doc'));
server.use('/Public', express.static(__dirname + '/Public'));
server.use('/Build', express.static(__dirname + '/Build'));
server.all('/healthCheck', function(req, res) {
    if (mongoose.connection.readyState === 0) {
        res.status(500).send('Database Error');
    } else {
        res.status(200).send('OK');
    }
});

// // Bootstrap routes
server.listen(config.port, function() {
    console.log('info','\x1b[32m%s\x1b[0m','\nServer listening on port ---', config.port);
});

module.exports = server;
