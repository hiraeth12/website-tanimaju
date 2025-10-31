// backend/run-session-migration.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'website_tanijuu',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    // Read migration file
    const migrationPath = path.join(__dirname, 'src', 'database', 'add-session-columns.sql');
    console.log('📂 Reading migration file:', migrationPath);
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);
      await connection.query(statement);
      console.log(`✅ Statement ${i + 1} executed successfully`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('📋 The following columns have been added to the users table:');
    console.log('   - session_key (VARCHAR 255, nullable)');
    console.log('   - session_expired_at (DATETIME, nullable)');
    console.log('   - Index on session_key');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️  Note: Columns may already exist. Check your database schema.');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration
runMigration().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
