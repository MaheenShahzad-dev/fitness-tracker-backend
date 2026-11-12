const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    weeklyWorkoutTarget: {
        type: Number,
        min: 1,
        default: 5
    },
    lastAchievedWeekStart: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);