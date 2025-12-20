const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB database
 * 
 * @description
 * Connects to MongoDB using the connection string from environment variables.
 * The deprecated options (useNewUrlParser, useUnifiedTopology) have been removed
 * as they have no effect in MongoDB Driver version 4.0.0+ and will be removed
 * in future major versions.
 * 
 * @throws {Error} Exits process with code 1 if connection fails
 * 
 * @example
 * // In server.js
 * connectDB();
 */
const connectDB = async () => {
  try {
    // Validate MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB
    // Note: useNewUrlParser and useUnifiedTopology are deprecated and removed
    // They have no effect since MongoDB Driver v4.0.0
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // Log successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    // Log error details
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`🔍 Error Details:`, error);
    
    // Exit process on connection failure
    process.exit(1);
  }
};

module.exports = connectDB;
