const _ = require('lodash');

const repo = require('../repository/devices.repository');
const houseRepo = require('../repository/houses.repository');

class DevicesService {
    newDevice = async (ownerId, houseId, device) => {
        const existsHouse = await houseRepo.exists(houseId);
        if (!existsHouse) {
            console.log('Do not contains house');
            const house = await houseRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
            console.log('House ' + JSON.stringify(house));
            device.houseId = house._id;
        } else {
            device.houseId = houseId;
        }
        console.log('new ' + JSON.stringify(device));
        return repo.newDevice(ownerId, device);
    }

    findMyDevices = (ownerId, houseId) => {
        console.log(`Pido losdevices de ${houseId}`);
        return repo.findByOwnerIdAndHouseId(ownerId, houseId);
    }
}

const service = new DevicesService();

module.exports = service;
