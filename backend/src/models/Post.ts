import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  authorImage: { type: String, required: true },
  content: { type: [String], required: true },
  tags: { type: [String], required: true },
});
export default mongoose.model("Post", PostSchema);
