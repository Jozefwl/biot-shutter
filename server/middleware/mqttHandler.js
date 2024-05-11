const mqtt = require('mqtt');

class MqttHandler {
    constructor() {
        const options = {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
        };

        this.client = mqtt.connect(process.env.MQTT_IP, options);

        // Event listeners for connection status
        this.client.on('connect', () => {
            console.log('Message sent!');
        });

        this.client.on('error', (error) => {
            console.error('MQTT error:', error);
        });
    }

    publish(topic, message) {
        this.client.publish(topic, JSON.stringify(message));
    }

    subscribe(topic) {
        this.client.subscribe(topic);
    }

    onMessage(callback) {
        this.client.on('message', (topic, message) => {
            callback(topic, message.toString());
        });
    }

    end() {
        this.client.end();
    }
}

module.exports = MqttHandler;
