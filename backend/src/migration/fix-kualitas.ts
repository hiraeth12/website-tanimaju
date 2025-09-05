// Fix kualitas column
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

async function fixKualitas() {
  try {
    await pool.execute('ALTER TABLE panen MODIFY COLUMN kualitas VARCHAR(50) DEFAULT "Baik"');
    console.log('✅ Fixed kualitas column to VARCHAR(50)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing kualitas:', error);
    process.exit(1);
  }
}

fixKualitas();
