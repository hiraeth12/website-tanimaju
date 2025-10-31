// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, getTokenFromHeader } from '../utils/jwt.js';
import { getSessionKeyFromHeaders } from '../utils/session.js';
import { UserRepository } from '../repositories/UserRepository.js';

// Extend Express Request type untuk menambahkan user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Cek token dari Authorization header
    const authHeader = req.headers.authorization;
    let token = getTokenFromHeader(authHeader);
    
    // Jika tidak ada di header, cek di cookies
    if (!token && req.cookies?.authToken) {
      token = req.cookies.authToken;
    }
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
      return;
    }

    // Cek apakah user masih ada dan aktif
    const user = await UserRepository.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
      return;
    }

    // Attach user info ke request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

// Middleware khusus untuk admin
export const requireAdmin = requireRole(['admin']);

// Middleware untuk optional auth (tidak wajib login)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token = getTokenFromHeader(authHeader);
    
    if (!token && req.cookies?.authToken) {
      token = req.cookies.authToken;
    }
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await UserRepository.findById(decoded.userId);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Jika error, lanjutkan tanpa user (optional auth)
    next();
  }
};

/**
 * Middleware to validate session key
 * This checks if the provided session key is valid and not expired
 * If expired, it automatically clears the session and returns 401
 */
export const validateSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get session key from headers
    const authHeader = req.headers.authorization;
    const sessionHeader = req.headers['x-session-key'] as string | undefined;
    const sessionKey = getSessionKeyFromHeaders(authHeader, sessionHeader);
    
    if (!sessionKey) {
      res.status(401).json({ 
        success: false, 
        message: 'Session key required' 
      });
      return;
    }

    // Validate session in database
    const validation = await UserRepository.validateSession(sessionKey);
    
    if (!validation.valid) {
      if (validation.expired) {
        res.status(401).json({ 
          success: false, 
          message: 'Session expired. Please login again.',
          expired: true
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid session key' 
        });
      }
      return;
    }

    // Attach user info to request
    const user = validation.user!;
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('❌ Session validation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Session validation error' 
    });
  }
};

/**
 * Combined middleware: Check JWT first, then session key
 * This provides backward compatibility with existing JWT-based auth
 * while also supporting new session-based auth
 */
export const authenticateWithSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // First, try JWT authentication
    const authHeader = req.headers.authorization;
    let token = getTokenFromHeader(authHeader);
    
    if (!token && req.cookies?.authToken) {
      token = req.cookies.authToken;
    }
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await UserRepository.findById(decoded.userId);
        if (user) {
          // Also validate session if user is found
          if (user.session_key && user.session_expired_at) {
            const now = new Date();
            const expiration = new Date(user.session_expired_at);
            
            if (now >= expiration) {
              // Session expired - clear it
              await UserRepository.clearSession(user.id);
              res.status(401).json({ 
                success: false, 
                message: 'Session expired. Please login again.',
                expired: true
              });
              return;
            }
          }
          
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role
          };
          next();
          return;
        }
      }
    }

    // If JWT fails, try session key
    const sessionHeader = req.headers['x-session-key'] as string | undefined;
    const sessionKey = getSessionKeyFromHeaders(authHeader, sessionHeader);
    
    if (sessionKey) {
      const validation = await UserRepository.validateSession(sessionKey);
      
      if (validation.valid) {
        const user = validation.user!;
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };
        next();
        return;
      }
      
      if (validation.expired) {
        res.status(401).json({ 
          success: false, 
          message: 'Session expired. Please login again.',
          expired: true
        });
        return;
      }
    }

    // Neither JWT nor session key is valid
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};
