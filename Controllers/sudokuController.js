'use-strict';

let mongoose = require('mongoose');;
let functions = require('../Utils/functions');
let Constants = require('../Configs/constants.js');
let SudokuSolver = require('sudoku-solver-js');
let MESSAGE = Constants.messages;
let CODE = Constants.codes;

module.exports = (function () {
    return {
        sudoku: function (req, res) {
            functions.checkRequired(req, res, ['email', 'password'],
                function (err) {
                    if (!err) {
                        let solver = new SudokuSolver();
                        let inputPuzzle = req.body.input;
                        functions.sendData(res, { "result": solver.solve(inputPuzzle) });
                    }
                });
        }
    }

}());
