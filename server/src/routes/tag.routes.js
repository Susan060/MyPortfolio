const express = require("express");
const router = express.Router();
const {
  getAllTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.get("/", getAllTags);
router.get("/:slug", getTagBySlug);
router.post("/", isAuthenticated, isAdmin, createTag);
router.put("/:id", isAuthenticated, isAdmin, updateTag);
router.delete("/:id", isAuthenticated, isAdmin, deleteTag);

module.exports = router;