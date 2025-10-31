-- Migration: Add rating column to products table
-- Date: 2025-10-30
-- Description: Add rating field (FLOAT, default 0, range 0-5) to products table

USE website_tanijuu;

-- Add rating column
-- Note: This will fail if column already exists - that's okay
ALTER TABLE products 
ADD COLUMN rating FLOAT DEFAULT 0 
COMMENT 'Product rating (0-5 scale)';

-- Add check constraint to ensure rating is between 0 and 5
-- Note: MySQL 8.0.16+ required for CHECK constraints
-- This will fail if constraint already exists - that's okay
ALTER TABLE products 
ADD CONSTRAINT chk_rating_range 
CHECK (rating >= 0 AND rating <= 5);

-- Add index for faster rating queries
-- This will fail if index already exists - that's okay
CREATE INDEX idx_rating ON products(rating);

-- Update existing products to have 0 rating
UPDATE products SET rating = 0 WHERE rating IS NULL;

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    COLUMN_DEFAULT, 
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'website_tanijuu' 
  AND TABLE_NAME = 'products' 
  AND COLUMN_NAME = 'rating';
