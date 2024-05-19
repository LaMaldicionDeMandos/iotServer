const scenesService = require('../services/scenes.service');

class ChangeStatusListener {
  async changeDeviceStatus(deviceId, state) {
    console.log(`Change device status of ${deviceId} to ${state}`);
    const sceneModels = await scenesService.findDeviceStateScenes(deviceId, state);
    sceneModels.forEach((scene) => {
      scenesService.activateScene(scene.ownerId, scene._id);
    });
    return Promise.resolve({deviceId, state});
  }
}

const service = new ChangeStatusListener();

module.exports = service;
