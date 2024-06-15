const Scene = require('../model/scene');

const repo = require('../repository/scenes.repository');
const houseRepo = require('../repository/houses.repository');

const devicesService = require('./devices.service');
const mqttMessageService = require('./mqtt-message.service');
const scheduleService = require('./schedules.service');

class ScenesService {
    constructor() {
        mqttMessageService.ready()
          .then(devicesService.findAll)
          .then((devices) => devices.forEach(this.#subscribeDevice))
          .then(() => devicesService.deviceSubscriber(this.#subscribeDevice));
    }

    newScene = async (ownerId, houseId, sceneDto) => {
        const existsHouse = await houseRepo.exists(ownerId, houseId);
        if (!existsHouse) {
            const house = await houseRepo.findOneByQuery({ownerId: ownerId, isPrimary: true});
            sceneDto.houseId = house._id;
        } else {
            sceneDto.houseId = houseId;
        }
        const scene = await repo.newScene(ownerId, sceneDto);
        if (scene.condition.type == 'schedule') {
            this.#registerSchedule(scene);
        }
        return scene;
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
        const scene = await repo.findOneByOwnerIdAndSceneId(ownerId, sceneId);
        return this.#activateScene(scene);
    }

    findDeviceStateScenes = (deviceId, state) => repo.findByQuery({
        "condition.type": 'device_state',
        "condition.deviceId": deviceId,
        "condition.state": state
    });

    #activateScene(sceneEntity) {
        const scene = new Scene(sceneEntity);
        scene.activate(mqttMessageService);
        return scene;
    }

    #findScenesThatHasDeviceAsCondition(ownerId, deviceId, state) {
        return repo.findByQuery({
            ownerId,
            'condition.type': 'device_state',
            'condition.deviceId': deviceId,
            'condition.state': state
        });
    }

    #onChangeState = async (ownerId, deviceId, state) => {
        const scenes = await this.#findScenesThatHasDeviceAsCondition(ownerId, deviceId, state);
        scenes.forEach(scene => {
           console.log(`Scene: ${scene.name}`);
           this.#activateScene(scene);
        });
    }

    #subscribeDevice = (device) => {
        mqttMessageService.subscribe(device.ownerId, device._id, "state", this.#onChangeState);
    }

    #registerSchedule(scene) {
        scheduleService.registerSchedule(scene, this.#activateScene.bind(this));
    }
}

const service = new ScenesService();

module.exports = service;
