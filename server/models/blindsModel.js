const mongoose = require('mongoose');

const blindsSchema = new mongoose.Schema({
    "createdAt": { type: Number, required: true },
    "updatedAt": { type: Number, required: true },
    "name": { type: String, required: true },
    "location": { type: String, required: true },
    "motorPosition": { type: Number, required: true },
    "daylightSensor": { type: Boolean, required: true },
    "manualTimeSettings": { type: Boolean, required: true }
});

module.exports = mongoose.model("Blind", blindsSchema);
