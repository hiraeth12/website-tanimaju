import express from "express";
import Post from "../models/Post";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const data = await Post.find();
  res.json(data);
});

// POST new
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
});

export default router;
