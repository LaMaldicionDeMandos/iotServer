const db = require('./DB');

class HouseRepository {
    constructor() {
    }

    async newHome(ownerId, name) {
        console.log(`Count: ${JSON.stringify(await db.House.countDocuments({ownerId: ownerId}))}`);
        const homeDTO = new db.House();
        homeDTO._id = new db.ObjectId();
        homeDTO.ownerId = ownerId;
        homeDTO.name = name;
        homeDTO.isPrimary = !(await db.House.countDocuments({ownerId: ownerId}));
        return (await homeDTO.save()).toJSON();
    }

    async updateOneByQuery(query, delta) {
        await db.House.updateOne(query, delta);
        return db.House.findOne(query);
    }

    async deleteOneByQuery(query) {
        const result = await db.House.deleteOne(query);
        return result.deletedCount === 1;
    }

    exists(id) {
        return db.House.exists({_id: id});
    }

    findByOwnerId(id) {
        return db.House.find({ownerId: id});
    }

    findOneByQuery(query) {
        return db.House.findOne(query);
    }

    get DEFAULT_NAME() {
        return 'My Home';
    }
}
const repo = new HouseRepository();

module.exports = repo;
