const mongoose = require('mongoose');

const workoutSchema =  mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    exerciseName: {
        type: String,
        required: true,
        trim: true
    },

    sets: {
        type: Number,
        required: true,
        min: 1
    },

    reps: {
        type: Number,
        required: true,
        min: 1
    },

    weight: {
        type: Number,
        required: true,
        min: 0
    },

    notes: {
        type: String,
        trim: true,
        default: ''
    },

    category: {
        type: String,
        required: true,
        enum: ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility']
    },

    date: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);