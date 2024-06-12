const db = require('./DB');

class DeviceRepository {
    constructor() {
    }

    async newDevice(ownerId, device) {
        const deviceDTO = new db.Device();
        deviceDTO._id = new db.ObjectId();
        deviceDTO.ownerId = ownerId;
        deviceDTO.type = device.type;
        deviceDTO.name = device.name;
        deviceDTO.houseId = device.houseId;
        deviceDTO.roomId = device.roomId;
        return (await deviceDTO.save()).toJSON();
    }

    findByOwnerId(id) {
        return db.Device.find({ownerId: id});
    }

    findByOwnerIdAndHouseId(ownerId, houseId) {
        return db.Device.find({ownerId, houseId});
    }

    findAll() {
        return db.Device.find();
    }

    async updateByQuery(query, delta) {
        await db.Device.updateMany(query, delta);
        return db.Device.find(query);
    }

    async deleteOneByQuery(query) {
        const result = await db.Device.deleteOne(query);
        return result.deletedCount === 1;
    }
}
const repo = new DeviceRepository();

module.exports = repo;
