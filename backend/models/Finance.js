const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    doctor_id: String,
    balance: Number,
    total_earned: Number,
    total_withdrawn: Number,
    transactions: [{
        id: String,
        type: String,
        amount: Number,
        description: String,
        date: String
    }]
});

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customer_name: String,
    date: String,
    status: String,
    total: Number,
    items: [{
        product_name: String,
        quantity: Number,
        price: Number
    }]
});

module.exports = {
    Wallet: mongoose.model('Wallet', WalletSchema),
    Order: mongoose.model('Order', OrderSchema),
};
