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

    exists(ownerId, id) {
        return db.Scene.exists({_id: id, ownerId: ownerId});
    }

    async update(model) {
        await db.Scene.updateOne({_id: model._id}, model);
        return db.Scene.findOne({_id: model._id});
    }

    findByOwnerId(id) {
        return db.Scene.find({ownerId: id});
    }

    findByQuery(query) {
        return db.Scene.find(query);
    }

    findByOwnerIdAndHouseId(ownerId, houseId) {
        return db.Scene.find({ownerId, houseId});
    }

    findOneByOwnerIdAndSceneId(ownerId, sceneId) {
        return db.Scene.findOne({ownerId, _id: sceneId});
    }

    deleteScene = (ownerId, _id) => this.#deleteOneByQuery({ownerId, _id});


    async #deleteOneByQuery(query) {
        const result = await db.Scene.deleteOne(query);
        return result.deletedCount === 1;
    }
}
const repo = new SceneRepository();

module.exports = repo;
