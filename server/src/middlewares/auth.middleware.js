const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

// ─────────────────────────────────────────────
// @desc    Verify JWT token and attach user to req
// @usage   Apply to any protected route
// ─────────────────────────────────────────────
const isAuthenticated = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User no longer exists." });
        }

        req.user = user;
        next();

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }
        console.error("isAuthenticated error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};


// ─────────────────────────────────────────────
// @desc    Check if the authenticated user is an admin
// @usage   Always use AFTER isAuthenticated
// ─────────────────────────────────────────────
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { isAuthenticated, isAdmin };