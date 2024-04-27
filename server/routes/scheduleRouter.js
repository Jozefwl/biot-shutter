const express = require('express');
const router = express.Router();
const ScheduledEvent = require('../models/scheduledEventsModel');

router.use(express.json());


router.post("/edit", async(req, res) => {
    const id = req.body.id;

    let requiredPosition = process.env.LOWER_POSITION

    if(req.body.action === "up"){
        requiredPosition = process.env.UPPER_POSITION
    }

    const updatedSchedule = {
        time: req.body.newTime,
        action: req.body.action,
        requiredMotorPosition: requiredPosition
    };

    try {

        await ScheduledEvent.findByIdAndUpdate(id, updatedSchedule)
        res.status(200).json(
            {
                dToOut: {
                    "code": 0,
                    "msg": "Blind settings successfully updated!"
                }
            }
        );

    }
    catch(err){
        res.status(500).json(
            {
                dToOut: {
                    error: 500,
                    msg: err
                }
            }
        );
    }
});

router.delete("/remove", async(req, res) => {
    try {
        const id = req.query.id;
        await ScheduledEvent.findByIdAndDelete(id)

        res.status(200).json(
            {
                dToOut: {
                    "code": 0,
                    "msg": "Scheduled event successfully deleted!"
                }
            }
        );

    }
    catch (err){
        res.status(500).json(
            {
                dToOut: {
                    "code": 0,
                    "msg": err
                }
            }
        );
    }
});

router.post("/add", async(req, res) => {
    try{
        let requiredPosition = process.env.LOWER_POSITION

        if(req.body.action === "up"){
             requiredPosition = process.env.UPPER_POSITION
        }

        const newEvent = new ScheduledEvent(
            {
                blindId: req.body.blindId,
                action: req.body.action,
                time: req.body.time,
                requiredMotorPosition: requiredPosition
            }
        );
        await newEvent.save();

        res.status(200).json(
            {
                dToOut: {
                    "code": 0,
                    "msg": "Scheduled event successfully created!"
                }
            }
        );
    }
    catch(err){
        res.status(500).json(
            {
                dToOut: {
                    "code": 0,
                    "msg": err
                }
            }
        );
    }
});


module.exports = router
