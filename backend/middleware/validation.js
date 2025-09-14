import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateBooking = [
  body('serviceId').isInt({ min: 1 }).withMessage('Valid service ID required'),
  body('customerName').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('customerPhone').isMobilePhone().withMessage('Valid phone number required'),
  body('bookingDate').isISO8601().toDate().withMessage('Valid date required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
  handleValidationErrors
];

export const validateService = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be 15-480 minutes'),
  body('price').isDecimal({ decimal_digits: '0,2' }).withMessage('Valid price required'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  handleValidationErrors
];
