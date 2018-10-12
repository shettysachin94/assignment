"use strict";
/********************PARAMETER DETAILS**************************/
module.exports = {
    development: {
        root: require('path').normalize(__dirname + '/..'),
        host: process.env.HOST || 'http://localhost',
        port: process.env.PORT || 3000,
        URLPrefix: '/api/v1',
        saltKey: "65b0143a-0c4a-430f-a592-46adfb796ffc",
        security: {
            accessTokenLife: '500m', //minutes
            refreshTokenLife: '1000m', //minutes
            secretKey: 'assignment'
        },
        dbURL: process.env.MONGODB_URL || 'mongodb://localhost:27017/assignment'
    }
}
