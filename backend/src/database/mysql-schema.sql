-- MySQL Schema untuk Website Tanimaju
-- Migrasi dari MongoDB ke MySQL

-- Database creation
CREATE DATABASE IF NOT EXISTS website_tanijuu_mysql;
USE website_tanijuu_mysql;

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    imageSrc VARCHAR(500),
    description TEXT,
    info TEXT,
    whatsappNumber VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_price (price)
);

-- Petani Table  
CREATE TABLE petani (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT,
    nomorKontak VARCHAR(20),
    foto VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nama (nama)
);

-- Posts Table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    image VARCHAR(500),
    date DATE,
    category VARCHAR(100),
    author VARCHAR(100),
    authorImage VARCHAR(500),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_category (category),
    INDEX idx_author (author),
    INDEX idx_date (date)
);

-- Tags Table (untuk normalisasi tags)
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post_Tags Junction Table (Many-to-Many relationship)
CREATE TABLE post_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_post_tag (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_tag_id (tag_id)
);

-- Bibit Table
CREATE TABLE bibit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanaman VARCHAR(255),
    sumber VARCHAR(255),
    namaPenyedia VARCHAR(255) NOT NULL,
    tanggalPemberian DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nama_penyedia (namaPenyedia)
);

-- Tanaman Table
CREATE TABLE tanaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    namaTanaman VARCHAR(255) NOT NULL,
    pupuk VARCHAR(255),
    musim_tanam VARCHAR(100),
    waktu_panen VARCHAR(100),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nama_tanaman (namaTanaman)
);

-- Panen Table
CREATE TABLE panen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    petani_id INT,
    tanaman_id INT,
    lahan VARCHAR(255),
    bibit_id INT,
    pupuk VARCHAR(255),
    jumlahHasilPanen DECIMAL(10,2),
    tanggalPanen DATE,
    statusPenjualan ENUM('Terjual', 'Belum Terjual') DEFAULT 'Belum Terjual',
    namaPembeli VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (petani_id) REFERENCES petani(id) ON DELETE SET NULL,
    FOREIGN KEY (tanaman_id) REFERENCES tanaman(id) ON DELETE SET NULL,
    FOREIGN KEY (bibit_id) REFERENCES bibit(id) ON DELETE SET NULL,
    INDEX idx_petani_id (petani_id),
    INDEX idx_tanaman_id (tanaman_id),
    INDEX idx_bibit_id (bibit_id),
    INDEX idx_tanggal_panen (tanggalPanen)
);
