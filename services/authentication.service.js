//const jwt = require('jsonwebtoken');
//const sha = require('sha256');
//const { v4: uuidv4 } = require('uuid');
//const passwordGenerator = require('generate-password');
//const userService = require('./users.service');
//const userRepo = require('../repository/user.repository');
//const roleService = require('./role.service');
//const redisService = require('./redis.service');
//const emailService = require('./email.service');

//const HOST = process.env.HOST;
//const SECRET = process.env.SECRET;
//const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;
//const ONE_HOUR_IN_SECONDS = 60*60;

class AuthenticationService {
    login = (user, password) => {
        return Promise.resolve("ACCESS_TOKEN_FROM_SERVICE");
    }
}

const service = new AuthenticationService();

module.exports = service;
