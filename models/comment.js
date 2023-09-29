const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isAccepted: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default: 5,
    },
    isAnswer: {
        type: Number,
        required: true,
        default: 0,
    },
    mainCommentID: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
    },
}, { timestamps: true })

const model = mongoose.model('Comment', schema)

module.exports = model