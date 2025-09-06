-- Update schema untuk panen dengan struktur yang benar

-- Drop tabel panen lama jika ada
DROP TABLE IF EXISTS panen;

-- Buat ulang tabel panen dengan struktur yang benar
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

-- Update tabel bibit agar sesuai dengan struktur yang digunakan
ALTER TABLE bibit 
ADD COLUMN IF NOT EXISTS tanaman VARCHAR(255),
ADD COLUMN IF NOT EXISTS sumber VARCHAR(255),
ADD COLUMN IF NOT EXISTS namaPenyedia VARCHAR(255),
ADD COLUMN IF NOT EXISTS tanggalPemberian DATE;

-- Update tabel tanaman agar sesuai dengan struktur yang digunakan
ALTER TABLE tanaman 
ADD COLUMN IF NOT EXISTS namaTanaman VARCHAR(255);

-- Insert beberapa data sample untuk testing
INSERT IGNORE INTO petani (nama, alamat, nomorKontak) VALUES 
('Ahmad Farmer', 'Jl. Pertanian No. 1', '081234567890'),
('Budi Tani', 'Jl. Sawah No. 2', '081234567891'),
('Citra Kebun', 'Jl. Ladang No. 3', '081234567892');

INSERT IGNORE INTO tanaman (namaTanaman, pupuk) VALUES 
('Padi', 'Urea'),
('Jagung', 'NPK'),
('Tomat', 'Kompos'),
('Cabai', 'Organik Cair');

INSERT IGNORE INTO bibit (tanaman, sumber, namaPenyedia, tanggalPemberian) VALUES 
('Padi', 'Toko Bibit Sejahtera', 'PT. Bibit Nusantara', '2024-01-15'),
('Jagung', 'Koperasi Tani', 'CV. Sumber Bibit', '2024-01-20'),
('Tomat', 'Toko Tanaman Hijau', 'UD. Bibit Berkah', '2024-02-01'),
('Cabai', 'Supplier Lokal', 'Toko Bibit Mandiri', '2024-02-10');

-- Insert sample data panen
INSERT IGNORE INTO panen (petani_id, tanaman_id, lahan, bibit_id, pupuk, jumlahHasilPanen, tanggalPanen, statusPenjualan, namaPembeli) VALUES 
(1, 1, 'Sukabirus', 1, 'Urea', 150.50, '2024-03-15', 'Terjual', 'Toko Sembako Maju'),
(2, 2, 'Sukapura', 2, 'NPK', 120.75, '2024-03-20', 'Belum Terjual', NULL),
(3, 3, 'Cikoneng', 3, 'Kompos', 85.25, '2024-03-25', 'Terjual', 'Pasar Tradisional'),
(1, 4, 'Cibiru', 4, 'Organik Cair', 95.00, '2024-04-01', 'Belum Terjual', NULL);
