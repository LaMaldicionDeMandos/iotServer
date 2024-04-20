const _ = require('lodash');

const repo = require('../repository/devices.repository');

class DevicesService {
    newDevice = (userId, device) => {
        return repo.newDevice(userId, device);
    }

    findMyDevices = (userId) => repo.findByOwnerId(userId);
}

const service = new DevicesService();

module.exports = service;
