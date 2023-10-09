const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        priority: { type: Number, required: true }, // ? => 1, 2, 3
        answer: { type: Number, required: true }, // ? => 0 - 1
        user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Types.ObjectId, ref: 'Course', required: false },
        departmentID: { type: mongoose.Types.ObjectId, ref: 'Department', required: true },
        departmentSubID: { type: mongoose.Types.ObjectId, ref: 'DepartmentSub', required: true },
        parent: { type: mongoose.Types.ObjectId, ref: 'Ticket', required: false },
        isAnswer: { type: Number, required: true }, // ? => 0 - 1
    },
    { timestamps: true }
);

const model = mongoose.model('Ticket', schema);

module.exports = model;
