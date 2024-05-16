const db = require('./DB');

class SceneRepository {
    constructor() {
    }

    async newScene(ownerId, scene) {
        const sceneDTO = new db.Scene();
        sceneDTO._id = new db.ObjectId();
        sceneDTO.ownerId = ownerId;
        sceneDTO.houseId = scene.houseId;
        sceneDTO.name = scene.name;
        sceneDTO.condition = scene.condition;
        sceneDTO.actions = scene.actions;
        return (await sceneDTO.save()).toJSON();
    }

    findByOwnerId(id) {
        return db.Scene.find({ownerId: id});
    }

    findByOwnerIdAndHouseId(ownerId, houseId) {
        return db.Scene.find({ownerId, houseId});
    }
}
const repo = new SceneRepository();

module.exports = repo;
