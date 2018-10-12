"use strict"

let userController = require('../Controllers/userController');
let sudokuController = require('../Controllers/sudokuController');

module.exports = function(server, config, functions) {
    let URLPrefix = config.URLPrefix;

    server.post(URLPrefix + '/users/create', userController.create, function(req, res) {});

    server.post(URLPrefix + '/users/login', userController.login, function(req, res) {});

    server.get(URLPrefix + '/users/forgotPassword', userController.forgotPassword, function(req, res) {});

    server.put(URLPrefix + '/users/resetPassword', userController.reset, function(req, res) {});

    server.post(URLPrefix + '/sudoku', sudokuController.sudoku, function(req, res) {});


}
