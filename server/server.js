const express = require("express");

const basicRouter = require("./routes/basicRouter");
const scheduleRoutes = require("./routes/scheduleRouter");

const app = express();
const port = 4000;

app.use(express.json());

app.get("/info", (req, res) => {
    res.send("Working!")
});

// blinder schedule paths
app.use("/schedule", scheduleRoutes);

// basic paths
app.use("", basicRouter);

app.listen(port, () => {console.log(`Server is running at http://localhost:${port}`)})
