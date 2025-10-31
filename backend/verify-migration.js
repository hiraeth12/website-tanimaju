// backend/verify-migration.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function verifyMigration() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'website_tanijuu'
    });

    console.log('✅ Connected to database');
    
    const [rows] = await connection.query('DESCRIBE users');
    
    console.log('\n📋 Users table schema:');
    console.table(rows);
    
    // Check for session columns
    const hasSessionKey = rows.some(row => row.Field === 'session_key');
    const hasSessionExpired = rows.some(row => row.Field === 'session_expired_at');
    
    console.log('\n🔍 Session Management Columns:');
    console.log(hasSessionKey ? '✅ session_key column exists' : '❌ session_key column missing');
    console.log(hasSessionExpired ? '✅ session_expired_at column exists' : '❌ session_expired_at column missing');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

verifyMigration();
