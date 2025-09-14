import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Simple admin login (in production, use proper user management)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple hardcoded admin check (in production, use database)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const token = generateToken({ 
      id: 1, 
      email: adminEmail, 
      role: 'admin' 
    });
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: 1,
          email: adminEmail,
          role: 'admin'
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const jwt = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_12345';
    const decoded = jwt.default.verify(token, secret);
    
    res.json({
      success: true,
      data: {
        user: decoded
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router;
