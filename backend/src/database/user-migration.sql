-- Migration untuk membuat tabel user
-- File: backend/src/database/user-migration.sql

USE website_tanijuu_mysql;

-- Buat tabel user
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Insert user admin default (password: admin123)
-- Hash bcrypt untuk password 'admin123' dengan salt rounds 10
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@tanimaju.com', '$2b$10$Pm.vayqtBAZNgdynI0Cnce1jvD5pkS6KxaLnE3M3t3Ypzyh/x98b.', 'admin'),
('testuser', 'user@tanimaju.com', '$2b$10$8ctJCJD/1bySceNK.mWKM.zKaLIk7lXE/hkbx4cCSYRunderjweO6', 'user')
ON DUPLICATE KEY UPDATE 
    username = VALUES(username),
    password = VALUES(password),
    role = VALUES(role);

-- Jika ingin mengubah password admin, jalankan query ini (ganti dengan hash baru):
-- UPDATE users SET password = '$2b$10$new_hash_here' WHERE email = 'admin@tanimaju.com';
