const sha = require('sha256');
const _ = require('lodash');
const repo = require('../repository/user.repository');
const emailService = require('./email.service');

const VALIDATION_URL = process.env.HOST + '/auth/validation';

class UsersService {
    register = async (user) => {
        let newUser = _.assign(user, {
            password: sha(user.password)
        });
        newUser = await repo.newUser(newUser);
        this.#sendUserCodeToValidate(newUser);
        return newUser;
    }

    #sendUserCodeToValidate(user) {
        emailService.sendRegistrationValidate(`${VALIDATION_URL}/${user._id}`, user.username, user.profile.first_name);
    }
}

const service = new UsersService();

module.exports = service;
