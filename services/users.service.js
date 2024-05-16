const sha = require('sha256');
const _ = require('lodash');
const repo = require('../repository/user.repository');
const houseRepo = require('../repository/houses.repository');
const emailService = require('./email.service');
const passwordGenerator = require('generate-password');

class UsersService {
    register = async (user) => {
        const code = passwordGenerator.generate({length: 6, lowercase: false, uppercase: false, numbers: true});
        let newUser = _.assign(user, {
            password: sha(user.password),
            validationCode: code
        });

        newUser = await repo.newUser(newUser);
        await this.#createHome(newUser._id);
        await this.#sendUserCodeToValidate(newUser);
        return newUser;
    }

    changePassword = async (username, validationCode, password) => {
       if (await repo.existsPasswordRecoveryCode(username, validationCode)) {
           await repo.update(username, {password: sha(password)});
           return repo.findUserByUsername(username);
       } else {
           return Promise.reject({message: 'invalid password recovery'});
       }
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

    verifyUser = async (username, code) => {
        if (await repo.existsUserByQuery({username, validationCode: code})) {
            await repo.update(username, {state: repo.ACTIVE, $unset: {validationCode: 1}});
            return repo.findUserByUsername(username);
        } else {
            return Promise.reject({message: 'Invalid validation'});
        }
    }

    passwordRecovery = async (username) => {
        const code = passwordGenerator.generate({length: 6, lowercase: false, uppercase: false, numbers: true});
        if (await repo.existsUserByQuery({username})) {
            await repo.newPasswordRecovery(username, code);
            const user = await repo.findUserByUsername(username);
            await emailService.sendPasswordRecoveryCode(code, username, user.profile.first_name);
            return user;
        } else {
            return Promise.reject({message: 'Invalid validation'});
        }
    }

    #sendUserCodeToValidate(user) {
        emailService.sendRegistrationValidate(user.validationCode, user.username, user.profile.first_name);
    }

    #createHome(userId) {
        return houseRepo.newHome(userId, houseRepo.DEFAULT_NAME);
    }
}

const service = new UsersService();

module.exports = service;
