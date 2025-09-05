// backend/src/config/mysql-database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  charset: string;
  timezone: string;
}

const config: DatabaseConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'website_tanijuu_mysql',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: '+07:00' // GMT+7 timezone
};

// Create connection pool for better performance
const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Set timezone on pool creation
pool.on('connection', function (connection) {
  connection.query("SET time_zone = '+07:00'");
  console.log('⏰ MySQL timezone set to GMT+7');
});

// Test connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    
    // Set timezone for this connection
    await connection.execute("SET time_zone = '+07:00'");
    
    // Simple connection test
    await connection.execute("SELECT 1");
    
    console.log('✅ MySQL connected successfully');
    console.log('⏰ Timezone set to GMT+7 (+07:00)');
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    return false;
  }
};

// Execute query helper
export const executeQuery = async (query: string, params?: any[]): Promise<any> => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution failed:', query, error);
    throw error;
  }
};

// Execute transaction helper
export const executeTransaction = async (queries: Array<{query: string, params?: any[]}>): Promise<any> => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default pool;
