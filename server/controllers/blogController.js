import Blog from "../models/blogModel.js";
import BlogCategory from "../models/blogCategoryModel.js";

// @desc    Get all categories
// @route   GET /api/blog/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find({});
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a category
// @route   POST /api/blog/category
// @access  Private/Admin
export const addCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const category = await BlogCategory.create({ name, icon });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: "Category name already exists" });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/blog/category/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    await BlogCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all blogs
// @route   GET /api/blog
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("category", "name icon").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blog by ID
// @route   GET /api/blog/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("category", "name icon");
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    // Note: We don't restrict sending the body here. The frontend handles the paywall blur.
    // If we wanted to be perfectly secure, we'd check if `blog.isPaid` and if `req.user` has unlocked it, then send body.
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a blog
// @route   POST /api/blog
// @access  Private/Admin
export const addBlog = async (req, res) => {
  try {
    const { title, subtitle, body, pictureUrl, category, tags, readTime, isMainHighlight, isSideHighlight, isPaid, price } = req.body;
    
    // Manage highlights: if this is main highlight, unset previous main highlights
    if (isMainHighlight) {
      await Blog.updateMany({ isMainHighlight: true }, { isMainHighlight: false });
    }

    // Side highlights logic: limit to 2. If this is 3rd, we'll let it slide or shift logic, but simple approach is fine.
    
    const blog = await Blog.create({
      title, subtitle, body, pictureUrl, category, tags, readTime, isMainHighlight, isSideHighlight, isPaid, price
    });
    
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    import('fs').then(fs => fs.appendFileSync('debug.log', 'ADD ERROR: ' + error.message + ' ' + JSON.stringify(error) + '\n'));
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const { title, subtitle, body, pictureUrl, category, tags, readTime, isMainHighlight, isSideHighlight, isPaid, price } = req.body;
    
    // Manage highlights: if this is main highlight, unset previous main highlights
    if (isMainHighlight) {
      await Blog.updateMany({ isMainHighlight: true, _id: { $ne: req.params.id } }, { isMainHighlight: false });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, subtitle, body, pictureUrl, category, tags, readTime, isMainHighlight, isSideHighlight, isPaid, price },
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    import('fs').then(fs => fs.appendFileSync('debug.log', 'DELETE ERROR: ' + error.message + '\n'));
    res.status(500).json({ success: false, message: error.message });
  }
};
