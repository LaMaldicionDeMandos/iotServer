const sha = require('sha256');
const _ = require('lodash');
const repo = require('../repository/user.repository');
const houseRepo = require('../repository/houses.repository');
const emailService = require('./email.service');

const VALIDATION_URL = process.env.HOST + '/auth/validation';

class UsersService {
    register = async (user) => {
        let newUser = _.assign(user, {
            password: sha(user.password)
        });
        newUser = await repo.newUser(newUser);
        await this.#createHome(newUser._id);
        this.#sendUserCodeToValidate(newUser);
        return newUser;
    }

    registerWithoutPassword = async (username, profile) => {
        console.log(`Profile: ${JSON.stringify(profile)}`);
        const user = await repo.newUser({username, profile: _.pick(profile, ['displayName', 'provider']), state: repo.ACTIVE});
        await this.#createHome(user._id);
        return user;
    }

    getUser(username, password) {
        return repo.findUserByQuery({username: username, password: sha(password)});
    }

    getById = (id) => {
        return repo.findUserById(id);
    }

    getByUsername = (username) => {
        return repo.findUserByUsername(username);
    }

    activeUser = (username) => {
        return repo.update(username, {state: repo.ACTIVE });
    }

    #sendUserCodeToValidate(user) {
        emailService.sendRegistrationValidate(`${VALIDATION_URL}/${user._id}`, user.username, user.profile.first_name);
    }

    #createHome(userId) {
        return houseRepo.newHome(userId, houseRepo.DEFAULT_NAME);
    }
}

const service = new UsersService();

module.exports = service;
