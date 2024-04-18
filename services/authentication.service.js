const jwt = require('jsonwebtoken');
const usersService = require('../services/users.service');

const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;
const SECRET = process.env.SECRET;

class AuthenticationService {
    login = async (username, password) => {
        const user = await usersService.getUser(username, password);
        if (!user) return Promise.reject({error: 'invalid_login'});
        return this.#generateToken(user);
    }

    #generateToken = (user) =>
      jwt.sign({username: user.username, id: user._id}, SECRET, {expiresIn: TOKEN_EXPIRATION});
}

const service = new AuthenticationService();

module.exports = service;
