
const mongoose = require('mongoose');

const progressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        min: 0.01
    },
    measurements: {
        chest: {
            type: Number,
            min: 0.01
        },
        waist: {
            type: Number,
            min: 0.01
        }
    },
   performanceMetrics: {
    runTime: {
        type: Number,
        min: 0.01
    },
    runDistance: {
        type: Number,
        min: 0.01
    }
},
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
