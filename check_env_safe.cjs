const fs = require('fs');
try {
    const content = fs.readFileSync('.env', 'utf8');
    if (content.includes('rltcqjzwwecavlwulaiy')) {
        console.log('BAD_URL_DETECTED');
    } else {
        console.log('URL_LOOKS_DIFFERENT');
        const match = content.match(/VITE_SUPABASE_URL=(.*)/);
        if (match) console.log('Current URL starts with:', match[1].trim());
    }
} catch (e) {
    console.error('Error reading .env:', e.message);
}
