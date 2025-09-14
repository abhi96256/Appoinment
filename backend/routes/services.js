import express from 'express';
import models from '../models/index.js';
const { Service } = models;
import { authenticateToken, generateToken } from '../middleware/auth.js';
import { validateService } from '../middleware/validation.js';

const router = express.Router();

// GET /api/services - List all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// GET /api/services/:id - Get specific service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service'
    });
  }
});

// POST /api/services - Create new service (Admin only)
router.post('/', authenticateToken, validateService, async (req, res) => {
  try {
    const { name, duration, price, description } = req.body;
    
    const service = await Service.create({
      name,
      duration,
      price,
      description
    });
    
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service'
    });
  }
});

// PUT /api/services/:id - Update service (Admin only)
router.put('/:id', authenticateToken, validateService, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price, description, isActive } = req.body;
    
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    await service.update({
      name,
      duration,
      price,
      description,
      isActive
    });
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update service'
    });
  }
});

// DELETE /api/services/:id - Delete service (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    // Soft delete by setting isActive to false
    await service.update({ isActive: false });
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete service'
    });
  }
});

export default router;
