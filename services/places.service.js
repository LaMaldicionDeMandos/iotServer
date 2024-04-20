const _ = require('lodash');

const housesRepo = require('../repository/houses.repository');

class PlacesService {
    newHome = (ownerId, name) => {
        return housesRepo.newHome(ownerId, name);
    }

    findMyPrimaryHouse = (ownerId) => housesRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
    findMyHouses = (ownerId) => housesRepo.findByOwnerId(ownerId);
}

const service = new PlacesService();

module.exports = service;
