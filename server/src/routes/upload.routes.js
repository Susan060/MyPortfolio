const express = require("express");
const router = express.Router();
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/", isAuthenticated, isAdmin, upload.single("image"), uploadImage);
router.delete("/", isAuthenticated, isAdmin, deleteImage);

module.exports = router;