
const mongoose = require('mongoose');

const supportMessageSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Support', 'Feedback', 'Bug Report'],
        default: 'Support'
    }
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
