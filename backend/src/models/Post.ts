import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: String,
  image: String,
  date: String,
  category: String,
  author: String,
  authorImage: String,
  content: [String],
  tags: [String]
});
export default mongoose.model("Post", PostSchema);