const CaseStudy = require("../models/casestudy.model");
const slugify = require("slugify");
const Category = require("../models/category.model");
const Tag = require("../models/tag.model");

// @desc    Get all published case studies (public)
// @route   GET /api/case-studies
// @access  Public
const getAllCaseStudies = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10, search } = req.query;

    const query = { status: "published" };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      } else {
        return res.json({ success: true, total: 0, page: 1, pages: 0, data: [] });
      }
    }

    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      } else {
        return res.json({ success: true, total: 0, page: 1, pages: 0, data: [] });
      }
    }

    if (search) query.title = { $regex: search, $options: "i" };

    const total = await CaseStudy.countDocuments(query);
    const caseStudies = await CaseStudy.find(query)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: caseStudies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all case studies for admin (any status)
// @route   GET /api/case-studies/admin/all
// @access  Admin
const getAdminCaseStudies = async (req, res) => {
  try {
    const { status, category, tag, page = 1, limit = 10, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await CaseStudy.countDocuments(query);
    const caseStudies = await CaseStudy.find(query)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: caseStudies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single case study by slug (public)
// @route   GET /api/case-studies/:slug
// @access  Public
const getCaseStudyBySlug = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({
      slug: req.params.slug,
      status: "published",
    })
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name");

    if (!caseStudy) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }

    res.json({ success: true, data: caseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single case study by ID (admin)
// @route   GET /api/case-studies/id/:id
// @access  Admin
const getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name");

    if (!caseStudy) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }

    res.json({ success: true, data: caseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a case study
// @route   POST /api/case-studies
// @access  Admin
const createCaseStudy = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      categories,
      keywords,
      tags,
      clientName,
      clientLogo,
      industry,
      projectLinks,
      servicesProvided,
      challenge,
      solution,
      results,
      testimonial,
      metrics,
      description,
      featuredImage,
      images,
      status,
      seoScore,
    } = req.body;

    const slug = customSlug
      ? slugify(customSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    const slugExists = await CaseStudy.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: "A case study with this slug already exists",
      });
    }

    if (status === "published" && !featuredImage?.url) {
      return res.status(400).json({
        success: false,
        message: "Featured image is required to publish a case study",
      });
    }

    const caseStudy = await CaseStudy.create({
      title,
      slug,
      author: req.user._id,
      categories,
      keywords,
      tags,
      clientName,
      clientLogo,
      industry,
      projectLinks,
      servicesProvided,
      challenge,
      solution,
      results,
      testimonial,
      metrics,
      description,
      featuredImage,
      images,
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : null,
      seoScore: seoScore || 0,
    });

    res.status(201).json({ success: true, data: caseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a case study
// @route   PUT /api/case-studies/:id
// @access  Admin
const updateCaseStudy = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      categories,
      keywords,
      tags,
      clientName,
      clientLogo,
      industry,
      projectLinks,
      servicesProvided,
      challenge,
      solution,
      results,
      testimonial,
      metrics,
      description,
      featuredImage,
      images,
      status,
      seoScore,
    } = req.body;

    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }

    if (customSlug) {
      const newSlug = slugify(customSlug, { lower: true, strict: true });
      if (newSlug !== caseStudy.slug) {
        const slugExists = await CaseStudy.findOne({
          slug: newSlug,
          _id: { $ne: caseStudy._id },
        });
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: "This slug is already in use by another case study",
          });
        }
        caseStudy.slug = newSlug;
      }
    } else if (title && title !== caseStudy.title) {
      const newSlug = slugify(title, { lower: true, strict: true });
      const slugExists = await CaseStudy.findOne({
        slug: newSlug,
        _id: { $ne: caseStudy._id },
      });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "A case study with this title already exists",
        });
      }
      caseStudy.slug = newSlug;
    }

    if (title) caseStudy.title = title;

    if (status === "published" && !featuredImage?.url && !caseStudy.featuredImage?.url) {
      return res.status(400).json({
        success: false,
        message: "Featured image is required to publish",
      });
    }

    if (status === "published" && caseStudy.status !== "published") {
      caseStudy.publishedAt = new Date();
    }

    if (categories) caseStudy.categories = categories;
    if (keywords) caseStudy.keywords = keywords;
    if (tags) caseStudy.tags = tags;
    if (clientName) caseStudy.clientName = clientName;
    if (clientLogo !== undefined) caseStudy.clientLogo = clientLogo;
    if (industry !== undefined) caseStudy.industry = industry;
    if (projectLinks !== undefined) caseStudy.projectLinks = projectLinks;
    if (servicesProvided) caseStudy.servicesProvided = servicesProvided;
    if (challenge) caseStudy.challenge = challenge;
    if (solution) caseStudy.solution = solution;
    if (results) caseStudy.results = results;
    if (testimonial !== undefined) caseStudy.testimonial = testimonial;
    if (metrics) caseStudy.metrics = metrics;
    if (description !== undefined) caseStudy.description = description;
    if (featuredImage !== undefined) caseStudy.featuredImage = featuredImage;
    if (images) caseStudy.images = images;
    if (status) caseStudy.status = status;
    if (seoScore !== undefined) caseStudy.seoScore = seoScore;

    const updatedCaseStudy = await caseStudy.save();
    res.json({ success: true, data: updatedCaseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a case study
// @route   DELETE /api/case-studies/:id
// @access  Admin
const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }
    res.json({ success: true, message: "Case study deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllCaseStudies,
  getAdminCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
};