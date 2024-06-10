const db = require('./DB');

class UserRepository {
    constructor() {
    }

    async newUser(user) {
        const exists = await this.#existsUser(user.username);
        if (exists) return Promise.reject({message: 'user_already_exists'});
        const userDTO = new db.User();
        userDTO._id = new db.ObjectId();
        userDTO.username = user.username;
        userDTO.password = user.password;
        userDTO.profile = user.profile;
        userDTO.state = user.state || 'INACTIVE';
        userDTO.validationCode = user.validationCode;
        return (await userDTO.save()).toJSON();
    }

    async newPasswordRecovery(username, code) {
        const passwordRecovery = new db.PasswordRecovery();
        passwordRecovery._id = new db.ObjectId();
        passwordRecovery.username = username;
        passwordRecovery.code = code;
        return (await passwordRecovery.save()).toJSON();
    }

    existsPasswordRecoveryCode(username, code) {
        return db.PasswordRecovery.exists({username, code});
    }

    getPasswordRecoveryCode(username) {
        return db.PasswordRecovery.findOne({username: username});
    }

    existsUserByQuery(query) {
        return db.User.exists(query);
    }

    findUserByUsername(username) {
        return this.findUserByQuery({username: username});
    }

    findUserById(id) {
        return db.User.findById(id).then(user => user.toJSON());
    }

    findUserByQuery(query) {
        return db.User.findOne(query);
    }

    findAll() {
        return db.User.find();
    }

    findByQuery(query) {
        return db.User.find(query);
    }

    update(username, delta) {
        console.log("Try to update " + username + ": " + JSON.stringify(delta));
        return db.User.where({username: username}).updateOne(delta);
    }

    deleteUser(id) {
        return db.User.deleteOne({_id: id});
    }

    get ACTIVE() {
        return 'ACTIVE';
    }

    #existsUser(username) {
        return db.User.exists({username: username});
    }
}
const repo = new UserRepository();

module.exports = repo;
