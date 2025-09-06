// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, getTokenFromHeader } from '../utils/jwt.js';
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
    console.error('Authentication middleware error:', error);
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
