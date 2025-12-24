const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Herb Immortal API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const bookingRoutes = require('./routes/bookings');
const financeRoutes = require('./routes/finance');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chats');
const productRoutes = require('./routes/products');
const doctorRoutes = require('./routes/doctors');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/doctors', doctorRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
