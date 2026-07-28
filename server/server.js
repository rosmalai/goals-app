require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((s) => s.trim()).filter(Boolean)
    : null;

app.use(
    cors(
        allowedOrigins
            ? {
                  origin(origin, callback) {
                      if (!origin || allowedOrigins.includes(origin)) {
                          callback(null, true);
                      } else {
                          callback(null, false);
                      }
                  },
              }
            : undefined
    )
);
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

app.use('/api/goals', require('./routes/goals'));

app.get('/', (req, res) => res.json({ message: 'Goals API running' }));

module.exports = app;

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    connectDB()
        .then(() => {
            console.log('MongoDB connected');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err.message);
            process.exit(1);
        });
}
