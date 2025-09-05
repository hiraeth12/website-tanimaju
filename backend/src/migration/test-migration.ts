// backend/src/migration/test-migration.ts
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import ProductMongo from '../models/Product.js';

// Test MongoDB connection
async function testMongoDB() {
  try {
    await mongoose.connect('mongodb://tanijuu_2425:TaniMaju12@127.0.0.1:27017/website_tanijuu?authSource=website_tanijuu');
    console.log('✅ MongoDB connected');
    
    const products = await ProductMongo.find({});
    console.log(`📦 Found ${products.length} products in MongoDB`);
    
    if (products.length > 0) {
      console.log('First product:', products[0]);
    }
    
    await mongoose.disconnect();
    return products.length;
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    return 0;
  }
}

// Test MySQL connection
async function testMySQL() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'website_tanijuu_mysql'
    });
    
    console.log('✅ MySQL connected');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`📦 Found ${rows[0].count} products in MySQL`);
    
    await connection.end();
    return rows[0].count;
  } catch (error) {
    console.error('❌ MySQL test failed:', error);
    return 0;
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing database connections...\n');
  
  const mongoCount = await testMongoDB();
  const mysqlCount = await testMySQL();
  
  console.log('\n📊 Summary:');
  console.log(`MongoDB Products: ${mongoCount}`);
  console.log(`MySQL Products: ${mysqlCount}`);
  
  if (mongoCount > 0 && mysqlCount === 0) {
    console.log('✅ Ready for migration!');
  } else if (mongoCount === 0) {
    console.log('⚠️  No data in MongoDB to migrate');
  } else if (mysqlCount > 0) {
    console.log('⚠️  MySQL already has data');
  }
}

runTests().catch(console.error);
