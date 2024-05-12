const express = require('express');
const router = express.Router();
const Blind = require("../models/blindsModel");
const User = require("../models/userModel");
const ScheduledEvent = require('../models/scheduledEventsModel');
const MqttHandler = require('../middleware/mqttHandler')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('./middlewares/authenticate');
const mongoose = require('mongoose');

// Function to get user IDs from emails
async function getUserIdsFromEmails(emails) {
    const users = await User.find({ email: { $in: emails } }).select('_id email');
    const userIdMap = {};
    const invalidemails = [];

    for (const email of emails) {
        const user = users.find(u => u.email === email);
        if (user) {
            userIdMap[email] = user._id.toString();
        } else {
            invalidemails.push(email);
        }
    }

    if (invalidemails.length > 0) {
        throw new Error("The following emails do not exist in the database: " + invalidemails.join(', '));
    }

    return userIdMap;
}

// Function to verify user credentials and generate a JWT token
async function verifyUserAndGenerateToken(email, password) {
    const user = await User.findOne({ email: email });
    if (!user) {
        return { error: 'Email or password incorrect', status: 401 };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return { error: 'Email or password incorrect', status: 401 };
    }

    const expirationDuration = 60 * 60; // 60 minutes in seconds
    const expirationTimestamp = Math.floor(Date.now() / 1000) + expirationDuration;
    
    const token = jwt.sign(
        { userId: user._id, role: user.role, exp: expirationTimestamp },
        process.env.JWT_SECRET
    );

    return { token: token, userId: user._id, expiresAt: expirationTimestamp, status: 200 };
}

// POST command to login
router.post('/login', async (req, res) => {
    try {
        const result = await verifyUserAndGenerateToken(req.body.email, req.body.password);
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        res.json({ message: 'Successfully authenticated', userToken: result.token, expiresAt: result.expiresAt });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// POST command to register
router.post('/register', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user and save to database
        const user = new User({
            email: req.body.email,
            password: hashedPassword
            // Role field is not included here
        });
        const savedUser = await user.save();

        // Respond with the created user details (excluding password)
        res.status(201).json({ email: savedUser.email, _id: savedUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
});

