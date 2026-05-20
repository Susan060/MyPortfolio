const Contact = require("../models/contact.model.js");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload.js")
const sendReplyEmail = require("../utils/sendReplyEmail.js");
const DOMPurify = require("isomorphic-dompurify");

// ✅ Sanitize HTML from Tiptap
const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "blockquote", "a", "img", "table", "thead", "tbody",
            "tr", "th", "td", "hr", "span", "div"
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "src", "alt", "class", "style",
            "colspan", "rowspan", "align"
        ],
    });
};



const submitContact = async (req, res) => {
    try {
        const { name, email, phone, topic, message } = req.body;

        if (!name || !email || !phone || !topic || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const contact = await Contact.create({ name, email, phone, topic, message });

        return res.status(201).json({
            message: "Your message has been sent successfully.",
            contact,
        });
    } catch (err) {
        console.error("submitContact error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};


const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({ contacts });
    } catch (err) {
        console.error("getAllContacts error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};


const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        // Auto mark as read when admin opens it
        if (contact.status === "unread") {
            contact.status = "read";
            await contact.save();
        }

        return res.status(200).json({ contact });
    } catch (err) {
        console.error("getContactById error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};


const replyToContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        // ✅ Sanitize Tiptap HTML reply
        if (req.body.reply) {
            req.body.reply = sanitizeHTML(req.body.reply);
        }

        if (!req.body.reply || req.body.reply.trim() === "" || req.body.reply === "<p></p>") {
            return res.status(400).json({ message: "Reply content cannot be empty." });
        }

        // ✅ Handle image upload — delete old one first if exists
        if (req.file) {
            if (contact.replyImageCloudinaryId) {
                try {
                    await deleteFromCloudinary(contact.replyImageCloudinaryId);
                } catch (err) {
                    console.error("Error deleting old reply image:", err);
                }
            }

            const { url, publicId } = await uploadToCloudinary(req.file.buffer, "contact-replies");
            contact.replyImageUrl = url;
            contact.replyImageCloudinaryId = publicId;
        }

        contact.reply     = req.body.reply;
        contact.repliedAt = new Date();
        contact.status    = "replied";

        await contact.save();

        // ✅ Send reply email to the person who submitted the contact form
        try {
            await sendReplyEmail({
                name:          contact.name,
                email:         contact.email,
                topic:         contact.topic,
                reply:         contact.reply,
                replyImageUrl: contact.replyImageUrl || null,
            });
        } catch (emailErr) {
            // Don't fail the request if email fails — just log it
            console.error("Failed to send reply email:", emailErr);
        }

        return res.status(200).json({
            message: "Reply sent successfully.",
            contact,
        });
    } catch (err) {
        console.error("replyToContact error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};



const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Contact message not found." });
        }

        // ✅ Delete reply image from Cloudinary if exists
        if (contact.replyImageCloudinaryId) {
            try {
                await deleteFromCloudinary(contact.replyImageCloudinaryId);
            } catch (err) {
                console.error("Error deleting reply image from Cloudinary:", err);
            }
        }

        await Contact.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Contact message deleted successfully." });
    } catch (err) {
        console.error("deleteContact error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

const getMyReplies = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const contacts = await Contact.find(
            { email: email.toLowerCase(), status: "replied" },
            { name: 1, email: 1, topic: 1, message: 1, reply: 1, replyImageUrl: 1, repliedAt: 1, createdAt: 1 }
        ).sort({ repliedAt: -1 });

        if (!contacts.length) {
            return res.status(404).json({ message: "No replies found for this email." });
        }

        return res.status(200).json({ contacts });
    } catch (err) {
        console.error("getMyReplies error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

// @desc    Get recent contacts for dashboard
// @route   GET /api/contact/dashboard/recent
// @access  Admin
const getRecentContacts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const total = await Contact.countDocuments();
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            total,
            data: contacts,
        });
    } catch (err) {
        console.error("getRecentContacts error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContactById,
    replyToContact,
    deleteContact,
    getMyReplies,
    getRecentContacts,
};