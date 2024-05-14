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

    exists(ownerId, id) {
        return db.Room.exists({_id: id, ownerId: ownerId});
    }

    findByQuery(query) {
        return db.Room.find(query);
    }

    async updateOneByQuery(query, delta) {
        await db.Room.updateOne(query, delta);
        return db.Room.findOne(query);
    }

    async deleteOneByQuery(query) {
        const result = await db.Room.deleteOne(query);
        return result.deletedCount === 1;
    }
}
const repo = new RoomsRepository();

module.exports = repo;
