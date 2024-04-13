const express = require('express');
const router = express.Router();

router.use(express.json());

router.post("/toggle", async(req, res) => {
    res.status(200).json({ message: 'Working!' });
});

router.post("/update", async(req, res) => {
    res.status(200).json({ message: 'Working!' });
});

router.get("/status", async(req, res) => {
    res.status(200).json({ message: 'Working!' });
});


module.exports = router
