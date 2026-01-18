const fs = require('fs');
const path = require('path');

try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    const match = envContent.match(/FB_PRIVATE_KEY=(.*)/);
    if (!match) {
        console.error('FB_PRIVATE_KEY not found in .env.local');
        process.exit(1);
    }

    let privateKey = match[1];
    // Remove quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
    }
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    // Encode to Base64
    const base64Key = Buffer.from(privateKey).toString('base64');

    console.log('\n=== 下の値をコピーして、App Hostingの環境変数 FB_PRIVATE_KEY に貼り付けてください ===\n');
    console.log(base64Key);
    console.log('\n================================================================================\n');

} catch (error) {
    console.error('Error:', error.message);
}
