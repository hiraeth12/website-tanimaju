// migration to add missing columns to panen table
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function addPanenColumns() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'website_tanijuu_mysql',
    timezone: '+07:00'
  });

  try {
    console.log('� Checking current table structure...');
    
    // Check current table structure
    const [rows] = await connection.execute('DESCRIBE panen');
    console.log('📋 Current table structure:');
    console.table(rows);

    const existingColumns = (rows as any[]).map(row => row.Field);
    console.log('🔍 Existing columns:', existingColumns);

    // Add columns that don't exist
    const columnsToAdd = [
      { name: 'petani_id', type: 'INT' },
      { name: 'lahan', type: 'VARCHAR(255)' },
      { name: 'bibit_id', type: 'INT' },
      { name: 'tanaman_id', type: 'INT' },
      { name: 'pupuk', type: 'VARCHAR(255)' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name)) {
        console.log(`➕ Adding column: ${col.name} ${col.type}`);
        await connection.execute(`ALTER TABLE panen ADD COLUMN ${col.name} ${col.type}`);
      } else {
        console.log(`✅ Column ${col.name} already exists`);
      }
    }

    console.log('✅ Migration completed successfully');

    // Check the final table structure
    const [finalRows] = await connection.execute('DESCRIBE panen');
    console.log('🔍 Final table structure:');
    console.table(finalRows);

  } catch (error: any) {
    console.error('❌ Error in migration:', error.message);
  } finally {
    await connection.end();
  }
}

addPanenColumns();
