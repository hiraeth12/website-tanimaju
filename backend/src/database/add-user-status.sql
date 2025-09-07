-- Add status column to users table for user approval system
ALTER TABLE users 
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved';

-- Update existing users to approved status
UPDATE users SET status = 'approved' WHERE status IS NULL;

-- Add index for better query performance
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email_status ON users(email, status);
