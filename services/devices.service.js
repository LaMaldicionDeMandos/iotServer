const _ = require('lodash');

const repo = require('../repository/devices.repository');

class DevicesService {
    newDevice = (user, device) => {
        console.log(`new Device: ${JSON.stringify(device)} para usuario: ${JSON.stringify(user)}`);
        return repo.newDevice(user.id, device);
    }
}

const service = new DevicesService();

module.exports = service;
