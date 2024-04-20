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

    findByOwnerId(id) {
        return db.House.find({ownerId: id});
    }

    findOneByQuery(query) {
        return db.House.findOne(query);
    }
}
const repo = new HouseRepository();

module.exports = repo;
