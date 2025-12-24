const express = require('express');
const router = express.Router();
const { Wallet, Order } = require('../models/Finance');

router.get('/wallet', async (req, res) => {
    try {
        // For mock purposes, just get the first wallet or by doctor_id if we had auth
        const wallet = await Wallet.findOne();
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
