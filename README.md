# biot-shutter
This project is an IoT-based shutter control system designed to manage window shutters via a web interface. The system utilizes Hardwario Core Module as the IoT gateway and ESP32-3S modules as controllers for individual shutters. The backend is developed using Express.js, and the frontend is implemented with React, providing a responsive and user-friendly interface.

## System Architecture

### Components

- **Hardwario Core Module**: Serves as the IoT gateway, facilitating communication between the ESP32 controllers and the web server.
- **ESP32-3S Modules**: Act as controllers for the shutters, handling physical operations like opening and closing based on commands received from the web server.
- **Web Application**:
  - **Frontend**: Developed in React, offers an interactive UI for users to control shutters and view their statuses.
  - **Backend**: Built with Express.js, manages API requests from the frontend and communicates with the IoT gateway.

### Features

- **Remote Shutter Control**: Open or close shutters via the web interface.
- **Status Monitoring**: View the current status and position of each shutter.
- **Adjustable Motor Control**: Set parameters such as speed, direction, and acceleration for the shutters.
- **WiFi Configuration**: Includes functionality to reset and configure WiFi settings through the web interface.

## Setup Instructions

### Prerequisites

- Node.js and npm installed.
- ESP-IDF for programming ESP32 modules.

### Hardware Setup

1. **ESP32-3S Setup**:
   - Flash the provided firmware onto each ESP32-3S module.
   - Connect each module to the corresponding shutter motor as per the wiring diagrams.

2. **Hardwario Core Module Setup**:
   - Configure the Hardwario Core Module to communicate with the ESP32 modules.
   - Ensure proper network configuration for seamless communication.

### Software Setup

1. **Backend (Express.js)**:
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `npm install`
   - Start the server: `npm start`

2. **Frontend (React)**:
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies: `npm install`
   - Run the React application: `npm start`
   - Access the web interface via `http://localhost:3000` in your browser.

3. **ESP32 Firmware**:
   - Open the provided firmware in the ESP-IDF environment.
   - Build and flash the firmware to the ESP32 module.


# ESP32 S3 API Endpoints Documentation

This section provides detailed documentation for the HTTP endpoints implemented on the ESP32 web server for controlling a stepper motor. The server facilitates several operations, including moving the stepper motor, reporting status, and managing device configuration.

## Endpoints

### 1. Move Clockwise

- **URL**: `/moveCW`
- **Method**: `POST`
- **Description**: Moves the stepper motor 2048 steps clockwise, which approximates a 360-degree rotation.
- **Response**:
  - **Content**: `Moved Clockwise`

### 2. Move Counter-Clockwise

- **URL**: `/moveCCW`
- **Method**: `POST`
- **Description**: Moves the stepper motor 2048 steps counter-clockwise.
- **Response**:
  - **Content**: `Moved Counter-Clockwise`

### 3. Get Stepper Status

- **URL**: `/status`
- **Method**: `GET`
- **Description**: Retrieves the total number of steps the stepper motor has taken since the last reset.
- **Response**:
  - **Content**: e.g., `Total Steps: 4096`

### 4. Reset WiFi Settings

- **URL**: `/resetWiFi`
- **Method**: `GET`
- **Description**: Resets the WiFi settings and restarts the ESP32.
- **Response**:
  - **Content**: `WiFi settings reset. Restarting...`

### 5. Set RPM, Maximum Speed, and Acceleration

- **URL**: `/setRPM`
- **Method**: `POST`
- **Description**: Adjusts the stepper motor's RPM, maximum speed, and acceleration based on provided parameters. Each parameter is optional but requires valid numerical input.
- **Data Constraints**:
  - `rpm`: Positive integer representing the rotations per minute.
  - `maxSpeed`: Positive float representing the maximum speed.
  - `acceleration`: Positive float representing the acceleration rate.
- **Sample Request**: 
SEND AS WEB FORM
    rpm: 1,
    maxSpeed: 500,
    acceleration: 50
