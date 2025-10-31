// backend/src/routes/mysql/authRoutes.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../repositories/UserRepository.js';
import { generateToken, getExpirationTime } from '../../utils/jwt.js';
import { generateSessionKey, calculateSessionExpiration, formatSessionExpiration } from '../../utils/session.js';
import { authenticateToken } from '../../middleware/auth.js';
import { LoginRequest, LoginResponse } from '../../models/mysql/User.js';

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // Validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nama, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with pending status
    const userId = await UserRepository.create({
      username: nama,
      email,
      password: hashedPassword,
      role: 'user',
      status: 'pending',
      is_active: true
    });

    console.log(`✅ New user registered: ${email} (ID: ${userId})`);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.',
      userId
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /auth/pending-users - Get all pending users (Admin only)
router.get('/pending-users', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const users = await UserRepository.findByStatus(['pending', 'approved', 'rejected']);
    res.json(users);

  } catch (error) {
    console.error('❌ Get pending users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /auth/users - Get all users (Admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const users = await UserRepository.findAll();
    res.json(users);

  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /auth/update-user-status - Update user status (Admin only)
router.put('/update-user-status', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        error: 'User ID and status are required'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "approved" or "rejected"'
      });
    }

    await UserRepository.updateStatus(userId, status);

    console.log(`✅ User status updated: ID ${userId} -> ${status}`);
    res.json({
      success: true,
      message: `User status updated to ${status}`
    });

  } catch (error) {
    console.error('❌ Update user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /auth/reset-password - Reset user password (Admin only)
router.put('/reset-password', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'User ID and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Convert userId to number if it's a string
    const userIdNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    if (isNaN(userIdNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const updateResult = await UserRepository.updatePassword(userIdNumber, hashedPassword);

    if (!updateResult) {
      throw new Error('Failed to update password in database');
    }

    console.log(`✅ Password reset successful for user ID: ${userIdNumber}`);
    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

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

    // Generate session key and expiration (2 hours)
    const sessionKey = generateSessionKey();
    const sessionExpiration = calculateSessionExpiration(2); // 2 hours

    // Update user's session in database
    await UserRepository.updateSession(user.id, sessionKey, sessionExpiration);

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
      token, // Juga kirim token di response untuk frontend
      sessionKey, // Send session key to frontend
      sessionExpiresAt: formatSessionExpiration(sessionExpiration)
    };

    console.log(`✅ User logged in: ${user.email} (${user.role}), Session expires at: ${sessionExpiration.toISOString()}`);
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
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Clear session from database if user is authenticated
    if (req.user?.id) {
      await UserRepository.clearSession(req.user.id);
      console.log(`✅ User session cleared: ${req.user.email}`);
    }

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

// POST /auth/refresh-session - Refresh user's session (extend expiration)
router.post('/refresh-session', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Generate new session key and expiration
    const sessionKey = generateSessionKey();
    const sessionExpiration = calculateSessionExpiration(2); // 2 hours

    // Update user's session in database
    const updated = await UserRepository.updateSession(req.user.id, sessionKey, sessionExpiration);

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to refresh session'
      });
    }

    console.log(`✅ Session refreshed for user: ${req.user.email}`);
    res.json({
      success: true,
      message: 'Session refreshed successfully',
      sessionKey,
      sessionExpiresAt: formatSessionExpiration(sessionExpiration)
    });

  } catch (error) {
    console.error('❌ Refresh session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /auth/session-status - Check current session status
router.get('/session-status', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.id) {
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

    const hasSession = !!user.session_key && !!user.session_expired_at;
    let sessionInfo: any = {
      hasSession,
      userId: user.id,
      email: user.email
    };

    if (hasSession && user.session_expired_at) {
      const now = new Date();
      const expiration = new Date(user.session_expired_at);
      const isExpired = now >= expiration;
      const minutesRemaining = Math.max(0, Math.floor((expiration.getTime() - now.getTime()) / (60 * 1000)));

      sessionInfo = {
        ...sessionInfo,
        sessionExpiresAt: formatSessionExpiration(expiration),
        isExpired,
        minutesRemaining
      };
    }

    res.json({
      success: true,
      session: sessionInfo
    });

  } catch (error) {
    console.error('❌ Session status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /auth/cleanup-sessions - Clean up expired sessions (Admin only)
router.post('/cleanup-sessions', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const clearedCount = await UserRepository.clearExpiredSessions();
    
    console.log(`✅ Cleaned up ${clearedCount} expired sessions`);
    res.json({
      success: true,
      message: `Cleaned up ${clearedCount} expired sessions`,
      clearedCount
    });

  } catch (error) {
    console.error('❌ Cleanup sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
