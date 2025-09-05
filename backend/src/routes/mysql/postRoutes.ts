// backend/src/routes/mysql/postRoutes.ts
import express from "express";
import multer from "multer";
import path from "path";
import { PostRepository } from "../../repositories/PostRepository.js";
import { adaptMySQLToMongo, adaptMongoToMySQL } from "../../utils/dataAdapter.js";
import { getCurrentDateGMT7, formatTimestampGMT7 } from "../../utils/timezone.js";

const router = express.Router();

// Konfigurasi multer untuk upload file dengan timezone GMT+7
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts/');
  },
  filename: (req, file, cb) => {
    // Use GMT+7 timestamp for filename
    const now = new Date();
    const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const timestamp = gmt7Time.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'authorImage' ? 'author-' : 'post-';
    cb(null, prefix + timestamp + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await PostRepository.findAll();
    console.log(`✅ Posts found: ${posts.length} items`);
    const adaptedData = adaptMySQLToMongo(posts);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET single post by ID
router.get("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    const post = await PostRepository.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    console.log(`✅ Post found: ${post.title}`);
    const adaptedData = adaptMySQLToMongo(post);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST create new post
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const { title, date, category, author, content, tags } = req.body;
    
    // Validate required fields
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    // Parse content and tags
    let parsedContent = '';
    let parsedTags: string[] = [];
    
    try {
      if (typeof content === 'string') {
        if (content.startsWith('[') || content.startsWith('{')) {
          const contentArray = JSON.parse(content);
          parsedContent = Array.isArray(contentArray) ? contentArray.join('\n\n') : contentArray;
        } else {
          parsedContent = content;
        }
      } else if (Array.isArray(content)) {
        parsedContent = content.join('\n\n');
      }
    } catch (error) {
      console.log('Content parsing fallback:', error);
      parsedContent = typeof content === 'string' ? content : '';
    }

    try {
      if (typeof tags === 'string') {
        if (tags.startsWith('[')) {
          parsedTags = JSON.parse(tags);
        } else {
          parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (error) {
      console.log('Tags parsing fallback:', error);
      parsedTags = [];
    }

    const postData = {
      title,
      image: req.file ? `/uploads/posts/${req.file.filename}` : null,
      date: date || getCurrentDateGMT7(),
      category: category || '',
      author,
      authorImage: '', // Bisa ditambahkan jika diperlukan
      content: parsedContent
    };

    const postId = await PostRepository.create(postData, parsedTags);
    
    console.log(`✅ Post created with ID: ${postId}`);
    res.status(201).json({ 
      id: postId, 
      message: "Post created successfully",
      ...postData,
      tags: parsedTags
    });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT update post
router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    // Check if post exists
    const existingPost = await PostRepository.findById(id);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { title, date, category, author, content, tags } = req.body;
    
    // Parse content and tags (same logic as create)
    let parsedContent = existingPost.content;
    let parsedTags: string[] = [];
    
    if (content !== undefined) {
      try {
        if (typeof content === 'string') {
          if (content.startsWith('[') || content.startsWith('{')) {
            const contentArray = JSON.parse(content);
            parsedContent = Array.isArray(contentArray) ? contentArray.join('\n\n') : contentArray;
          } else {
            parsedContent = content;
          }
        } else if (Array.isArray(content)) {
          parsedContent = content.join('\n\n');
        }
      } catch (error) {
        console.log('Content parsing fallback:', error);
        parsedContent = typeof content === 'string' ? content : existingPost.content;
      }
    }

    if (tags !== undefined) {
      try {
        if (typeof tags === 'string') {
          if (tags.startsWith('[')) {
            parsedTags = JSON.parse(tags);
          } else {
            parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
          }
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      } catch (error) {
        console.log('Tags parsing fallback:', error);
        parsedTags = existingPost.tags || [];
      }
    } else {
      parsedTags = existingPost.tags || [];
    }

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (category !== undefined) updateData.category = category;
    if (author !== undefined) updateData.author = author;
    if (content !== undefined) updateData.content = parsedContent;
    if (req.file) updateData.image = `/uploads/posts/${req.file.filename}`;

    await PostRepository.update(id, updateData, parsedTags);
    
    console.log(`✅ Post updated: ${id}`);
    res.json({ 
      message: "Post updated successfully",
      id,
      ...updateData,
      tags: parsedTags
    });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE post
router.delete("/:id", async (req, res) => {
  try {
    const id = adaptMongoToMySQL(req.params.id);

    const deleted = await PostRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    console.log(`✅ Post deleted: ${id}`);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// GET search posts
router.get("/search/:term", async (req, res) => {
  try {
    const { term } = req.params;
    const { category } = req.query;
    
    const posts = await PostRepository.search(term, category as string);
    
    console.log(`✅ Search results: ${posts.length} posts found for "${term}"`);
    const adaptedData = adaptMySQLToMongo(posts);
    res.json(adaptedData);
  } catch (error) {
    console.error("❌ Error searching posts:", error);
    res.status(500).json({ error: "Failed to search posts" });
  }
});

export default router;
