const mqtt = require('mqtt');

class MqttHandler {
    constructor() {
        this.client = mqtt.connect('mqtt://194.182.91.65:1883');

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
