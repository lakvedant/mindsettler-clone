import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: "BookOpen"
  }
}, { timestamps: true });

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
export default BlogCategory;
