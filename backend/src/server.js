require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const settlementRoutes = require('./routes/settlementRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/settlements', settlementRoutes);

/**
 * Root route handler
 * 
 * @description
 * Provides API information and available endpoints
 * 
 * @route GET /
 * @access Public
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ContriPlz - Expense Sharing API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      groups: '/api/groups',
      expenses: '/api/expenses',
      balances: '/api/balances',
      settlements: '/api/settlements',
    },
    documentation: 'See README.md for detailed API documentation',
  });
});

/**
 * Health check route
 * 
 * @description
 * Simple health check endpoint to verify server is running
 * 
 * @route GET /api/health
 * @access Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * 404 handler for unmatched routes
 * 
 * @description
 * Catches all routes that don't match any defined endpoint
 * 
 * @access Public
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      users: '/api/users',
      groups: '/api/groups',
      expenses: '/api/expenses',
      balances: '/api/balances',
      settlements: '/api/settlements',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
