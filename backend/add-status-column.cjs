const mysql = require('mysql2/promise');
require('dotenv').config();

async function addStatusColumn() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'website_tanijuu',
      port: process.env.MYSQL_PORT || 3306
    });

    console.log('Connected to MySQL database');

    // Check if status column exists
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM users LIKE 'status'"
    );

    if (columns.length === 0) {
      console.log('Adding status column...');
      
      // Add status column
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved'
      `);
      
      // Update existing users to approved status
      await connection.execute(`
        UPDATE users SET status = 'approved' WHERE status IS NULL
      `);
      
      // Add indexes
      try {
        await connection.execute(`
          CREATE INDEX idx_users_status ON users(status)
        `);
      } catch (e) {
        console.log('Index might already exist:', e.message);
      }
      
      console.log('✅ Status column added successfully');
    } else {
      console.log('✅ Status column already exists');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addStatusColumn();
