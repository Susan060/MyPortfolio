const Tag = require("../models/tag.model");
const slugify = require("slugify");

// @desc    Get all tags (optionally filtered by type)
// @route   GET /api/tags?type=blog | type=case-study
// @access  Public
const getAllTags = async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = { $in: [req.query.type] };
    const tags = await Tag.find(query).sort({ name: 1 });
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single tag by slug
// @route   GET /api/tags/:slug
// @access  Public
const getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    res.json({ success: true, data: tag });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a tag
// @route   POST /api/tags
// @access  Admin
const createTag = async (req, res) => {
  try {
    const { name, type } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Tag.findOne({ slug });
    if (exists) {
      return res.status(400).json({ success: false, message: "Tag already exists" });
    }

    const tag = await Tag.create({ name, slug, type: type || "blog" });
    res.status(201).json({ success: true, data: tag });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Admin
const updateTag = async (req, res) => {
  try {
    const { name, type } = req.body;

    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }

    if (name && name !== tag.name) {
      const newSlug = slugify(name, { lower: true, strict: true });
      const slugExists = await Tag.findOne({
        slug: newSlug,
        _id: { $ne: tag._id },
      });
      if (slugExists) {
        return res.status(400).json({ success: false, message: "Tag with this name already exists" });
      }
      tag.slug = newSlug;
      tag.name = name;
    }

    if (type) tag.type = type;

    const updated = await tag.save();
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Admin
const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    res.json({ success: true, message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
};