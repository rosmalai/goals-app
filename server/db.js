const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function getUri() {
    if (process.env.USE_MEMORY_DB === 'true' && !process.env.VERCEL) {
        if (!global.memoryServer) {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            global.memoryServer = await MongoMemoryServer.create();
            console.log('Using in-memory MongoDB (local dev — data resets on restart)');
        }
        return global.memoryServer.getUri('goals');
    }

    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI environment variable is not set');
    }
    return uri;
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = getUri().then((uri) =>
            mongoose.connect(uri, {
                serverSelectionTimeoutMS: 10000,
                family: 4,
            })
        );
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
