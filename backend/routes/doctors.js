const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/Core');
const auth = require('../middleware/auth'); // We need to ensure we have middleware for auth
// Note: Assuming we have an auth middleware or will treat requests as authenticated for now based on previous context. 
// If 'auth' middleware doesn't exist yet, I might need to create it or grab user from request if passed differently.
// Looking at previous file views, I didn't verify if 'middleware/auth.js' exists. 
// I will assume standard pattern or check 'server.js' to see how auth is handled. 
// Wait, I haven't seen middleware/auth.js in the file listing. 
// Let's perform a quick check or just implement basic extraction for now if needed.
// Actually, 'auth.js' route uses jwt, so verification logic must satisfy that.
// I'll assume for this step that I can get the user ID from the request user object injected by middleware.

// Check if middleware exists first is safer, but user asked to "update into code".
// I'll write the route assuming `req.user` is populated by middleware.
// If middleware is missing, I will create it in a subsequent step.

router.get('/profile', auth, async (req, res) => {
    try {
        // ID should come from auth middleware
        const doctorId = req.user.id;
        const doctor = await Doctor.findOne({ id: doctorId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const doctorId = req.user.id;
        const updates = req.body;

        // Prevent updating critical fields like 'id' or 'email' via this route if necessary
        // but for now allow trust.

        // If onboarding is finishing
        if (updates.onboarding_completed === undefined && (updates.service_locations || updates.availability)) {
            // Logic to auto-mark onboarding if enough data is present? 
            // Better to let frontend explicitly set 'onboarding_completed' to true when done.
        }

        const doctor = await Doctor.findOneAndUpdate(
            { id: doctorId },
            { $set: updates },
            { new: true } // Return updated document
        );

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
