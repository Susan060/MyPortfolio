const express = require("express");
const router = express.Router();
const {
  getAllCaseStudies,
  getAdminCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} = require("../controllers/casestudyController");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/auth.middleware");

// ─── Public ──────────────────────────────────────────────────────
router.get("/", getAllCaseStudies);
router.get("/:slug", getCaseStudyBySlug);

// ─── Admin ────────────────────────────────────────────────────────
router.get("/admin/all", isAuthenticated, isAdmin, getAdminCaseStudies);
router.get("/id/:id", isAuthenticated, isAdmin, getCaseStudyById);
router.post("/", isAuthenticated, isAdmin, createCaseStudy);
router.put("/:id", isAuthenticated, isAdmin, updateCaseStudy);
router.delete("/:id", isAuthenticated, isAdmin, deleteCaseStudy);

module.exports = router;