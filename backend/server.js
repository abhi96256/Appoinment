import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import models from './models/index.js';

// Import routes
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import availabilityRoutes from './routes/availability.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Appointment booking API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/avail', availabilityRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await models.sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    await models.sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
    // Add seed data if no services exist
    const serviceCount = await models.Service.count();
    if (serviceCount === 0) {
      await models.Service.bulkCreate([
        {
          name: 'Haircut',
          duration: 30,
          price: 25.00,
          description: 'Professional haircut and styling',
          isActive: true
        },
        {
          name: 'Hair Color',
          duration: 120,
          price: 80.00,
          description: 'Full hair coloring service',
          isActive: true
        },
        {
          name: 'Manicure',
          duration: 45,
          price: 35.00,
          description: 'Complete nail care and polish',
          isActive: true
        },
        {
          name: 'Facial Treatment',
          duration: 60,
          price: 65.00,
          description: 'Deep cleansing facial treatment',
          isActive: true
        },
        {
          name: 'Massage Therapy',
          duration: 90,
          price: 100.00,
          description: 'Relaxing full-body massage',
          isActive: true
        }
      ]);
      console.log('Seed data added successfully.');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await models.sequelize.close();
  process.exit(0);
});

startServer();
