const Scene = require('../model/scene');

const repo = require('../repository/scenes.repository');
const houseRepo = require('../repository/houses.repository');

const mqttMessageService = require('./mqtt-message.service');

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

    updateScene = async (ownerId, scene) => {
        if (ownerId !== scene.ownerId || !(await repo.exists(ownerId, scene._id))) return Promise.reject({message: 'Scene not exists'});
        else {
            return repo.update(scene);
        }
    }

    findMyScenes = (ownerId, houseId) => repo.findByOwnerIdAndHouseId(ownerId, houseId);

    deleteScene = (ownerId, sceneId) => repo.deleteScene(ownerId, sceneId);

    activateScene = async (ownerId, sceneId) => {
        const scene = new Scene(await repo.findOneByOwnerIdAndSceneId(ownerId, sceneId));
        scene.activate(mqttMessageService);
        return scene;
    }

    findDeviceStateScenes = (deviceId, state) => repo.findByQuery({
        "condition.type": 'device_state',
        "condition.deviceId": deviceId,
        "condition.state": state
    });
}

const service = new ScenesService();

module.exports = service;
