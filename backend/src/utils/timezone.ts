// backend/src/utils/timezone.ts
export const TIMEZONE_OFFSET = 7; // GMT+7
export const TIMEZONE_NAME = 'Asia/Jakarta';

/**
 * Get current time in GMT+7 timezone
 * @returns ISO string adjusted to GMT+7
 */
export function getCurrentTimeGMT7(): string {
  const now = new Date();
  
  // Create date in GMT+7 (add 7 hours to UTC)
  const gmt7Time = new Date(now.getTime() + (TIMEZONE_OFFSET * 60 * 60 * 1000));
  
  return gmt7Time.toISOString();
}

/**
 * Get current date in GMT+7 timezone (YYYY-MM-DD format)
 * @returns Date string in YYYY-MM-DD format for GMT+7
 */
export function getCurrentDateGMT7(): string {
  return getCurrentTimeGMT7().split('T')[0];
}

/**
 * Format timestamp to GMT+7 for MySQL
 * @param date Date object or ISO string
 * @returns MySQL TIMESTAMP format in GMT+7
 */
export function formatTimestampGMT7(date?: Date | string): string {
  let targetDate: Date;
  
  if (!date) {
    targetDate = new Date();
  } else if (typeof date === 'string') {
    targetDate = new Date(date);
  } else {
    targetDate = date;
  }
  
  // Convert to GMT+7
  const gmt7Time = new Date(targetDate.getTime() + (TIMEZONE_OFFSET * 60 * 60 * 1000));
  
  // Format as MySQL TIMESTAMP: YYYY-MM-DD HH:MM:SS
  return gmt7Time.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Convert UTC timestamp from database to GMT+7 for display
 * @param utcTimestamp UTC timestamp from database
 * @returns GMT+7 formatted time
 */
export function convertUTCToGMT7(utcTimestamp: string | Date): string {
  const utcDate = new Date(utcTimestamp);
  const gmt7Date = new Date(utcDate.getTime() + (TIMEZONE_OFFSET * 60 * 60 * 1000));
  
  return gmt7Date.toISOString();
}

/**
 * Format date for Indonesian locale display
 * @param date Date object or ISO string
 * @returns Formatted date string in Indonesian format
 */
export function formatDateIndonesian(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  return targetDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE_NAME
  });
}

/**
 * Get timezone info for logging
 */
export function getTimezoneInfo(): string {
  return `GMT+${TIMEZONE_OFFSET} (${TIMEZONE_NAME})`;
}
