const express = require('express');
const router = express.Router();

router.use(express.json());


router.post("/edit", async(req, res) => {
    res.status(200).json({ message: 'Working!' });
});

router.post("/remove", async(req, res) => {
    res.status(200).json({ message: 'Working!' });
});

router.post("/add", async(req, res) => {
    res.status(200).json({ message: 'Working!' });
});


module.exports = router
