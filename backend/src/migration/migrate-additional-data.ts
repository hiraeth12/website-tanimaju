// Migration script untuk data bibit, tanaman, panen
import fs from 'fs';
import path from 'path';
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

interface BibitData {
  tanaman: string;
  sumber: string;
  namaPenyedia: string;
  tanggalPemberian: string;
}

interface TanamanData {
  namaTanaman: string;
  pupuk: string;
}

interface PanenData {
  id: number;
  date: string;
  farmer: string;
  field: string;
  seedProvider: string;
  plant: string;
  fertilizer: string;
  amount: string;
  salesStatus: string;
  buyerName: string;
}

async function migrateBibit() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'bibit.json');
    const bibitData: BibitData[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`🔄 Migrating ${bibitData.length} bibit records...`);
    
    for (const bibit of bibitData) {
      await pool.execute(
        `INSERT INTO bibit (nama, jenis, sumber, nama_penyedia, tanggal_pemberian) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          bibit.tanaman,
          'Bibit',
          bibit.sumber,
          bibit.namaPenyedia,
          new Date(bibit.tanggalPemberian)
        ]
      );
    }
    
    console.log(`✅ Migrated ${bibitData.length} bibit records`);
  } catch (error) {
    console.error('❌ Error migrating bibit:', error);
  }
}

async function migrateTanaman() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'tanaman.json');
    const tanamanData: TanamanData[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`🔄 Migrating ${tanamanData.length} tanaman records...`);
    
    for (const tanaman of tanamanData) {
      await pool.execute(
        `INSERT INTO tanaman (nama, jenis, deskripsi, perawatan) 
         VALUES (?, ?, ?, ?)`,
        [
          tanaman.namaTanaman,
          'Pertanian',
          `Tanaman ${tanaman.namaTanaman}`,
          `Menggunakan pupuk ${tanaman.pupuk}`
        ]
      );
    }
    
    console.log(`✅ Migrated ${tanamanData.length} tanaman records`);
  } catch (error) {
    console.error('❌ Error migrating tanaman:', error);
  }
}

async function migratePanen() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'panen.json');
    const panenData: PanenData[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`🔄 Migrating ${panenData.length} panen records...`);
    
    for (const panen of panenData) {
      // Parse date dari format "Nov 23, 2024 10:03:22"
      const parseDate = (dateStr: string): Date => {
        try {
          return new Date(dateStr);
        } catch {
          return new Date();
        }
      };
      
      // Parse amount (remove comma and convert to number)
      const parseAmount = (amountStr: string): number => {
        return parseInt(amountStr.replace(/,/g, '')) || 0;
      };
      
      // Get petani_id based on farmer name
      const [petaniRows] = await pool.execute(
        'SELECT id FROM petani WHERE nama = ? LIMIT 1',
        [panen.farmer]
      );
      
      // Get tanaman_id based on plant name  
      const [tanamanRows] = await pool.execute(
        'SELECT id FROM tanaman WHERE nama = ? LIMIT 1',
        [panen.plant]
      );
      
      const petaniId = (petaniRows as any[]).length > 0 ? (petaniRows as any[])[0].id : 1;
      const tanamanId = (tanamanRows as any[]).length > 0 ? (tanamanRows as any[])[0].id : 1;
      
      await pool.execute(
        `INSERT INTO panen (petani_id, tanaman_id, jumlah, tanggal_panen, kualitas, harga_per_kg, status_penjualan, nama_pembeli) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          petaniId,
          tanamanId,
          parseAmount(panen.amount),
          parseDate(panen.date),
          'Baik',
          0, // Default price
          panen.salesStatus,
          panen.buyerName
        ]
      );
    }
    
    console.log(`✅ Migrated ${panenData.length} panen records`);
  } catch (error) {
    console.error('❌ Error migrating panen:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting additional data migration...');
    
    await migrateBibit();
    await migrateTanaman();
    await migratePanen();
    
    console.log('✅ Additional migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
