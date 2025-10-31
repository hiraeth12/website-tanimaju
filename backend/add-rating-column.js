import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function addRatingColumn() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'website_tanijuu',
    });

    console.log('✅ Connected to MySQL database');

    // Add rating column
    try {
      await connection.query('ALTER TABLE products ADD COLUMN rating FLOAT DEFAULT 0');
      console.log('✅ Rating column added successfully');
    } catch (error) {
      if (error.errno === 1060) {
        console.log('ℹ️  Rating column already exists');
      } else {
        throw error;
      }
    }

    // Add index
    try {
      await connection.query('CREATE INDEX idx_rating ON products(rating)');
      console.log('✅ Index created successfully');
    } catch (error) {
      if (error.errno === 1061) {
        console.log('ℹ️  Index already exists');
      } else {
        console.log('⚠️  Index creation warning:', error.message);
      }
    }

    // Set default values
    await connection.query('UPDATE products SET rating = 0 WHERE rating IS NULL');
    console.log('✅ Default values set');

    // Verify
    const [rows] = await connection.query('DESCRIBE products');
    console.log('\n📊 Current products table structure:');
    console.table(rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

addRatingColumn();
