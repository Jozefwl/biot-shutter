#include <WiFi.h>
#include <WebServer.h>
#include <WiFiManager.h>  
#include <AccelStepper.h>
#include <DNSServer.h> 
#include <ArduinoJson.h> 
#include <PubSubClient.h>
#include <HardwareSerial.h>


HardwareSerial mySerial(1); // Use UART1 for reading (pins 9 (RX) and 10 (TX) by default on ESP32)

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);  // Gateway address for the AP
DNSServer dnsServer;             // Create a DNS Server instance

AccelStepper stepper(AccelStepper::FULL4WIRE, 7, 5, 6, 4);
WebServer Server(80);
WiFiClient espClient;
PubSubClient client(espClient);  // Create a PubSubClient instance

long totalSteps = 0;
unsigned long lastSendTime = 0;
const long sendInterval = 60000;  // Send data every 60 seconds
unsigned long lastReadTime = 0;   // Last time UART data was read
const long readInterval = 2000;   // Minimum time between reads
int adcValue = 0; 

void setup() {
    Serial.begin(9600);
    mySerial.begin(115200, SERIAL_8N1, 9, 10); // Initialize mySerial to 9600 baud rate

    WiFiManager wifiManager;
    stepper.setMaxSpeed(500);  // Lower speed
    stepper.setAcceleration(100);  // Set acceleration to a lower value

    wifiManager.setTimeout(180);  // Timeout for WiFi configuration portal

    if (!wifiManager.autoConnect("AutoConnectAP")) {
        Serial.println("Failed to connect and hit timeout");
        ESP.restart();
        delay(1000);
    }

    WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
    dnsServer.start(DNS_PORT, "*", apIP);  // Capture all DNS requests

    client.setServer(IPAddress(194, 182, 91, 65), 1883); // Set MQTT server IP and port
    client.setCallback(callback);

// Define Server paths
Server.on("/moveCW", HTTP_POST, []() {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, Server.arg("plain"));
    int steps = doc["steps"];
    stepper.move(steps); // Move steps
    totalSteps += steps;

    DynamicJsonDocument response(1024);
    response["message"] = "Moved Clockwise";
    response["totalSteps"] = totalSteps;
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr);
});

Server.on("/moveCCW", HTTP_POST, []() {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, Server.arg("plain"));
    int steps = doc["steps"];
    stepper.move(-steps); // Move -steps
    totalSteps -= steps;

    DynamicJsonDocument response(1024);
    response["message"] = "Moved Counter-Clockwise";
    response["totalSteps"] = totalSteps;
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr);
});

Server.on("/status", HTTP_GET, []() {
    DynamicJsonDocument response(1024);
    response["totalSteps"] = totalSteps;
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr);
});

Server.on("/resetWiFi", HTTP_GET, [&wifiManager]() {
    wifiManager.resetSettings();

    DynamicJsonDocument response(1024);
    response["message"] = "WiFi settings reset. Restarting...";
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr);

    delay(1000);
    ESP.restart();
});
    Server.begin();
    Serial.println("HTTP Server started");
}

void callback(char* topic, byte* payload, unsigned int length) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload, length);
    int steps = doc["steps"];
    if (steps > 0) {
        stepper.move(steps); // Move steps
        totalSteps += steps;
    } else if (steps < 0) {
        stepper.move(-steps); // Move -steps
        totalSteps -= steps;
    }
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP8266Client")) {
            Serial.println("connected");
            client.subscribe("steps");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void loop() {
    dnsServer.processNextRequest();
    Server.handleClient();
    stepper.run(); // Process stepper actions

    if (!stepper.isRunning()) {
        // If the stepper has no more steps to perform, disable the motor outputs
        digitalWrite(7, LOW);
        digitalWrite(5, LOW);
        digitalWrite(6, LOW);
        digitalWrite(4, LOW);
    }

    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    // Check if it's time to send the status
    unsigned long currentMillis = millis();
    if (currentMillis - lastSendTime >= sendInterval) {
        // It's time to send the status
        lastSendTime = currentMillis;

        // Publish the total steps to the "CurrentSteps" topic
        client.publish("CurrentSteps", String(totalSteps).c_str());

        if (mySerial.available()) {
            String line = mySerial.readStringUntil('\r');
            adcValue = line.substring(line.indexOf(":") + 2).toInt(); // Input type "ADC Value: 1234"

            // Publish the ADC value to the MQTT topic "LightValue"
            client.publish("LightValue", String(adcValue).c_str());

            // Print the ADC value and total steps to the serial
            Serial.println("LightValue: " + String(adcValue));
            Serial.println("CurrentSteps: " + String(totalSteps));
        } else { 
            Serial.println("mySerial is unavailable"); 
        }
    }
}