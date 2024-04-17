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
        userDTO.state = 'INACTIVE';
        return (await userDTO.save()).toJSON();
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
        return db.User.where({username: username}).update(delta);
    }

    deleteUser(id) {
        return db.User.deleteOne({_id: id});
    }

    #existsUser(username) {
        return db.User.exists({username: username});
    }
}
const repo = new UserRepository();

module.exports = repo;
