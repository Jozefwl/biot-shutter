const mongoose = require('mongoose');

const scheduledEventsSchema = new mongoose.Schema({
    "blindId": { type: String, required: true },
    "action": { type: String, required: true },
    "time": { type:String, required: true },
    "requiredMotorPosition": { type: Number, required: true }
});

module.exports = mongoose.model("scheduledEvents", scheduledEventsSchema);
