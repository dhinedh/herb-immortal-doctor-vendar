const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    patient_id: { type: String, ref: 'Patient' }, // Using String ID for now to match sampleData
    date: String,
    start_time: String,
    end_time: String,
    duration_minutes: Number,
    consultation_type: String,
    status: String,
    primary_concern: String,
    notes: String,
    amount: Number,
    // patients: embedded or looked up? In sampleData it's embedded sometimes, but usually referenced.
});

const ChatSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    patient_id: String,
    last_message: String,
    last_message_at: String,
    unread_count_healer: Number,
});

const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    chat_id: String,
    sender_type: String,
    sender_id: String,
    content: String,
    created_at: String,
    is_read: Boolean,
});

const NotificationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    message: String,
    type: String,
    read: Boolean,
    created_at: String,
});

module.exports = {
    Booking: mongoose.model('Booking', BookingSchema),
    Chat: mongoose.model('Chat', ChatSchema),
    Message: mongoose.model('Message', MessageSchema),
    Notification: mongoose.model('Notification', NotificationSchema),
};
