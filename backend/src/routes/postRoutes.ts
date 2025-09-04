import express from "express";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";

const router = express.Router();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'authorImage' ? 'author-' : 'post-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
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
    const data = await Post.find();
    console.log(`✅ Posts found: ${data.length} items`);
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    console.log("✅ Post found:", post.title);
    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST new post
router.post("/", upload.single('image'), async (req, res) => {
  try {
    console.log("📝 Creating post with data:", req.body);
    
    let content;
    try {
      content = JSON.parse(req.body.content || '[]');
      // Ensure content is always an array
      if (typeof content === 'string') {
        content = [content];
      }
    } catch (e) {
      // If JSON.parse fails, treat as string and wrap in array
      content = [req.body.content || ''];
    }

    let tags;
    try {
      tags = JSON.parse(req.body.tags || '[]');
      // Ensure tags is always an array
      if (typeof tags === 'string') {
        tags = [tags];
      }
    } catch (e) {
      // If JSON.parse fails, treat as string and wrap in array
      tags = req.body.tags ? [req.body.tags] : [];
    }

    const postData = {
      title: req.body.title,
      image: req.file ? `/uploads/posts/${req.file.filename}` : '',
      date: req.body.date,
      category: req.body.category,
      author: req.body.author,
      authorImage: '', // Set as empty string since we removed author image upload
      content: content,
      tags: tags
    };
    
    const post = new Post(postData);
    await post.save();
    console.log("✅ Post created:", post.title);
    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT update post
router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    console.log("🔄 Updating post:", req.params.id);
    console.log("📝 Request body:", req.body);
    console.log("📁 Uploaded file:", req.file);

    const updateData = { ...req.body };

    // Parse JSON fields if they exist and ensure they're arrays
    if (updateData.content) {
      try {
        updateData.content = JSON.parse(updateData.content);
        // Ensure content is always an array
        if (typeof updateData.content === 'string') {
          updateData.content = [updateData.content];
        }
      } catch (e) {
        // If JSON.parse fails, treat as string and wrap in array
        updateData.content = [updateData.content];
        console.warn("⚠️ Could not parse content as JSON, treating as string");
      }
    }
    
    if (updateData.tags) {
      try {
        updateData.tags = JSON.parse(updateData.tags);
        // Ensure tags is always an array
        if (typeof updateData.tags === 'string') {
          updateData.tags = [updateData.tags];
        }
      } catch (e) {
        // If JSON.parse fails, treat as string and wrap in array
        updateData.tags = updateData.tags ? [updateData.tags] : [];
        console.warn("⚠️ Could not parse tags as JSON, treating as string");
      }
    }

    // If a new image was uploaded, update the image field
    if (req.file) {
      updateData.image = `/uploads/posts/${req.file.filename}`;
      console.log("📸 New image uploaded:", updateData.image);
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    console.log("✅ Post updated:", post.title);
    res.json(post);
  } catch (error) {
    console.error("❌ Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    console.log("✅ Post deleted:", post.title);
    res.json({ message: "Post deleted successfully", post });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
