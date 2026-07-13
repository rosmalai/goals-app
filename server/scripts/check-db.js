require('dotenv').config();
const https = require('https');
const mongoose = require('mongoose');

function getPublicIp() {
    return new Promise((resolve, reject) => {
        https
            .get('https://api.ipify.org', (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => resolve(data.trim()));
            })
            .on('error', reject);
    });
}

async function main() {
    console.log('--- MongoDB connection check ---\n');

    if (!process.env.MONGO_URI) {
        console.error('FAIL: MONGO_URI is missing in server/.env');
        process.exit(1);
    }

    console.log('MONGO_URI: loaded');
    console.log('Database: goals');

    const ip = await getPublicIp();
    console.log(`Your public IP: ${ip}`);
    console.log(`\nIn Atlas, add this exact entry if missing:`);
    console.log(`  ${ip}/32\n`);

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4,
        });
        console.log('SUCCESS: Connected to MongoDB Atlas');
        process.exit(0);
    } catch (err) {
        console.error('FAIL:', err.message);
        console.error('\nSteps:');
        console.error('1. https://cloud.mongodb.com → your project');
        console.error('2. Network Access → + Add IP Address');
        console.error(`3. Enter ${ip}/32 (or click "Add Current IP Address")`);
        console.error('4. Wait 2 minutes, run: npm run check-db');
        process.exit(1);
    }
}

main();
