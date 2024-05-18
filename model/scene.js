class TouchScene {
  constructor(model) {
    this._id = model._id;
    this.ownerId = model.ownerId;
    this.name = model.name;
    this.condition = model.condition;
    this.actions = model.actions;
  }

  touch() {
    console.log(`Aplique touch a la escena ${this.name}`);
  }
}

module.exports = TouchScene;
