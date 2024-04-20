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
        deviceDTO.roomId = device.roomId;
        return (await deviceDTO.save()).toJSON();
    }

    findByOwnerId(id) {
        return db.Device.find({ownerId: id});
    }
}
const repo = new DeviceRepository();

module.exports = repo;
