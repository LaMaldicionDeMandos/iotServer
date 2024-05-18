const PromiseTimers = require('promise-timers');
class TouchScene {
  constructor(model) {
    this._id = model._id;
    this.ownerId = model.ownerId;
    this.name = model.name;
    this.condition = model.condition;
    this.actions = model.actions;
  }

  touch(mqttMessageService) {
    console.log(`Aplique touch a la escena ${this.name}`);
    let c = 0;
    this.actions.reduce((task, action) => {
      return task.then(() => this.#createTask(action, mqttMessageService));
    }, Promise.resolve());
  }

  #createTask = (action, mqttMessageService) => {
    if (action.type === 'device') {
      mqttMessageService.sendMessage(this.ownerId, action.deviceId, action.state).then(() => {});
      return Promise.resolve(action);
    } else if (action.type === 'wait') {
      return PromiseTimers.setTimeout(this.#calculateTime(action.time), action.time).then((args) => console.log(`Wait for ${JSON.stringify(args)}`));
    }
  }

  #calculateTime = (actionTime) => {
    return 10*1000;
  }
}

module.exports = TouchScene;
