// Update schema untuk mendukung data migrasi
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'website_tanijuu_mysql',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: '+00:00'
});

async function updateSchema() {
  try {
    console.log('🔄 Updating schema for migration data...');
    
    // Update bibit table - add columns one by one with error handling
    try {
      await pool.execute(`ALTER TABLE bibit ADD COLUMN sumber VARCHAR(255) AFTER jenis`);
      console.log('✅ Added sumber column to bibit');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ sumber column already exists in bibit');
    }
    
    try {
      await pool.execute(`ALTER TABLE bibit ADD COLUMN nama_penyedia VARCHAR(255) AFTER sumber`);
      console.log('✅ Added nama_penyedia column to bibit');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ nama_penyedia column already exists in bibit');
    }
    
    try {
      await pool.execute(`ALTER TABLE bibit ADD COLUMN tanggal_pemberian DATE AFTER nama_penyedia`);
      console.log('✅ Added tanggal_pemberian column to bibit');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ tanggal_pemberian column already exists in bibit');
    }
    
    // Update tanaman table - change and add columns with error handling
    try {
      await pool.execute(`ALTER TABLE tanaman CHANGE COLUMN pupuk jenis VARCHAR(255)`);
      console.log('✅ Changed pupuk to jenis in tanaman');
    } catch (err: any) {
      if (err.code !== 'ER_BAD_FIELD_ERROR') throw err;
      console.log('ℹ️ pupuk column does not exist or already changed');
    }
    
    try {
      await pool.execute(`ALTER TABLE tanaman ADD COLUMN perawatan TEXT AFTER deskripsi`);
      console.log('✅ Added perawatan column to tanaman');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ perawatan column already exists in tanaman');
    }
    
    // Update panen table - drop generated column first, then modify
    try {
      await pool.execute(`ALTER TABLE panen DROP COLUMN total_nilai`);
      console.log('✅ Dropped total_nilai generated column from panen');
    } catch (err: any) {
      if (err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') throw err;
      console.log('ℹ️ total_nilai column does not exist');
    }
    
    try {
      await pool.execute(`ALTER TABLE panen CHANGE COLUMN harga_per_satuan harga_per_kg DECIMAL(10,2)`);
      console.log('✅ Changed harga_per_satuan to harga_per_kg in panen');
    } catch (err: any) {
      if (err.code !== 'ER_BAD_FIELD_ERROR') throw err;
      console.log('ℹ️ harga_per_satuan column does not exist or already changed');
    }
    
    try {
      await pool.execute(`ALTER TABLE panen ADD COLUMN status_penjualan VARCHAR(100) AFTER harga_per_kg`);
      console.log('✅ Added status_penjualan column to panen');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ status_penjualan column already exists in panen');
    }
    
    try {
      await pool.execute(`ALTER TABLE panen ADD COLUMN nama_pembeli VARCHAR(255) AFTER status_penjualan`);
      console.log('✅ Added nama_pembeli column to panen');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      console.log('ℹ️ nama_pembeli column already exists in panen');
    }
    
    console.log('✅ Schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema update failed:', error);
    process.exit(1);
  }
}

updateSchema();
