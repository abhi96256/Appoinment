import express from 'express';
import models from '../models/index.js';
const { Service, Booking, Review } = models;
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware for review creation
const validateReview = [
  body('serviceId').isInt().withMessage('Service ID must be an integer'),
  body('bookingId').isInt().withMessage('Booking ID must be an integer'),
  body('customerName').trim().isLength({ min: 1, max: 100 }).withMessage('Customer name must be between 1 and 100 characters'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters')
];

// POST /api/reviews - Create new review
router.post('/', validateReview, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { serviceId, bookingId, customerName, customerEmail, rating, comment } = req.body;

    // Verify that the booking exists and belongs to the customer
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        serviceId: serviceId,
        customerEmail: customerEmail,
        status: 'completed'
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found or not eligible for review'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({
      where: { bookingId: bookingId }
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: 'Review already exists for this booking'
      });
    }

    // Create review
    const review = await Review.create({
      serviceId,
      bookingId,
      customerName,
      customerEmail,
      rating,
      comment,
      isVerified: true
    });

    // Load service details
    await review.reload({
      include: [{ model: Service, as: 'service' }]
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create review'
    });
  }
});

// GET /api/reviews/service/:serviceId - Get reviews for a specific service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      serviceId: serviceId,
      isApproved: true
    };
    
    if (rating) {
      whereClause.rating = rating;
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [{ model: Service, as: 'service' }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate average rating
    const allReviews = await Review.findAll({
      where: { serviceId: serviceId, isApproved: true },
      attributes: ['rating']
    });

    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0;

    const ratingDistribution = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    };

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: count,
        ratingDistribution
      },
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// GET /api/reviews - Get all reviews (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, serviceId, rating, isApproved } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (serviceId) whereClause.serviceId = serviceId;
    if (rating) whereClause.rating = rating;
    if (isApproved !== undefined) whereClause.isApproved = isApproved === 'true';

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        { model: Service, as: 'service' },
        { model: Booking, as: 'booking' }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// PUT /api/reviews/:id/approve - Approve/Disapprove review (Admin only)
router.put('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    await review.update({ isApproved });

    res.json({
      success: true,
      data: review,
      message: `Review ${isApproved ? 'approved' : 'disapproved'} successfully`
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review'
    });
  }
});

// DELETE /api/reviews/:id - Delete review (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review'
    });
  }
});

export default router;

