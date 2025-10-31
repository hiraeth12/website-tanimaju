// backend/src/utils/sessionCleanup.ts
import { UserRepository } from '../repositories/UserRepository.js';

/**
 * Cleanup job configuration
 */
export const CLEANUP_CONFIG = {
  INTERVAL_MINUTES: 30, // Run cleanup every 30 minutes
  ENABLED: process.env.SESSION_CLEANUP_ENABLED !== 'false' // Can be disabled via env variable
};

/**
 * Cleanup expired sessions from database
 */
export const cleanupExpiredSessions = async (): Promise<number> => {
  try {
    const clearedCount = await UserRepository.clearExpiredSessions();
    
    if (clearedCount > 0) {
      console.log(`🧹 Session cleanup: Cleared ${clearedCount} expired session(s)`);
    }
    
    return clearedCount;
  } catch (error) {
    console.error('❌ Session cleanup error:', error);
    return 0;
  }
};

/**
 * Start automatic session cleanup job
 * This will run periodically to clean up expired sessions
 */
export const startSessionCleanupJob = (): NodeJS.Timeout | null => {
  if (!CLEANUP_CONFIG.ENABLED) {
    console.log('⚠️  Session cleanup job is disabled');
    return null;
  }

  console.log(`🚀 Starting session cleanup job (interval: ${CLEANUP_CONFIG.INTERVAL_MINUTES} minutes)`);
  
  // Run immediately on start
  cleanupExpiredSessions();
  
  // Then run periodically
  const intervalMs = CLEANUP_CONFIG.INTERVAL_MINUTES * 60 * 1000;
  const intervalId = setInterval(() => {
    cleanupExpiredSessions();
  }, intervalMs);

  return intervalId;
};

/**
 * Stop the cleanup job
 */
export const stopSessionCleanupJob = (intervalId: NodeJS.Timeout | null): void => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('🛑 Session cleanup job stopped');
  }
};
