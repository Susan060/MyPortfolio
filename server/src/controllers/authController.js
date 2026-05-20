// controllers/authController.js
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {
    const { name, email, password, role = 'user' } = req.body;

    const existUser = await User.findOne({ email })
    if (existUser) {
        return res.status(409).json({ message: "User already exists" })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role })

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie("token", token, { httpOnly: true, sameSite: 'lax' })
    res.status(201).json({ message: "User Created Successfully", user })
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  // ✅ keep this
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path:'/',  // ✅ 'none' for cross-origin prod
        maxAge: 1000 * 60 * 60 * 24 * 7  // 7 days (match your JWT expiry)
    })
    res.status(200).json({
        message: "Login Successful",
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
}

async function getMe(req, res) {
    const token = req.cookies.token  // ✅ Fixed: req.cookie → req.cookies

    if (!token) {
        return res.status(401).json({ message: "Not Authenticated" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')  // ✅ Fixed: findOnr → findById, -password as string
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" })
    }
}
module.exports = { registerUser, loginUser, getMe }