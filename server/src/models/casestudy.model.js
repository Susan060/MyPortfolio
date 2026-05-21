const mongoose = require("mongoose");

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientLogo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      altText: { type: String, default: "" },
    },
    industry: {
      type: String,
      trim: true,
      default: "",
    },
    projectDuration: {
      type: String,
      default: "",
    },
    servicesProvided: {
      type: [String],
      default: [],
    },
    challenge: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    results: {
      type: String,
      required: true,
    },
    testimonial: {
      quote: { type: String, default: "" },
      author: { type: String, default: "" },
      role: { type: String, default: "" },
    },
    metrics: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },
    keywords: {
      type: [String],
      default: [],
    },
    featuredImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      altText: { type: String, default: "" },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        altText: { type: String, default: "" },
      },
    ],
    seoScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    projectLinks: {
      live: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
    },
  },
  {
    timestamps: true,
  }
);

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);
module.exports = CaseStudy;