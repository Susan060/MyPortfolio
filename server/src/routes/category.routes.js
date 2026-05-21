const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware"); // fix

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", isAuthenticated, isAdmin, createCategory);       // fix
router.put("/:id", isAuthenticated, isAdmin, updateCategory);     // fix
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);  // fix

module.exports = router;