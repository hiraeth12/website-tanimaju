import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupMultiUserRating() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'website_tanijuu',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL database');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'src', 'database', 'add-multi-user-rating.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration: add-multi-user-rating.sql\n');

    // Execute migration
    const [results] = await connection.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Multi-user rating system is now active');
    console.log('   - product_ratings table created');
    console.log('   - average_rating column added to products');
    console.log('   - total_ratings column added to products\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.errno === 1050) {
      console.log('ℹ️  Tables already exist, skipping...');
    } else {
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

setupMultiUserRating();
