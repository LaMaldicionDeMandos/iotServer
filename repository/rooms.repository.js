const db = require('./DB');

class RoomsRepository {
    constructor() {
    }

    async newRoom(ownerId, houseId, name) {
        const roomDTO = new db.Room();
        roomDTO._id = new db.ObjectId();
        roomDTO.ownerId = ownerId;
        roomDTO.name = name;
        roomDTO.houseId = houseId;
        return (await roomDTO.save()).toJSON();
    }

    findByQuery(query) {
        return db.Room.find(query);
    }
}
const repo = new RoomsRepository();

module.exports = repo;
