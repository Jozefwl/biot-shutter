const mongoose = require('mongoose');

const scheduledEventsSchema = new mongoose.Schema({
    "createdAt": { type: Number, required: true },
    "updatedAt": { type: Number, required: true },
    "blindId": { type: String, required: true },
    "ownerId": { type: String, required: true },
    "start": { type: Number, required: true },
    "end": { type: Number, required: true },
    "repeatWeekly": { type: Number, required: true },
    "days": { type: String, required: false },
    "requiredMotorPosition": { type: Number, required: true }
});

module.exports = mongoose.model("scheduledEvents", scheduledEventsSchema);
