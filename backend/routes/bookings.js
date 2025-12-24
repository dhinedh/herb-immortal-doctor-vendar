const express = require('express');
const router = express.Router();
const { Booking } = require('../models/Activity');

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a booking
router.post('/', async (req, res) => {
    const booking = new Booking({
        id: 'booking-' + Date.now(),
        ...req.body
    });
    try {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
