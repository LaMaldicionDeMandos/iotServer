const _ = require('lodash');

const repo = require('../repository/devices.repository');
const houseRepo = require('../repository/houses.repository');

class DevicesService {
    newDevice = async (ownerId, device) => {
        const existsHouse = device.houseId || await houseRepo.exists(device.houseId);
        if (!existsHouse) {
            console.log('Do not contains house');
            const house = await houseRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
            console.log('House ' + JSON.stringify(house));
            device.houseId = house._id;
        }
        console.log('new ' + JSON.stringify(device));
        return repo.newDevice(ownerId, device);
    }

    findMyDevices = repo.findByOwnerId;
}

const service = new DevicesService();

module.exports = service;
