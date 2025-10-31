// Migration script: Drop unused rating column from products table
import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function dropRatingColumn() {
  let connection;
  
  try {
    // Create connection
    connection = await createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'website_tanijuu',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL database');

    // Read SQL file
    const sqlFile = join(__dirname, 'src', 'database', 'drop-rating-column.sql');
    const sql = readFileSync(sqlFile, 'utf8');

    // Execute migration
    await connection.query(sql);

    console.log('✅ Successfully dropped rating column from products table');
    console.log('📊 The system now uses:');
    console.log('   - average_rating (calculated from product_ratings)');
    console.log('   - total_ratings (count from product_ratings)');

  } catch (error) {
    if (error.message.includes("check that column/key exists")) {
      console.log('ℹ️  Column "rating" does not exist - already removed or never existed');
      console.log('✅ Database is already in correct state');
      console.log('📊 The system uses:');
      console.log('   - average_rating (calculated from product_ratings)');
      console.log('   - total_ratings (count from product_ratings)');
    } else {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

dropRatingColumn();
