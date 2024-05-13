const _ = require('lodash');

const housesRepo = require('../repository/houses.repository');

class PlacesService {
    newHome = (ownerId, name) => {
        return housesRepo.newHome(ownerId, name);
    }

    changeHouseName = (ownerId, id, newName) => {
        return housesRepo.updateOneByQuery({_id: id, ownerId: ownerId}, {name: newName});
    }

    deleteHouse = (ownerId, id) => {
        return housesRepo.deleteOneByQuery({_id: id, ownerId: ownerId, isPrimary: false});
    }

    findMyPrimaryHouse = (ownerId) => housesRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
    findMyHouses = (ownerId) => housesRepo.findByOwnerId(ownerId);
}

const service = new PlacesService();

module.exports = service;
