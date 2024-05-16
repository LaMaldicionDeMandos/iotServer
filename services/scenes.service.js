const repo = require('../repository/scenes.repository');
const houseRepo = require('../repository/houses.repository');

class ScenesService {
    newScene = async (ownerId, houseId, scene) => {
        const existsHouse = await houseRepo.exists(ownerId, houseId);
        if (!existsHouse) {
            const house = await houseRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
            scene.houseId = house._id;
        } else {
            scene.houseId = houseId;
        }
        return repo.newScene(ownerId, scene);
    }

    findMyScenes = (ownerId, houseId) => repo.findByOwnerIdAndHouseId(ownerId, houseId);
}

const service = new ScenesService();

module.exports = service;
