const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    message:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread'
    },
    reply: {
        type: String,
        default: null,
    },

    // Image attached to the admin reply
    replyImageUrl: {
        type: String,
        default: null,
    },

    replyImageCloudinaryId: {
        type: String,
        default: null,
    },

    repliedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true })

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)
module.exports = Contact