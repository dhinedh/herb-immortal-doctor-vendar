const mongoose = require('mongoose');
require('dotenv').config();
const { Patient, Doctor, Product } = require('./models/Core');
const { Booking, Chat, Message, Notification } = require('./models/Activity');
const { Wallet, Order } = require('./models/Finance');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        seedData();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const samplePatients = [
    {
        id: 'patient-1',
        full_name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        date_of_birth: '1985-03-15',
        gender: 'Female',
    },
    {
        id: 'patient-2',
        full_name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        date_of_birth: '1990-07-22',
        gender: 'Male',
    },
    {
        id: 'patient-3',
        full_name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        date_of_birth: '1988-11-30',
        gender: 'Female',
    },
    {
        id: 'patient-4',
        full_name: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+1 (555) 456-7890',
        date_of_birth: '1975-09-08',
        gender: 'Male',
    },
    {
        id: 'patient-5',
        full_name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1 (555) 567-8901',
        date_of_birth: '1992-05-17',
        gender: 'Female',
    },
];

const sampleBookings = [
    {
        id: 'booking-1',
        patient_id: 'patient-1',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '11:00',
        duration_minutes: 60,
        consultation_type: 'video',
        status: 'confirmed',
        primary_concern: 'Digestive health consultation',
        notes: '',
        amount: 75.00,
    },
    // Add other sample bookings simplified...
];

const sampleDoctor = {
    id: 'doctor-123',
    full_name: 'Dr. John Doe',
    preferred_name: 'John',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-0000',
    specialization: 'Ayurveda',
    experience_years: 15,
    consultation_fee: 500,
    about: 'Experienced Ayurvedic practitioner...',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    status: 'approved',
    rating: 4.8,
    review_count: 124,
};

async function seedData() {
    try {
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        await Product.deleteMany({});
        await Booking.deleteMany({});
        await Chat.deleteMany({});
        await Message.deleteMany({});
        await Notification.deleteMany({});
        await Wallet.deleteMany({});
        await Order.deleteMany({});

        await Patient.insertMany(samplePatients);
        await Doctor.create(sampleDoctor);

        // Create at least one booking
        await Booking.create({
            id: 'booking-1',
            patient_id: 'patient-1',
            date: new Date().toISOString().split('T')[0],
            start_time: '10:00',
            end_time: '11:00',
            duration_minutes: 60,
            consultation_type: 'video',
            status: 'confirmed',
            primary_concern: 'Digestive health',
            amount: 75
        });

        console.log('Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}
