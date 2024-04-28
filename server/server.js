require('dotenv').config();
const express = require("express");

const basicRouter = require("./routes/basicRouter");
const scheduleRoutes = require("./routes/scheduleRouter");
const connectDb = require("./middleware/dbConn")
const mongoose = require("mongoose");

const app = express();
const port = 4000;

connectDb()

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

mongoose.connection.once('open', () =>{
    console.log('MongoDb connected');
    app.listen(port, () => {console.log(`Server is running at http://localhost:${port}`)});
});
