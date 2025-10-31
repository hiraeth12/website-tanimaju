// backend/src/utils/session.ts
import crypto from 'crypto';

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  EXPIRATION_HOURS: 2, // Session expires after 2 hours
  KEY_LENGTH: 32 // Length of session key in bytes (will be 64 hex characters)
};

/**
 * Generate a unique session key using crypto.randomUUID
 * @returns A unique session key (UUID v4 format)
 */
export const generateSessionKey = (): string => {
  return crypto.randomUUID();
};

/**
 * Calculate session expiration time
 * @param hours Number of hours until expiration (default: 2 hours)
 * @returns Date object representing expiration time
 */
export const calculateSessionExpiration = (hours: number = SESSION_CONFIG.EXPIRATION_HOURS): Date => {
  const now = new Date();
  return new Date(now.getTime() + (hours * 60 * 60 * 1000));
};

/**
 * Check if a session has expired
 * @param expirationDate The expiration date to check
 * @returns True if session is expired, false otherwise
 */
export const isSessionExpired = (expirationDate: Date | null | undefined): boolean => {
  if (!expirationDate) {
    return true;
  }
  
  const now = new Date();
  const expiration = new Date(expirationDate);
  return now >= expiration;
};

/**
 * Get session key from authorization header or custom session header
 * @param authHeader Authorization header value
 * @param sessionHeader X-Session-Key header value
 * @returns Session key or null
 */
export const getSessionKeyFromHeaders = (
  authHeader: string | undefined,
  sessionHeader: string | undefined
): string | null => {
  // First, try to get from X-Session-Key header
  if (sessionHeader) {
    return sessionHeader.trim();
  }
  
  // Alternatively, check if it's in Authorization header with Bearer scheme
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Session') {
      return parts[1];
    }
  }
  
  return null;
};

/**
 * Format session expiration for response
 * @param expirationDate The expiration date
 * @returns ISO string representation of the date
 */
export const formatSessionExpiration = (expirationDate: Date): string => {
  return expirationDate.toISOString();
};

/**
 * Get time remaining until session expiration in minutes
 * @param expirationDate The expiration date
 * @returns Minutes remaining, or 0 if expired
 */
export const getSessionTimeRemaining = (expirationDate: Date | null | undefined): number => {
  if (!expirationDate) {
    return 0;
  }
  
  const now = new Date();
  const expiration = new Date(expirationDate);
  const diffMs = expiration.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 0;
  }
  
  return Math.floor(diffMs / (60 * 1000)); // Convert to minutes
};
