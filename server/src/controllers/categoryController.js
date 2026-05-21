const Category = require("../models/category.model");
const slugify = require("slugify");

// @desc    Get all categories (optionally filtered by type)
// @route   GET /api/categories?type=blog | type=case-study
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = { $in: [req.query.type] };
    const categories = await Category.find(query).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
     console.log("Body received:", req.body);
    const { name, description, type } = req.body;
    console.log("Type value:", type, "Type of type:", typeof type);
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      type: type || "blog",
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (name && name !== category.name) {
      const newSlug = slugify(name, { lower: true, strict: true });
      const slugExists = await Category.findOne({
        slug: newSlug,
        _id: { $ne: category._id },
      });
      if (slugExists) {
        return res.status(400).json({ success: false, message: "Category with this name already exists" });
      }
      category.slug = newSlug;
      category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (type) category.type = type;

    const updated = await category.save();
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
}; 