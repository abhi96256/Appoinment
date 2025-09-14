import express from 'express';
import models from '../models/index.js';
const { Service, Booking } = models;
import { authenticateToken } from '../middleware/auth.js';
import { validateBooking } from '../middleware/validation.js';
import { sendConfirmationEmail, sendCancellationEmail } from '../utils/email.js';
import { sendBookingConfirmationSMS, sendBookingCancellationSMS } from '../utils/sms.js';
import { generateTimeSlots, isSlotAvailable } from '../utils/slots.js';

const router = express.Router();

// Generate unique confirmation code
const generateConfirmationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST /api/book - Create new booking
router.post('/', validateBooking, async (req, res) => {
  try {
    const { serviceId, customerName, customerEmail, customerPhone, bookingDate, startTime, notes } = req.body;
    
    // Get service details
    const service = await Service.findByPk(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    // Calculate end time
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(start.getTime() + service.duration * 60000);
    const endTime = end.toTimeString().slice(0, 5);
    
    // Check if slot is still available
    const existingBookings = await Booking.findAll({
      where: {
        bookingDate,
        status: 'confirmed'
      },
      attributes: ['startTime', 'endTime']
    });
    
    if (!isSlotAvailable(existingBookings, bookingDate, startTime, endTime)) {
      return res.status(409).json({
        success: false,
        error: 'Selected time slot is no longer available'
      });
    }
    
    // Create booking
    const confirmationCode = generateConfirmationCode();
    const booking = await Booking.create({
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      startTime,
      endTime,
      notes,
      confirmationCode
    });
    
    // Load service details for email
    await booking.reload({
      include: [{ model: Service, as: 'service' }]
    });
    
    // Send confirmation email
    try {
      await sendConfirmationEmail(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }
    
    // Send confirmation SMS
    try {
      await sendBookingConfirmationSMS(booking);
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // Don't fail the booking if SMS fails
    }
    
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// GET /api/bookings - Get all bookings (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (date) whereClause.bookingDate = date;
    
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [{ model: Service, as: 'service' }],
      order: [['bookingDate', 'DESC'], ['startTime', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/customer/:email - Get bookings by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const bookings = await Booking.findAll({
      where: { customerEmail: email },
      include: [{ model: Service, as: 'service' }],
      order: [['bookingDate', 'DESC'], ['startTime', 'ASC']]
    });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer bookings'
    });
  }
});

// GET /api/bookings/:id - Get specific booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// POST /api/bookings/:id/cancel - Cancel booking (Admin only)
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }
    
    await booking.update({ status: 'cancelled' });
    
    // Send cancellation email
    try {
      await sendCancellationEmail(booking);
    } catch (emailError) {
      console.error('Cancellation email sending failed:', emailError);
      // Don't fail the cancellation if email fails
    }
    
    // Send cancellation SMS
    try {
      await sendBookingCancellationSMS(booking);
    } catch (smsError) {
      console.error('Cancellation SMS sending failed:', smsError);
      // Don't fail the cancellation if SMS fails
    }
    
    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
});

export default router;
