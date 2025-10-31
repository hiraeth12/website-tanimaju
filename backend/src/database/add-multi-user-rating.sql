-- Migration: Create product_ratings table for multi-user ratings
-- Date: 2025-10-30
-- Description: Create a new table to store individual user ratings and calculate average

USE website_tanijuu;

-- Create product_ratings table to store individual ratings
CREATE TABLE IF NOT EXISTS product_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_identifier VARCHAR(255) NOT NULL,
    rating FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_rating_value CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (product_id, user_identifier),
    INDEX idx_product_id (product_id),
    INDEX idx_user_identifier (user_identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add columns to products table for rating statistics
ALTER TABLE products 
ADD COLUMN average_rating FLOAT DEFAULT 0 COMMENT 'Average rating from all users',
ADD COLUMN total_ratings INT DEFAULT 0 COMMENT 'Total number of ratings';

-- Create index for average_rating
CREATE INDEX idx_average_rating ON products(average_rating);

-- Migrate existing ratings to new system (if any exist)
-- This will create a single "admin" rating for products that already have ratings
INSERT INTO product_ratings (product_id, user_identifier, rating)
SELECT id, 'admin', rating
FROM products
WHERE rating > 0
ON DUPLICATE KEY UPDATE rating = VALUES(rating);

-- Update products table with calculated averages
UPDATE products p
SET 
    average_rating = (
        SELECT AVG(rating) 
        FROM product_ratings 
        WHERE product_id = p.id
    ),
    total_ratings = (
        SELECT COUNT(*) 
        FROM product_ratings 
        WHERE product_id = p.id
    )
WHERE EXISTS (
    SELECT 1 FROM product_ratings WHERE product_id = p.id
);

SELECT 'Multi-user rating system created successfully!' as Status;

-- Show table structure
DESCRIBE product_ratings;
DESCRIBE products;
