const express = require('express');
const router = express.Router();
const Blind = require("../models/blindsModel");
const ScheduledEvent = require('../models/scheduledEventsModel');

router.use(express.json());

router.post("/toggle", async(req, res) => {
    const id = req.body.id;
    const requiredPosition = req.body.requiredPosition

    try{
        await Blind.findByIdAndUpdate(id, {motorPosition: requiredPosition, updatedAt: Date.now()})

        await new Promise(resolve => setTimeout(resolve, 5000));

        // TO-DO: add call to change motor position on the actual motor

        res.status(200).json(
            {
                dToOut: {
                    "code": 0,
                    "msg": `Motor position successfully changed to ${requiredPosition}`
                }
            }
        );
    }
    catch(err){
        res.status(404).json(
            {
                dToOut: {
                    error: 404,
                    msg: 'No blinds found'
                }
            }
        );
    }

});

router.post("/update", async(req, res) => {
    const blindId = req.body.id;
    const updatedBlind = {

    };

    if (req.body.newName !== undefined) {
        updatedBlind.name = req.body.newName;
    }

    if (req.body.daylightSensor!== undefined) {
        updatedBlind.daylightSensor = req.body.daylightSensor ;
    }

    if (req.body.manualTimeSettings !== undefined) {
        updatedBlind.manualTimeSettings = req.body.manualTimeSettings;
    }

    try {
        if (updatedBlind.daylightSensor !== undefined && 
            updatedBlind.manualTimeSettings !== undefined &&
            updatedBlind.daylightSensor && updatedBlind.manualTimeSettings) { 

            return res.status(422).json(
                {
                    dToOut : {
                        error: 3,
                        msg: "Blinds can't be operated according to day light and have manual time settings at the same time!"
                    }
                }
            )
        } 
        

        await Blind.findByIdAndUpdate(blindId, updatedBlind)
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

router.get("/status", async(req, res) => {

    const blindId = req.query.id

    try{
        const blind = await Blind.findById(blindId)
        const scheduledEvents = await ScheduledEvent.find({blindId: blindId })

        res.status(200).json({
            dToOut: {
                blindStatus: blind,
                scheduledEvents: scheduledEvents
            }
        });
    }
    catch(err){
        res.status(404).json(
            {
                dToOut: {
                    error: 404,
                    msg: 'No blinds found'
                }
            }
        );
    }

});


module.exports = router
