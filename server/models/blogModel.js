import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  pictureUrl: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogCategory",
    required: true
  },
  sourceName: {
    type: String,
    default: "Mindsettler Editorial",
  },
  tags: {
    type: [String],
    default: []
  },
  readTime: {
    type: String,
    default: "5 min read"
  },
  isMainHighlight: {
    type: Boolean,
    default: false
  },
  isSideHighlight: {
    type: Boolean,
    default: false
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
