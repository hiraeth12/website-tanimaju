// backend/src/migration/simple-migration.ts
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import ProductMongo from '../models/Product.js';
import PetaniMongo from '../models/Petani.js';
import PostMongo from '../models/Post.js';

async function migrateData() {
  let mongoConnection, mysqlConnection;
  
  try {
    // Connect to databases
    console.log('🔄 Connecting to databases...');
    await mongoose.connect('mongodb://tanijuu_2425:TaniMaju12@127.0.0.1:27017/website_tanijuu?authSource=website_tanijuu');
    console.log('✅ MongoDB connected');
    
    mysqlConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'website_tanijuu_mysql'
    });
    console.log('✅ MySQL connected');

    // Migrate Products
    console.log('\n🔄 Migrating Products...');
    const products = await ProductMongo.find({});
    console.log(`Found ${products.length} products`);
    
    let productCount = 0;
    for (const product of products) {
      try {
        await mysqlConnection.execute(
          `INSERT INTO products (title, price, imageSrc, description, info, whatsappNumber) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            product.title || '',
            parseFloat(product.price?.toString() || '0') || 0,
            product.imageSrc || null,
            product.description || null,
            product.info || null,
            product.whatsappNumber || null
          ]
        );
        productCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate product: ${product.title}`, error.message);
      }
    }
    console.log(`✅ Migrated ${productCount} products`);

    // Migrate Petani
    console.log('\n🔄 Migrating Petani...');
    const petani = await PetaniMongo.find({});
    console.log(`Found ${petani.length} petani`);
    
    let petaniCount = 0;
    for (const p of petani) {
      try {
        await mysqlConnection.execute(
          `INSERT INTO petani (nama, alamat, nomorKontak, foto) 
           VALUES (?, ?, ?, ?)`,
          [
            p.nama || '',
            p.alamat || null,
            p.nomorKontak || null,
            p.foto || null
          ]
        );
        petaniCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate petani: ${p.nama}`, error.message);
      }
    }
    console.log(`✅ Migrated ${petaniCount} petani`);

    // Migrate Posts
    console.log('\n🔄 Migrating Posts...');
    const posts = await PostMongo.find({});
    console.log(`Found ${posts.length} posts`);
    
    let postCount = 0;
    for (const post of posts) {
      try {
        // Generate slug
        const slug = post.title?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
          .substring(0, 255) || 'untitled';

        // Convert content array to text
        let content = '';
        if (Array.isArray(post.content)) {
          content = post.content.join('\n\n');
        } else if (typeof post.content === 'string') {
          content = post.content;
        }

        // Insert post
        const [result] = await mysqlConnection.execute(
          `INSERT INTO posts (title, slug, image, date, category, author, authorImage, content) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.title || '',
            slug,
            post.image || null,
            post.date || new Date().toISOString().split('T')[0],
            post.category || null,
            post.author || null,
            post.authorImage || null,
            content
          ]
        );

        const postId = result.insertId;

        // Insert tags
        if (Array.isArray(post.tags) && post.tags.length > 0) {
          for (const tagName of post.tags) {
            if (tagName && tagName.trim()) {
              // Insert tag if not exists
              await mysqlConnection.execute(
                'INSERT IGNORE INTO tags (name) VALUES (?)',
                [tagName.trim()]
              );
              
              // Link post to tag
              await mysqlConnection.execute(
                `INSERT IGNORE INTO post_tags (post_id, tag_id)
                 SELECT ?, id FROM tags WHERE name = ?`,
                [postId, tagName.trim()]
              );
            }
          }
        }

        postCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate post: ${post.title}`, error.message);
      }
    }
    console.log(`✅ Migrated ${postCount} posts`);

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const [productRows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM products');
    const [petaniRows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM petani');
    const [postRows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM posts');
    const [tagRows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM tags');

    console.log('📊 Migration Results:');
    console.log(`Products: ${(productRows as any)[0].count} records`);
    console.log(`Petani: ${(petaniRows as any)[0].count} records`);
    console.log(`Posts: ${(postRows as any)[0].count} records`);
    console.log(`Tags: ${(tagRows as any)[0].count} records`);

    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close connections
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📦 MongoDB disconnected');
    }
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('📦 MySQL disconnected');
    }
  }
}

migrateData();
