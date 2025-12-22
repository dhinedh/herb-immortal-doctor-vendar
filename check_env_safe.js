const fs = require('fs');
try {
    const content = fs.readFileSync('.env', 'utf8');
    if (content.includes('rltcqjzwwecavlwulaiy')) {
        console.log('BAD_URL_DETECTED');
    } else {
        console.log('URL_LOOKS_DIFFERENT');
        // Also print what it starts with to verify it's a URL
        const match = content.match(/VITE_SUPABASE_URL=(.*)/);
        if (match) console.log('Current URL starts with:', match[1].substring(0, 15) + '...');
    }
} catch (e) {
    console.error('Error reading .env:', e.message);
}
