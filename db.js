const mongoose = require('mongoose');

async function connectDB() {
    try {
        const uri = 'mongodb://127.0.0.1:27017/auth';

        await mongoose.connect(uri);
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;