// backend/src/routes/mysql/postRoutes.ts
import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { PostRepository } from "../../repositories/PostRepository.js";
import { getCurrentDateGMT7 } from "../../utils/timezone.js";

const router = express.Router();

// === Multer config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/");
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const gmt7Time = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const timestamp = gmt7Time
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\..+/, "");
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${timestamp}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// === GET all posts ===
router.get("/", async (_req: Request, res: Response) => {
  try {
    const posts = await PostRepository.findAll();
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// === GET single post by ID ===
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await PostRepository.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// === CREATE post ===
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "authorImage", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const { title, date, category, author, content, tags } = req.body;

      if (!title || !author) {
        return res.status(400).json({ error: "Title and author are required" });
      }

      // Parse tags
      let parsedTags: string[] = [];
      try {
        if (typeof tags === "string") {
          if (tags.startsWith("[")) parsedTags = JSON.parse(tags);
          else
            parsedTags = tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
        }
      } catch {
        parsedTags = [];
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const postData = {
        title,
        image: files?.image?.[0]
          ? `/uploads/posts/${files.image[0].filename}`
          : null,
        authorImage: files?.authorImage?.[0]
          ? `/uploads/posts/${files.authorImage[0].filename}`
          : null,
        date: date || getCurrentDateGMT7(),
        category: category || "",
        author,
        content: content || "",
      };

      const postId = await PostRepository.create(postData, parsedTags);

      res.status(201).json({ id: postId, ...postData, tags: parsedTags });
    } catch (error) {
      console.error("❌ Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);

// === UPDATE post ===
// === UPDATE post ===
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "authorImage", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid post ID" });

      const existingPost = await PostRepository.findById(id);
      if (!existingPost)
        return res.status(404).json({ error: "Post not found" });

      const { title, date, category, author, content, tags } = req.body;

      // === ✅ Date formatting fix ===
      let formattedDate: string | undefined;
      if (date !== undefined) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          // Cek apakah kolom MySQL `DATE` atau `DATETIME`
          formattedDate = d.toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:mm:ss"
        }
      }

      let parsedTags: string[] = existingPost.tags || [];
      if (tags !== undefined) {
        try {
          if (typeof tags === "string") {
            parsedTags = tags.startsWith("[")
              ? JSON.parse(tags)
              : tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
          }
        } catch {
          parsedTags = existingPost.tags || [];
        }
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (formattedDate !== undefined) updateData.date = formattedDate; // ✅ pakai date yg sudah diformat
      if (category !== undefined) updateData.category = category;
      if (author !== undefined) updateData.author = author;
      if (content !== undefined) updateData.content = content;
      if (files?.image?.[0])
        updateData.image = `/uploads/posts/${files.image[0].filename}`;
      if (files?.authorImage?.[0])
        updateData.authorImage = `/uploads/posts/${files.authorImage[0].filename}`;

      await PostRepository.update(id, updateData, parsedTags);

      res.json({
        message: "Post updated successfully",
        id,
        ...updateData,
        tags: parsedTags,
      });
    } catch (error) {
      console.error("❌ Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

// === DELETE post ===
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid post ID" });

    const deleted = await PostRepository.delete(id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
