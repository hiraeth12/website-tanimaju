USE website_tanijuu;

ALTER TABLE products ADD COLUMN rating FLOAT DEFAULT 0;

CREATE INDEX idx_rating ON products(rating);

UPDATE products SET rating = 0 WHERE rating IS NULL;

SELECT 'Rating column added successfully!' as Status;
