const _ = require('lodash');

const repo = require('../repository/devices.repository');
const houseRepo = require('../repository/houses.repository');
const roomsRepo = require('../repository/rooms.repository');

class DevicesService {
    newDevice = async (ownerId, houseId, device) => {
        const existsHouse = await houseRepo.exists(ownerId, houseId);
        if (!existsHouse) {
            const house = await houseRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
            device.houseId = house._id;
        } else {
            device.houseId = houseId;
        }
        return repo.newDevice(ownerId, device);
    }

    findMyDevices = (ownerId, houseId) => repo.findByOwnerIdAndHouseId(ownerId, houseId);

    updateDevice = async (ownerId, id, delta) => {
        if (delta.roomId && !(await roomsRepo.exists(ownerId, delta.roomId))) {
            return Promise.reject({message: `Not exists room ${delta.roomId}`});
        }
        return repo.updateByQuery({ownerId, _id: id}, delta);
    }

    deleteDevice = async (ownerId, id) => {
        return repo.deleteOneByQuery({ownerId, _id: id});
    }

    findAll = () => repo.findAll();

}

const service = new DevicesService();

module.exports = service;
