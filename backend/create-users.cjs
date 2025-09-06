const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createUsersTable() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'website_tanijuu'
    });

    console.log('Creating users table...');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table created successfully!');

    // Create test users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await connection.execute(`
      INSERT IGNORE INTO users (username, email, password, role) VALUES 
      ('admin', 'admin@tanimaju.com', ?, 'admin'),
      ('user', 'user@tanimaju.com', ?, 'user')
    `, [adminPassword, userPassword]);

    console.log('Test users created successfully!');
    console.log('Admin credentials: admin@tanimaju.com / admin123');
    console.log('User credentials: user@tanimaju.com / user123');
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createUsersTable();
