const express = require('express');
const router = express.Router();
const { Patient } = require('../models/Core');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one patient
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findOne({ id: req.params.id });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
