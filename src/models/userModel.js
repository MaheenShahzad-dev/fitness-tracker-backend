
const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true
    },

    password: {
        type: String
    },

    profilePic: {
        type: String,
        default: ''
    },

    profilePicPublicId: {
        type: String,
        default: ''
    },

    settings: {
        theme: {
            type: String,
            enum: ['Light', 'Dark'],
            default: 'Light'
        },

        weightUnit: {
            type: String,
            enum: ['kg', 'lb'],
            default: 'kg'
        },

        distanceUnit: {
            type: String,
            enum: ['km', 'miles'],
            default: 'km'
        },

        notificationsEnabled: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userModel);
