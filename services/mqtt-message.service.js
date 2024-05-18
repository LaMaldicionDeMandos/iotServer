class MqttMessageService {
  sendMessage(clientId, deviceId, message) {
    console.log(`Sending Message to MQTT Broker: /client/${clientId}/deviceId/${deviceId}?message=${message}`);
    return Promise.resolve({clientId, deviceId, message});
  }
}

const service = new MqttMessageService();

module.exports = service;
