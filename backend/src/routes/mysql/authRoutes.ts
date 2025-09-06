// backend/src/routes/mysql/authRoutes.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../repositories/UserRepository.js';
import { generateToken, getExpirationTime } from '../../utils/jwt.js';
import { authenticateToken } from '../../middleware/auth.js';
import { LoginRequest, LoginResponse } from '../../models/mysql/User.js';

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember = false }: LoginRequest = req.body;

    // Validasi input
    if (!email || !password) {
      const response: LoginResponse = {
        success: false,
        message: 'Email and password are required'
      };
      return res.status(400).json(response);
    }

    // Cari user berdasarkan email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const response: LoginResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const response: LoginResponse = {
        success: false,
        message: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }, remember);

    // Update last login
    await UserRepository.updateLastLogin(user.id);

    // Set cookie
    const expirationDate = getExpirationTime(remember);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS di production
      sameSite: 'lax',
      expires: expirationDate,
      path: '/'
    });

    const response: LoginResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token // Juga kirim token di response untuk frontend
    };

    console.log(`✅ User logged in: ${user.email} (${user.role})`);
    res.json(response);

  } catch (error) {
    console.error('❌ Login error:', error);
    const response: LoginResponse = {
      success: false,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    console.log('✅ User logged out');
    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /auth/me - Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await UserRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /auth/verify-token - Verify if token is valid
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

export default router;
