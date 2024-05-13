const _ = require('lodash');

const housesRepo = require('../repository/houses.repository');
const roomsRepo = require('../repository/rooms.repository');

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

    newRoom = async (ownerId, houseId, name) => {
        const existHouse = await housesRepo.exists(ownerId, houseId);
        return existHouse ? roomsRepo.newRoom(ownerId, houseId,name) : Promise.reject({message: 'User or house not exists'});
    }

    getRooms = (ownerId, houseId) => {
        return roomsRepo.findByQuery({ownerId, houseId});
    }

    changeRoomName = (ownerId, id, newName) => {
        return roomsRepo.updateOneByQuery({_id: id, ownerId: ownerId}, {name: newName});
    }
}

const service = new PlacesService();

module.exports = service;
