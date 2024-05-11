#include <WiFi.h>
#include <WebServer.h>
#include <WiFiManager.h>
#include <AccelStepper.h>
#include <DNSServer.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <HardwareSerial.h>
#include <Preferences.h>

Preferences preferences; // Init preferences library

HardwareSerial mySerial(1); // Use UART1 for reading (pins 9 (RX) and 10 (TX) by default on ESP32)

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1); // Gateway address for the AP
DNSServer dnsServer;            // Create a DNS Server instance

AccelStepper stepper(AccelStepper::FULL4WIRE, 7, 5, 6, 4);
WebServer Server(80);
WiFiClient espClient;
PubSubClient client(espClient); // Create a PubSubClient instance

long totalSteps = 0;
unsigned long lastSendTime = 0;
const long sendInterval = 60000; // Send data every 60 seconds
unsigned long lastReadTime = 0;  // Last time UART data was read
const long readInterval = 2000;  // Minimum time between reads
long lastSavedPosition = 0;
unsigned long lastSaveTime = 0;
const unsigned long saveInterval = 10000; // Save every 10 seconds
int adcValue = 0;

void setup()
{
    Serial.begin(9600);
    mySerial.begin(115200, SERIAL_8N1, 9, 10); // Initialize mySerial to 9600 baud rate

    WiFiManager wifiManager;

    // Reset WiFiManager settings every time for debugging
    // wifiManager.resetSettings();

    wifiManager.setTimeout(180); // Timeout for WiFi configuration portal

    if (!wifiManager.autoConnect("AutoConnectAP"))
    {
        Serial.println("Failed to connect and hit timeout");
        ESP.restart();
        delay(1000);
    }

    WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
    dnsServer.start(DNS_PORT, "*", apIP); // Capture all DNS requests

    client.setServer(IPAddress(194, 182, 91, 65), 1883); // Set MQTT server IP and port
    client.setCallback(callback);

    // Init stepper last
    stepper.setMaxSpeed(500);     // Lower speed
    stepper.setAcceleration(100); // Set acceleration to a lower value
    long lastPosition = readPosition(); // Read the last saved position
    stepper.setCurrentPosition(lastPosition); // Make the stepper know which position it is in
    totalSteps = lastPosition; // Set the total steps to the last position

    // Define Server paths
    Server.on("/moveCW", HTTP_POST, []()
              {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, Server.arg("plain"));
    int steps = doc["steps"];
    if(steps > 10000){steps = 10000;};  // Limit steps to 10k
    stepper.move(steps); // Move steps
    totalSteps += steps;

    DynamicJsonDocument response(1024);
    response["message"] = "Moved Clockwise";
    response["totalSteps"] = totalSteps;
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr); });

    Server.on("/moveCCW", HTTP_POST, []()
              {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, Server.arg("plain"));
    int steps = doc["steps"];
    if (steps > 10000){steps = 10000;};  // Limit steps to 10k
    stepper.move(-steps); // Move -steps
    totalSteps -= steps;

    DynamicJsonDocument response(1024);
    response["message"] = "Moved Counter-Clockwise";
    response["totalSteps"] = totalSteps;
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr); });

    Server.on("/status", HTTP_GET, []()
              {
    DynamicJsonDocument response(1024);
    response["totalSteps"] = totalSteps;
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr); });

    Server.on("/resetWiFi", HTTP_GET, [&wifiManager]()
              {
    wifiManager.resetSettings();

    DynamicJsonDocument response(1024);
    response["message"] = "WiFi settings reset. Restarting...";
    String responseStr;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr);

    delay(1000);
    ESP.restart(); });

    Server.on("/setToSteps", HTTP_POST, []()
              {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, Server.arg("plain"));
    int steps = doc["steps"];

    DynamicJsonDocument response(1024);
    String responseStr;

    if (steps < 0) {
        response["message"] = "Can't set to negative steps";
        serializeJson(response, responseStr);
        Server.send(403, "application/json", responseStr);
        return;
    }

    if (steps > 1000000) {
        response["message"] = "Step count too big";
        serializeJson(response, responseStr);
        Server.send(403, "application/json", responseStr);
        return;
    }

    moveToSetSteps(steps);

    response["message"] = "Moving to set steps";
    response["requestedSteps"] = steps;
    response["totalSteps"] = totalSteps;
    serializeJson(response, responseStr);
    Server.send(200, "application/json", responseStr); });

    Server.begin();
    Serial.println("HTTP Server started");

    Server.begin();
    Serial.println("HTTP Server started");
}

void moveToSetSteps(int setToSteps)
{
    if (setToSteps < 0)
    {
        setToSteps = 0; // Prevent moving to a step below 0
    }
    int stepDifference = setToSteps - totalSteps;
    stepper.move(stepDifference); // This will queue the steps to move
    totalSteps += stepDifference; // Update totalSteps to reflect the move

    // Optionally log to Serial for debugging
    Serial.print("Moving to set steps: ");
    Serial.println(setToSteps);
    Serial.print("Step difference: ");
    Serial.println(stepDifference);
}

void savePosition(long position) {
    unsigned long currentMillis = millis();
    if ((position != lastSavedPosition) && (currentMillis - lastSaveTime >= saveInterval)) {
        preferences.begin("stepper", false);
        preferences.putLong("position", position);
        preferences.end();
        lastSaveTime = currentMillis;
        lastSavedPosition = position;
        Serial.println("Position saved to flash");
    }
}


long readPosition() {
    preferences.begin("stepper", true); // Open preferences
    long position = preferences.getLong("position", 0); // Get the motor position, default to 0 if not set
    preferences.end(); // Close preferences
    Serial.print("Read position: ");
    Serial.println(position);
    return position;
}


void callback(char *topic, byte *payload, unsigned int length)
{
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload, length);
    int steps = doc["steps"];

    if (strcmp(topic, "setToSteps") == 0)
    { // setToSteps Topic
        if (steps < 0)
        {
            Serial.println("Can't set to negative steps");
            return;
        }

        if (steps > 1000000)
        {
            Serial.println("Step count too big");
            return;
        }

        moveToSetSteps(steps);
    }
    else if (steps > 0)
    {
        if (steps > 1000000)
        {
            Serial.println("Step count too big");
            return;
        }

        stepper.move(steps); // Move steps
        totalSteps += steps;
    }
    else if (steps < 0)
    {
        if (totalSteps - steps < 0)
        {
            Serial.println("Can't move to negative steps");
            return;
        }

        stepper.move(-steps); // Move -steps
        totalSteps -= steps;
    }
}

void reconnect()
{
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP8266Client", "usern", "pass")) // Remember to remove PASSWORD FROM HERE!!!
        {
            Serial.println("connected");
            client.subscribe("steps");
            client.subscribe("setToSteps");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void loop()
{
    dnsServer.processNextRequest();
    Server.handleClient();
    stepper.run(); // Process stepper actions

    if (!stepper.isRunning())
    {
        // If the stepper has no more steps to perform, disable the motor outputs
        digitalWrite(7, LOW);
        digitalWrite(5, LOW);
        digitalWrite(6, LOW);
        digitalWrite(4, LOW);
    }

    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    // Call savePos function
    savePosition(totalSteps);

    // Check if it's time to send the status
    unsigned long currentMillis = millis();
    if (currentMillis - lastSendTime >= sendInterval)
    {
        // It's time to send the status
        lastSendTime = currentMillis;

        // Publish the total steps to the "CurrentSteps" topic
        client.publish("CurrentSteps", String(totalSteps).c_str());
        

        // Call the callback function to read MQTT
        byte *payload = (byte *)String(totalSteps).c_str();
        callback("CurrentSteps", payload, String(totalSteps).length());

        if (mySerial.available())
        {
            String line = mySerial.readStringUntil('\r');
            adcValue = line.substring(line.indexOf(":") + 2).toInt(); // Input type "ADC Value: 1234"

            // Publish the ADC value to the MQTT topic "LightValue"
            client.publish("LightValue", String(adcValue).c_str());

            // Call the callback function to read MQTT
            payload = (byte *)String(adcValue).c_str();
            callback("LightValue", payload, String(adcValue).length());

            // Print the ADC value and total steps to the serial
            Serial.println("LightValue: " + String(adcValue));
            Serial.println("CurrentSteps: " + String(totalSteps));
        }
        else
        {
            Serial.println("mySerial is unavailable");
        }
    }
}