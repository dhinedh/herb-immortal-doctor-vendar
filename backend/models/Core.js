const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID to match sampleData
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    date_of_birth: String,
    gender: String,
    avatar_url: String,
});

const DoctorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    preferred_name: String,
    pronouns: String,
    email: { type: String, required: true },
    phone: String,
    date_of_birth: String,
    gender: String,

    // Professional Info
    specialization: String,
    experience_years: { type: Number, default: 0 },
    consultation_fee: Number,
    about: String,
    work_best_with: String, // "Who do you work best with?"

    education: [{
        degree: String,
        specialization: String,
        institution: String,
        country: String,
        start_year: Number,
        end_year: Number
    }],

    licenses: [{
        license_type: String,
        issuing_authority: String,
        license_number: String,
        issue_date: String,
        expiry_date: String
    }],

    certificates: [{
        title: String,
        issued_by: String,
        year: Number
    }],

    // Contact / Location
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        postal_code: String,
    },

    // Practice Details
    service_locations: [String],
    services_provided_to: [String],
    treatment_platforms: [String],
    languages: [String],

    // Availability
    availability: [{
        day_of_week: Number, // 0-6
        is_available: Boolean,
        time_slots: [{
            start_time: String,
            end_time: String
        }]
    }],

    // System
    avatar_url: String,
    status: { type: String, default: 'pending' }, // pending, active, suspended
    onboarding_completed: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },

    // Settings
    settings: {
        email_notifications: { type: Boolean, default: true },
        sms_notifications: { type: Boolean, default: false },
        booking_alerts: { type: Boolean, default: true },
        payment_alerts: { type: Boolean, default: true },
        chat_alerts: { type: Boolean, default: true },
        language: { type: String, default: 'English' },
        timezone: { type: String, default: '(GMT+05:30) India Standard Time' },
        date_format: { type: String, default: 'DD/MM/YYYY' },
    }
});

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    price: Number,
    stock: Number,
    image_url: String,
    category: String,
    status: String,
});

module.exports = {
    Patient: mongoose.model('Patient', PatientSchema),
    Doctor: mongoose.model('Doctor', DoctorSchema),
    Product: mongoose.model('Product', ProductSchema),
};
