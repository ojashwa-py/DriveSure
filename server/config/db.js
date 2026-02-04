const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    process.env.DB_CONNECTED = 'true';
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('Running in OFFLINE/MOCK mode');
    process.env.DB_CONNECTED = 'false';
    // process.exit(1); // Do not exit, allow mock mode
  }
};

module.exports = connectDB;
