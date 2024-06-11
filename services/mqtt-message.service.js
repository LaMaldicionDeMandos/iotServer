const mqtt = require("mqtt");
const mqttProtocol = process.env.MQTT_SERVER_PROTOCOL;
const mqttHost = process.env.MQTT_SERVER_HOST;
const mqttPort = process.env.MQTT_SERVER_PORT;

const mqttClient = mqtt.connect(`${mqttProtocol}://${mqttHost}:${mqttPort}`);

class MqttMessageService {
  #client;
  #connected;
  constructor(client) {
    this.#client = client;
    this.#connected = new Promise((resolve, reject) => {
      client.on("connect", () => {
        console.log("MQTT connected");
        resolve();
      });
    });
  }

  ready() {
    return this.#connected;
  }

  sendMessage(clientId, deviceId, message) {
    console.log(`Sending Message to MQTT Broker: /client/${clientId}/deviceId/${deviceId}?message=${message}`);
    this.#client.publish(`/iotProject/${clientId}/device/${deviceId}/set`, message);
    return Promise.resolve({clientId, deviceId, message});
  }
}

const service = new MqttMessageService(mqttClient);

module.exports = service;
