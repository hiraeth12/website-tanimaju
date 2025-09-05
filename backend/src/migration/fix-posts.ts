// Fix posts migration
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import PostMongo from '../models/Post.js';

async function fixPostsMigration() {
  let mongoConnection, mysqlConnection;
  
  try {
    console.log('🔄 Fixing Posts migration...');
    
    await mongoose.connect('mongodb://tanijuu_2425:TaniMaju12@127.0.0.1:27017/website_tanijuu?authSource=website_tanijuu');
    mysqlConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'website_tanijuu_mysql'
    });

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

        // Fix date format: convert "Nov 13, 2024" to "2024-11-13"
        let dateFormatted = '2024-11-13'; // Default date
        if (post.date) {
          try {
            const parsedDate = new Date(post.date);
            if (!isNaN(parsedDate.getTime())) {
              dateFormatted = parsedDate.toISOString().split('T')[0];
            }
          } catch (e) {
            console.log(`Using default date for post: ${post.title}`);
          }
        }

        // Insert post
        const [result] = await mysqlConnection.execute(
          `INSERT INTO posts (title, slug, image, date, category, author, authorImage, content) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.title || '',
            slug,
            post.image || null,
            dateFormatted,
            post.category || null,
            post.author || null,
            post.authorImage || null,
            content
          ]
        );

        const postId = (result as any).insertId;

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
        console.log(`✅ Migrated post: ${post.title}`);
      } catch (error) {
        console.error(`❌ Failed to migrate post: ${post.title}`, error);
      }
    }

    console.log(`\n✅ Successfully migrated ${postCount} posts`);

    // Verify
    const [postRows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM posts');
    const [tagRows] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM tags');
    console.log(`Posts in MySQL: ${(postRows as any)[0].count}`);
    console.log(`Tags in MySQL: ${(tagRows as any)[0].count}`);

  } catch (error) {
    console.error('❌ Posts migration failed:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

fixPostsMigration();
