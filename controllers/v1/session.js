const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    time: {
        type: String, // 12:09
        required: true,
    },
    free: {
        type: Number, // 0 (false - not free) || 1 (true - free)
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
    },
}, { timestamps: true });

const model = mongoose.model('Session', schema)

module.exports = model;