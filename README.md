![GitHub issues](https://img.shields.io/github/issues/Jozefwl/biot-shutter)
![GitHub forks](https://img.shields.io/github/forks/Jozefwl/biot-shutter)
![GitHub stars](https://img.shields.io/github/stars/Jozefwl/biot-shutter)
![GitHub license](https://img.shields.io/github/license/Jozefwl/biot-shutter)
![GitHub last commit](https://img.shields.io/github/last-commit/Jozefwl/biot-shutter)

![Node-RED](https://img.shields.io/badge/Node--RED-8F0000?style=flat&logo=nodered&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![HARDWARIO CORE](https://img.shields.io/badge/HARDWARIO%20CORE-DD1133?style=flat&logoColor=grey)
![ESP32](https://img.shields.io/badge/ESP32-0000FF?style=flat&logo=espressif&logoColor=white)

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

# Disclaimer

The information provided in this documentation is intended for general guidance on using the ESP32 S3 API endpoints.

Users are solely responsible for their use of the API. The API allows a wide range of step inputs to accommodate different use cases, from small adjustments to large operations. However, users should exercise caution and not exceed circa 30,000 steps in a single command to prevent potential damage to the stepper motor or connected mechanical assemblies, even though the technical limit is set at 1,000,000 steps to accommodate exceptionally large setups.

By using these endpoints, users acknowledge and accept full responsibility for any consequences that may arise from their actions, including but not limited to hardware damage or system malfunctions. The creators of this API and any associated parties expressly disclaim any liability for damages or issues resulting from the use of this API.

## Endpoints

### 1. Move Clockwise

- **URL**: `/moveCW`
- **Method**: `POST`
- **Description**: Moves the stepper motor clockwise by the specified number of steps, up to a maximum of 10,000 steps per request.
- **Request Body**: JSON object specifying the number of steps.
  ```json
  {
    "steps": 1000
  }
  ```
- **Response**:
  - **Content**: JSON object including a message and the total steps moved.
    ```json
    {
      "message": "Moved Clockwise",
      "totalSteps": totalSteps
    }
    ```

### 2. Move Counter-Clockwise

- **URL**: `/moveCCW`
- **Method**: `POST`
- **Description**: Moves the stepper motor counter-clockwise by the specified number of steps, up to a maximum of 10,000 steps per request.
- **Request Body**: JSON object specifying the number of steps.
  ```json
  {
    "steps": 1000
  }
  ```
- **Response**:
  - **Content**: JSON object including a message and the total steps moved.
    ```json
    {
      "message": "Moved Counter-Clockwise",
      "totalSteps": totalSteps
    }
    ```

### 3. Get Stepper Status

- **URL**: `/status`
- **Method**: `GET`
- **Description**: Retrieves the total number of steps the stepper motor has taken since the last reset.
- **Response**:
  - **Content**: JSON object showing the total steps.
    ```json
    {
      "totalSteps": totalSteps
    }
    ```

### 4. Reset WiFi Settings

- **URL**: `/resetWiFi`
- **Method**: `GET`
- **Description**: Resets the WiFi settings and restarts the ESP32 to apply changes.
- **Response**:
  - **Content**: JSON object indicating the reset status.
    ```json
    {
      "message": "WiFi settings reset. Restarting..."
    }
    ```

### 5. Set to Specific Number of Steps

- **URL**: `/setToSteps`
- **Method**: `POST`
- **Description**: Moves the stepper to a specific absolute position expressed as the number of steps from the initial position. This endpoint adjusts the stepper to reach the desired step count, positive or negative adjustments are handled internally.
- **Request Body**: JSON object specifying the desired step count.
- **Warning**: We take no responsibility if you break your shutters by sending too big of a number.
  ```json
  {
    "steps": 50000
  }
  ```
- **Response**:
  - **Content**: JSON object showing the movement initiation and the requested step count.
    ```json
    {
      "message": "Moving to set steps",
      "requestedSteps": steps,
      "totalSteps": totalSteps
    }
    ```
- **Constraints**:
  - Steps cannot be negative or exceed 1,000,000.

