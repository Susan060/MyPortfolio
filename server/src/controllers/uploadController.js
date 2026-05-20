const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Admin
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.buffer, "blog");
    res.status(201).json({ success: true, url, publicId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
// @access  Admin
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    await deleteFromCloudinary(publicId);
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadImage, deleteImage };