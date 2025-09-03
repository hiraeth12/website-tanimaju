import express from "express";
import Post from "../models/Post.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// GET all
router.get("/", async (req, res) => {
  const data = await Post.find();
  res.json(data);
});

// POST new
// POST new
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "authorImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, date, category, author, content, tags } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files?.["image"]?.[0];
      const authorImageFile = files?.["authorImage"]?.[0];

      const post = new Post({
        title,
        image: imageFile
          ? `${req.protocol}://${req.get("host")}/uploads/posts/${imageFile.filename}`
          : null,
        authorImage: authorImageFile
          ? `${req.protocol}://${req.get("host")}/uploads/posts/${authorImageFile.filename}`
          : null,
        date,
        category,
        author,
        content,
        tags: tags ? JSON.parse(tags) : [],
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error("Error membuat data post:", error);
      res.status(500).json({ message: "Gagal membuat data post" });
    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Data Post tidak ditemukan" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching petani:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.put("/:id", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "authorImage", maxCount: 1 },
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, category, author, content, tags } = req.body;

    const updateData: any = {
      title,
      date,
      category,
      author,
      content,
      tags: tags ? JSON.parse(tags) : [],
    };

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.["image"]?.[0];
    const authorImageFile = files?.["authorImage"]?.[0];

    if (imageFile) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/posts/${imageFile.filename}`;
    }

    if (authorImageFile) {
      updateData.authorImage = `${req.protocol}://${req.get("host")}/uploads/posts/${authorImageFile.filename}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Data Post tidak ditemukan" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id); 

    if (!deleted) {
      return res.status(404).json({ message: "Data Post tidak ditemukan" });
    }

    res.json({ message: "Data Post berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});


export default router;
