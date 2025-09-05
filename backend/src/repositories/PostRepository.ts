// backend/src/repositories/PostRepository.ts
import { executeQuery, executeTransaction } from '../config/mysql-database.js';
import { Post, PostWithTags, Tag, PostTag } from '../models/mysql/interfaces.js';

export class PostRepository {
  
  // Get all posts with tags
  static async findAll(): Promise<PostWithTags[]> {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    
    const rows = await executeQuery(query);
    return rows.map((row: any) => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : []
    }));
  }

  // Get post by ID with tags
  static async findById(id: number): Promise<PostWithTags | null> {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    
    const rows = await executeQuery(query, [id]);
    if (rows.length === 0) return null;
    
    const post = rows[0];
    return {
      ...post,
      tags: post.tags ? post.tags.split(',') : []
    };
  }

  // Create new post with tags
  static async create(postData: Post, tags: string[] = []): Promise<number> {
    const queries = [];
    
    // Generate unique slug
    const slug = await this.generateUniqueSlug(postData.title);
    
    // Insert post
    const postQuery = `
      INSERT INTO posts (title, slug, image, date, category, author, authorImage, content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    queries.push({
      query: postQuery,
      params: [
        postData.title,
        slug,
        postData.image,
        postData.date,
        postData.category,
        postData.author,
        postData.authorImage,
        postData.content
      ]
    });

    const results = await executeTransaction(queries);
    const postId = results[0].insertId;

    // Add tags if provided
    if (tags.length > 0) {
      await this.addTagsToPost(postId, tags);
    }

    return postId;
  }

  // Update post with tags
  static async update(id: number, postData: Partial<Post>, tags: string[] = []): Promise<boolean> {
    const queries = [];
    
    // Build update query dynamically
    const fields = [];
    const values = [];
    
    if (postData.title) {
      fields.push('title = ?');
      values.push(postData.title);
      
      // Update slug if title changes - use unique slug generator
      fields.push('slug = ?');
      const uniqueSlug = await this.generateUniqueSlug(postData.title);
      values.push(uniqueSlug);
    }
    
    if (postData.image !== undefined) {
      fields.push('image = ?');
      values.push(postData.image);
    }
    
    if (postData.date) {
      fields.push('date = ?');
      values.push(postData.date);
    }
    
    if (postData.category) {
      fields.push('category = ?');
      values.push(postData.category);
    }
    
    if (postData.author) {
      fields.push('author = ?');
      values.push(postData.author);
    }
    
    if (postData.authorImage !== undefined) {
      fields.push('authorImage = ?');
      values.push(postData.authorImage);
    }
    
    if (postData.content !== undefined) {
      fields.push('content = ?');
      values.push(postData.content);
    }

    if (fields.length > 0) {
      const updateQuery = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      queries.push({ query: updateQuery, params: values });
    }

    // Update tags
    queries.push({
      query: 'DELETE FROM post_tags WHERE post_id = ?',
      params: [id]
    });

    if (queries.length > 0) {
      await executeTransaction(queries);
    }

    // Add new tags
    if (tags.length > 0) {
      await this.addTagsToPost(id, tags);
    }

    return true;
  }

  // Delete post
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM posts WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // Helper method to add tags to post
  private static async addTagsToPost(postId: number, tags: string[]): Promise<void> {
    const queries = [];
    
    for (const tagName of tags) {
      // Insert tag if not exists
      queries.push({
        query: 'INSERT IGNORE INTO tags (name) VALUES (?)',
        params: [tagName.trim()]
      });
    }
    
    await executeTransaction(queries);
    
    // Get tag IDs and create relationships
    const tagQueries = [];
    for (const tagName of tags) {
      tagQueries.push({
        query: `
          INSERT INTO post_tags (post_id, tag_id)
          SELECT ?, id FROM tags WHERE name = ?
        `,
        params: [postId, tagName.trim()]
      });
    }
    
    await executeTransaction(tagQueries);
  }

  // Generate unique slug from title
  private static async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if base slug exists
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Check if slug exists in database
  private static async slugExists(slug: string): Promise<boolean> {
    const query = 'SELECT COUNT(*) as count FROM posts WHERE slug = ?';
    const rows = await executeQuery(query, [slug]);
    return (rows as any)[0].count > 0;
  }

  // Generate slug from title (deprecated - use generateUniqueSlug)
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Search posts
  static async search(searchTerm: string, category?: string): Promise<PostWithTags[]> {
    let query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE (p.title LIKE ? OR p.content LIKE ?)
    `;
    
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];
    
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    
    query += ' GROUP BY p.id ORDER BY p.created_at DESC';
    
    const rows = await executeQuery(query, params);
    return rows.map((row: any) => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : []
    }));
  }
}
