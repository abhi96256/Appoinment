import express from 'express';
import models from '../models/index.js';
const { Service, Booking } = models;
import { generateTimeSlots, isSlotAvailable } from '../utils/slots.js';

const router = express.Router();

// GET /api/avail - Get available slots for a service on a specific date
router.get('/', async (req, res) => {
  try {
    const { service_id, date } = req.query;
    
    if (!service_id || !date) {
      return res.status(400).json({
        success: false,
        error: 'Service ID and date are required'
      });
    }
    
    // Validate date format
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    // Get service details
    const service = await Service.findByPk(service_id);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    // Get existing bookings for the date
    const existingBookings = await Booking.findAll({
      where: {
        bookingDate: date,
        status: 'confirmed'
      },
      attributes: ['startTime', 'endTime']
    });
    
    // Generate all possible slots
    const allSlots = generateTimeSlots(service.duration, date);
    
    // Filter available slots
    const availableSlots = allSlots.filter(slot => 
      isSlotAvailable(existingBookings, date, slot.startTime, slot.endTime)
    );
    
    res.json({
      success: true,
      data: {
        service: {
          id: service.id,
          name: service.name,
          duration: service.duration,
          price: service.price
        },
        date,
        availableSlots
      }
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch availability'
    });
  }
});

export default router;
