require('dotenv').config();
const express = require("express");
const https = require('https');
const fs = require('fs');
const Blind = require("./models/blindsModel");

const basicRouter = require("./routes/basicRouter");
const scheduleRoutes = require("./routes/scheduleRouter");
const authRouter = require("./routes/authRouter");
const connectDb = require("./middleware/dbConn")
const mongoose = require("mongoose");
const MqttHandler = require('./middleware/mqttHandler')

const app = express();
const port = 4000;

connectDb()

const mqttHandler = new MqttHandler()

mqttHandler.client.on('connect', () => {
    mqttHandler.client.subscribe('percentFromBE', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic: percentFromBE');
        }
    });
});

mqttHandler.client.on('message', async (topic, message) => {
    if (topic === 'percentFromBE') {
        const messageObject = JSON.parse(message.toString());
        const requiredPosition = messageObject.percent;
        const id = '66351b236ca9c24b6afd71e1';

        try {
            await Blind.findByIdAndUpdate(id, {motorPosition: requiredPosition, updatedAt: Date.now()});
            console.log(`Motor position successfully changed to ${requiredPosition}`);
        } catch (err) {
            console.error('Failed to update motor position:', err);
        }
    }
});

// Load SSL/TLS certificate and key
/*
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/waldhauser.sk/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/waldhauser.sk/fullchain.pem')
};
*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.use(express.json());

app.get("/info", (req, res) => {
    res.send("Working!")
});

// blinder schedule paths
app.use("/schedule", scheduleRoutes);

// basic paths
app.use("/blinds", basicRouter);

// auth paths
app.use("/auth", authRouter);

// -------------------------------------------
// - Uncomment for DEVELOPMENT without HTTPS -
// -------------------------------------------


mongoose.connection.once('open', () =>{
    console.log('MongoDb connected');
    app.listen(port, () => {console.log(`Server is running at http://localhost:${port}`)});
});

/*
mongoose.connection.once('open', () =>{
    console.log('MongoDb connected');
    https.createServer(options, app).listen(port, () => {
        console.log(`Server is running over HTTPS at https://localhost:${port}`);
    });
});
*/