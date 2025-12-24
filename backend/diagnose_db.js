require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('--- MongoDB Connection Diagnostics ---');
if (!uri) {
    console.error('ERROR: MONGODB_URI is undefined in .env');
    process.exit(1);
}

// Mask password for safe logging
const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Loaded URI: ${maskedUri}`);

// Check for common issues
if (uri.includes('<password>')) {
    console.error('ERROR: Placeholder <password> found in URI. Please replace it with your actual password.');
}

console.log('Attempting to connect...');
mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('CONNECTION FAILED:');
        console.error(err.message);
        if (err.codeName === 'AtlasError' && err.code === 8000) {
            console.error('HINT: This is an Authentication Error. Check your username and password.');
            console.error('Ensure special characters in the password are URL encoded.');
        }
        process.exit(1);
    });
