const PromiseTimers = require('promise-timers');
const parseDuration = require('parse-duration');
class Scene {
  constructor(model) {
    this._id = model._id;
    this.ownerId = model.ownerId;
    this.name = model.name;
    this.condition = model.condition;
    this.actions = model.actions;
  }

  activate(mqttMessageService) {
    console.log(`Activo a la escena ${this.name}`);
    this.actions.reduce((task, action) => {
      return task.then(() => this.#createTask(action, mqttMessageService));
    }, Promise.resolve());
  }

  #createTask = (action, mqttMessageService) => {
    if (action.type === 'device') {
      mqttMessageService.sendMessage(this.ownerId, action.deviceId, action.state).then(() => {});
      return Promise.resolve(action);
    } else if (action.type === 'wait') {
      return PromiseTimers.setTimeout(this.#calculateTime(action.time), action.time).then((delay) => console.log(`Wait for ${delay} milliseconds`));
    }
  }

  #calculateTime = (actionTime) => {
    return parseDuration(actionTime, 'ms');
  }
}

module.exports = Scene;
