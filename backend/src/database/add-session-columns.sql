-- Add session management columns to users table
-- This migration adds session_key and session_expired_at columns for session-based authentication

ALTER TABLE users 
ADD COLUMN session_key VARCHAR(255) NULL,
ADD COLUMN session_expired_at DATETIME NULL,
ADD INDEX idx_session_key (session_key);

-- Update schema version or add comment
ALTER TABLE users COMMENT = 'Users table with session management support';
