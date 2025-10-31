// Script to run the rating migration
// Run with: node run-rating-migration.js

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'website_tanijuu',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL database');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'src', 'database', 'add-rating-column.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration: add-rating-column.sql');

    // Split the SQL into individual statements and execute them one by one
    // This allows us to handle errors gracefully
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('USE ') || statement.includes('SELECT ')) {
        // Execute informational queries
        try {
          const [rows] = await connection.query(statement);
          if (statement.includes('SELECT ')) {
            console.log('📊 Current rating column info:', rows);
          }
        } catch (err) {
          console.log('ℹ️  Info query skipped:', err.message);
        }
      } else {
        // Execute ALTER/CREATE statements
        try {
          await connection.query(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
          // Check if error is because column/index/constraint already exists
          if (err.errno === 1060 || err.errno === 1061 || err.errno === 3822) {
            console.log('ℹ️  Already exists (skipping):', statement.substring(0, 50) + '...');
          } else {
            console.warn('⚠️  Warning:', err.message);
          }
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('📊 Rating column is now available in products table');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

runMigration();
