const courseUserModel = require('../../models/course-user');

exports.getAll = async (req, res, next) => {
    const orders = await courseUserModel
        .find({ user: req.user._id }, '-__v -user')
        .populate('course', 'name href')
        .lean();

    res.json(orders);
};

exports.getOne = async (req, res, next) => {
    const order = await courseUserModel
        .findOne({ _id: req.params._id }, '-__v -user')
        .populate('course', 'name href')
        .lean();

    res.json(order);
};
