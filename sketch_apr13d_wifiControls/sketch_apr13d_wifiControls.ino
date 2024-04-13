#include <WiFi.h>
#include <WebServer.h>
#include <WiFiManager.h>  
#include <AccelStepper.h>
#include <DNSServer.h>  

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);  // Gateway address for the AP
DNSServer dnsServer;             // Create a DNS Server instance

AccelStepper stepper(AccelStepper::FULL4WIRE, 7, 5, 6, 4);
WebServer Server(80);

long totalSteps = 0;

void setup() {
    Serial.begin(9600);

    WiFiManager wifiManager;
    // Set lower speeds to maximize torque
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

    // Define Server paths
    Server.on("/moveCW", HTTP_POST, []() {
        stepper.move(2048); // Move 2048 steps (approximately 360 degrees)
        totalSteps += 2048;
        Server.send(200, "text/plain", "Moved Clockwise");
    });

    Server.on("/moveCCW", HTTP_POST, []() {
        stepper.move(-2048); // Move -2048 steps
        totalSteps -= 2048;
        Server.send(200, "text/plain", "Moved Counter-Clockwise");
    });

    Server.on("/status", HTTP_GET, []() {
        String message = "Total Steps: " + String(totalSteps);
        Server.send(200, "text/plain", message);
    });

    Server.on("/resetWiFi", HTTP_GET, [&wifiManager]() {
        wifiManager.resetSettings();
        Server.send(200, "text/plain", "WiFi settings reset. Restarting...");
        delay(1000);
        ESP.restart();
    });

// Set RPM dynamically along with maxSpeed and acceleration
Server.on("/setRPM", HTTP_POST, []() {
    bool hasError = false;
    String responseText = "Updated parameters: ";

    if (Server.hasArg("rpm")) {
        int rpm = Server.arg("rpm").toInt();
        if (rpm > 0) {
            stepper.setSpeed(rpm); // Adjust speed according to RPM
            responseText += "Speed set to " + String(rpm) + " RPM. ";
        } else {
            hasError = true;
            responseText += "Invalid RPM value. ";
        }
    } else {
        hasError = true;
        responseText += "No RPM value provided. ";
    }

    if (Server.hasArg("maxSpeed")) {
        float maxSpeed = Server.arg("maxSpeed").toFloat();
        if (maxSpeed > 0) {
            stepper.setMaxSpeed(maxSpeed); // Set the maximum speed
            responseText += "Max Speed set to " + String(maxSpeed) + ". ";
        } else {
            hasError = true;
            responseText += "Invalid Max Speed value. ";
        }
    }

    if (Server.hasArg("acceleration")) {
        float acceleration = Server.arg("acceleration").toFloat();
        if (acceleration > 0) {
            stepper.setAcceleration(acceleration); // Set the acceleration
            responseText += "Acceleration set to " + String(acceleration) + ". ";
        } else {
            hasError = true;
            responseText += "Invalid Acceleration value. ";
        }
    }

    if (hasError) {
        Server.send(400, "text/plain", responseText);
    } else {
        Server.send(200, "text/plain", responseText);
    }
});


    Server.begin();
    Serial.println("HTTP Server started");
}

void loop() {
    dnsServer.processNextRequest();
    Server.handleClient();
    stepper.run(); // Process stepper actions
}
