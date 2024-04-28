const express = require('express');
const router = express.Router();
const Blind = require("../models/blindsModel");

router.use(express.json());

router.post("/toggle", async(req, res) => {
    const id = req.body.id;
    const requiredPosition = req.body.requiredPosition

    try{
        await Blind.findByIdAndUpdate(id, {motorPosition: requiredPosition, updatedAt: Date.now()})

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
        name: req.body.newName
    };

    if (req.body.dayLightControls !== undefined) {
        updatedBlind.dayLightControls = req.body.dayLightControls;
    }

    if (req.body.manualTimeSettings !== undefined) {
        updatedBlind.manualTimeSettings = req.body.manualTimeSettings;
    }

    try {
        if(updatedBlind.dayLightControls === updatedBlind.manualTimeSettings && 
            updatedBlind.dayLightControls !== undefined && 
            updatedBlind.manualTimeSettings !== undefined) {

            res.status(422).json(
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
        res.status(200).json({ dToOut: blind });
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
