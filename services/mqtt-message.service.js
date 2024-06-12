const mqtt = require("mqtt");
const mqttProtocol = process.env.MQTT_SERVER_PROTOCOL;
const mqttHost = process.env.MQTT_SERVER_HOST;
const mqttPort = process.env.MQTT_SERVER_PORT;

const mqttClient = mqtt.connect(`${mqttProtocol}://${mqttHost}:${mqttPort}`);

class MqttMessageService {
  #client;
  #connected;
  #subscribers;
  constructor(client) {
    this.#client = client;
    this.#connected = new Promise((resolve, reject) => {
      client.on("connect", () => {
        console.log("MQTT connected");
        resolve();
      });
    });
    this.#client.on('message', (topic, message) => {
      console.log(`Message arrived: {topic: ${topic}, message: ${message}`);
      const subscriber = this.#subscribers[topic];
      if (subscriber) subscriber.listener(subscriber.clientId, subscriber.deviceId, message);
    });
    this.#subscribers = {};
  }

  ready() {
    return this.#connected;
  }

  sendMessage(clientId, deviceId, message) {
    const topic = `/iotProject/${clientId}/device/${deviceId}/set`;
    console.log(`Sending Message to MQTT Broker: ${topic}?message=${message}`);
    this.#client.publish(topic, message);
    return Promise.resolve({clientId, deviceId, message});
  }

  subscribe(clientId, deviceId, method, listener) {
    const topic = `/iotProject/${clientId}/device/${deviceId}/${method}`;
    this.#subscribers[topic] = {clientId, deviceId, listener};
    console.log('Subscribing to topic: ', topic);
    this.#client.subscribe(topic, (err) => {
      if(err) console.log('could not connect to topic: ', topic);
    });
  }
}

const service = new MqttMessageService(mqttClient);

module.exports = service;
