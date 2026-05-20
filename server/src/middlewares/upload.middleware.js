const multer = require("multer");

// ✅ Use memory storage so we get req.file.buffer (matches uploadToCloudinary util)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed."), false);
        }
        cb(null, true);
    },
});

module.exports = upload;