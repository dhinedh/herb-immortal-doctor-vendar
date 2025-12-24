const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/Core');
// In a real app, use bcrypt and jwt. For this transition, we'll keep it simple or mock the token.

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // For now, accept any password as we don't have hashed passwords in seed data
        const user = await Doctor.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return the user object and a mock token
        res.json({
            user,
            token: 'mock-jwt-token-' + user.id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, fullName, phone } = req.body;
    try {
        const existingUser = await Doctor.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new Doctor({
            id: 'doctor-' + Date.now(),
            full_name: fullName,
            email,
            phone,
            status: 'pending' // Default status
        });

        await newUser.save();

        res.status(201).json({
            user: newUser,
            token: 'mock-jwt-token-' + newUser.id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
