const express = require("express");
const {
    submitContact,
    getAllContacts,
    getContactById,
    replyToContact,
    deleteContact,
    getMyReplies,
    getRecentContacts,
} = require("../controllers/contactController.js");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");

const router = express.Router();

// ─────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────

// POST /api/contact — Submit a new contact message
router.post("/", submitContact);

// GET /api/contact/reply/:email — User checks replies by their email
router.get("/reply/:email", getMyReplies);

// ─────────────────────────────────────────────
// Admin Protected Routes
// ─────────────────────────────────────────────

// GET /api/contact — Get all contact messages
router.get("/", isAuthenticated, isAdmin, getAllContacts);

// GET /api/contact/:id — Get single contact (auto-marks as read)
router.get("/:id", isAuthenticated, isAdmin, getContactById);

// PUT /api/contact/:id/reply — Admin reply with Tiptap HTML + optional image
router.put("/:id/reply", isAuthenticated, isAdmin, upload.single("replyImage"), replyToContact);

// DELETE /api/contact/:id — Delete contact + its Cloudinary image
router.delete("/:id", isAuthenticated, isAdmin, deleteContact);

router.get("/dashboard/recent", isAuthenticated, isAdmin, getRecentContacts);

module.exports = router;