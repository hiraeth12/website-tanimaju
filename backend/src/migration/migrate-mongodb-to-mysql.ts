// backend/src/migration/migrate-mongodb-to-mysql.ts
import mongoose from 'mongoose';
import { testConnection, executeQuery, executeTransaction } from '../config/mysql-database.js';

// Import MongoDB models
import ProductMongo from '../models/Product.js';
import PetaniMongo from '../models/Petani.js';
import PostMongo from '../models/Post.js';

interface MigrationStats {
  products: { migrated: number; failed: number };
  petani: { migrated: number; failed: number };
  posts: { migrated: number; failed: number };
  tags: { migrated: number; failed: number };
}

class DataMigration {
  private stats: MigrationStats = {
    products: { migrated: 0, failed: 0 },
    petani: { migrated: 0, failed: 0 },
    posts: { migrated: 0, failed: 0 },
    tags: { migrated: 0, failed: 0 }
  };

  async connectMongoDB(): Promise<void> {
    try {
      await mongoose.connect('mongodb://tanijuu_2425:TaniMaju12@127.0.0.1:27017/website_tanijuu?authSource=website_tanijuu');
      console.log('✅ MongoDB connected for migration');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async migrateProducts(): Promise<void> {
    console.log('\n🔄 Migrating Products...');
    
    try {
      const mongoProducts = await ProductMongo.find({});
      console.log(`Found ${mongoProducts.length} products in MongoDB`);

      for (const product of mongoProducts) {
        try {
          const query = `
            INSERT INTO products (title, price, imageSrc, description, info, whatsappNumber)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          await executeQuery(query, [
            product.title || '',
            parseFloat(product.price?.toString() || '0') || 0,
            product.imageSrc || null,
            product.description || null,
            product.info || null,
            product.whatsappNumber || null
          ]);
          
          this.stats.products.migrated++;
        } catch (error) {
          console.error(`❌ Failed to migrate product: ${product.title}`, error);
          this.stats.products.failed++;
        }
      }
      
      console.log(`✅ Products migration completed: ${this.stats.products.migrated} success, ${this.stats.products.failed} failed`);
    } catch (error) {
      console.error('❌ Products migration failed:', error);
      throw error;
    }
  }

  async migratePetani(): Promise<void> {
    console.log('\n🔄 Migrating Petani...');
    
    try {
      const mongoPetani = await PetaniMongo.find({});
      console.log(`Found ${mongoPetani.length} petani in MongoDB`);

      for (const petani of mongoPetani) {
        try {
          const query = `
            INSERT INTO petani (nama, alamat, nomorKontak, foto)
            VALUES (?, ?, ?, ?)
          `;
          
          await executeQuery(query, [
            petani.nama || '',
            petani.alamat || null,
            petani.nomorKontak || null,
            petani.foto || null
          ]);
          
          this.stats.petani.migrated++;
        } catch (error) {
          console.error(`❌ Failed to migrate petani: ${petani.nama}`, error);
          this.stats.petani.failed++;
        }
      }
      
      console.log(`✅ Petani migration completed: ${this.stats.petani.migrated} success, ${this.stats.petani.failed} failed`);
    } catch (error) {
      console.error('❌ Petani migration failed:', error);
      throw error;
    }
  }

  async migratePosts(): Promise<void> {
    console.log('\n🔄 Migrating Posts...');
    
    try {
      const mongoPosts = await PostMongo.find({});
      console.log(`Found ${mongoPosts.length} posts in MongoDB`);

      for (const post of mongoPosts) {
        try {
          // Generate slug from title
          const slug = this.generateSlug(post.title || 'untitled');
          
          // Convert content array to text
          let content = '';
          if (Array.isArray(post.content)) {
            content = post.content.join('\n\n');
          } else if (typeof post.content === 'string') {
            content = post.content;
          }

          // Insert post
          const postQuery = `
            INSERT INTO posts (title, slug, image, date, category, author, authorImage, content)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          const result = await executeQuery(postQuery, [
            post.title || '',
            slug,
            post.image || null,
            post.date || new Date().toISOString().split('T')[0],
            post.category || null,
            post.author || null,
            post.authorImage || null,
            content
          ]);

          const postId = result.insertId;

          // Migrate tags
          if (Array.isArray(post.tags) && post.tags.length > 0) {
            await this.migratePostTags(postId, post.tags);
          }
          
          this.stats.posts.migrated++;
        } catch (error) {
          console.error(`❌ Failed to migrate post: ${post.title}`, error);
          this.stats.posts.failed++;
        }
      }
      
      console.log(`✅ Posts migration completed: ${this.stats.posts.migrated} success, ${this.stats.posts.failed} failed`);
    } catch (error) {
      console.error('❌ Posts migration failed:', error);
      throw error;
    }
  }

  private async migratePostTags(postId: number, tags: string[]): Promise<void> {
    const queries = [];
    
    // Insert unique tags
    for (const tagName of tags) {
      if (tagName && tagName.trim()) {
        queries.push({
          query: 'INSERT IGNORE INTO tags (name) VALUES (?)',
          params: [tagName.trim()]
        });
      }
    }
    
    if (queries.length > 0) {
      await executeTransaction(queries);
    }
    
    // Create post-tag relationships
    const relationQueries = [];
    for (const tagName of tags) {
      if (tagName && tagName.trim()) {
        relationQueries.push({
          query: `
            INSERT IGNORE INTO post_tags (post_id, tag_id)
            SELECT ?, id FROM tags WHERE name = ?
          `,
          params: [postId, tagName.trim()]
        });
      }
    }
    
    if (relationQueries.length > 0) {
      await executeTransaction(relationQueries);
      this.stats.tags.migrated += relationQueries.length;
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 255); // MySQL VARCHAR limit
  }

  async verifyMigration(): Promise<void> {
    console.log('\n🔍 Verifying migration...');
    
    try {
      const productCount = await executeQuery('SELECT COUNT(*) as count FROM products');
      const petaniCount = await executeQuery('SELECT COUNT(*) as count FROM petani');
      const postCount = await executeQuery('SELECT COUNT(*) as count FROM posts');
      const tagCount = await executeQuery('SELECT COUNT(*) as count FROM tags');
      
      console.log(`✅ Verification results:`);
      console.log(`   - Products: ${productCount[0].count} records`);
      console.log(`   - Petani: ${petaniCount[0].count} records`);
      console.log(`   - Posts: ${postCount[0].count} records`);
      console.log(`   - Tags: ${tagCount[0].count} records`);
    } catch (error) {
      console.error('❌ Verification failed:', error);
    }
  }

  printStats(): void {
    console.log('\n📊 Migration Statistics:');
    console.log('==========================');
    console.log(`Products: ${this.stats.products.migrated} migrated, ${this.stats.products.failed} failed`);
    console.log(`Petani: ${this.stats.petani.migrated} migrated, ${this.stats.petani.failed} failed`);
    console.log(`Posts: ${this.stats.posts.migrated} migrated, ${this.stats.posts.failed} failed`);
    console.log(`Tags: ${this.stats.tags.migrated} migrated, ${this.stats.tags.failed} failed`);
    console.log('==========================');
  }

  async runMigration(): Promise<void> {
    console.log('🚀 Starting MongoDB to MySQL Migration...');
    
    try {
      // Test MySQL connection
      const mysqlConnected = await testConnection();
      if (!mysqlConnected) {
        throw new Error('MySQL connection failed');
      }

      // Connect to MongoDB
      await this.connectMongoDB();

      // Run migrations
      await this.migrateProducts();
      await this.migratePetani();
      await this.migratePosts();
      
      // Verify migration
      await this.verifyMigration();
      
      // Print statistics
      this.printStats();
      
      console.log('\n✅ Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      // Close connections
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('📦 MongoDB connection closed');
      }
    }
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new DataMigration();
  migration.runMigration()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export default DataMigration;
