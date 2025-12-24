const express = require('express');
const router = express.Router();
const { Chat, Message } = require('../models/Activity');

// Get all chats for the doctor (mocked as all chats)
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.aggregate([
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patient_id',
                    foreignField: 'id',
                    as: 'patients'
                }
            },
            {
                $unwind: {
                    path: '$patients',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get messages for a chat
router.get('/:chatId/messages', async (req, res) => {
    try {
        const messages = await Message.find({ chat_id: req.params.chatId }).sort({ created_at: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a message
router.post('/:chatId/messages', async (req, res) => {
    try {
        const message = new Message({
            id: 'msg-' + Date.now(),
            chat_id: req.params.chatId,
            created_at: new Date().toISOString(),
            ...req.body
        });
        await message.save();

        // Update chat last message
        await Chat.findOneAndUpdate(
            { id: req.params.chatId },
            {
                last_message: req.body.content,
                last_message_at: new Date().toISOString()
            }
        );

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
