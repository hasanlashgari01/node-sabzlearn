const { isValidObjectId } = require('mongoose');
const notificationModel = require('../../models/notification');

exports.getAll = async (req, res, next) => {
    const notifications = await notificationModel.find({});

    res.json(notifications);
};

exports.create = async (req, res, next) => {
    const { message, admin } = req.body;

    const notification = await notificationModel.create({ message, admin });

    return res.status(201).json(notification);
};

exports.get = async (req, res, next) => {
    const { _id } = req.user;

    const adminNotifications = await notificationModel.find({ admin: _id });
    res.json(adminNotifications);
};

exports.seen = async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) res.status(500).json({ message: 'ID is not valid' });

    const notification = await notificationModel.findByIdAndUpdate({ _id: id }, { seen: 1 });

    res.json(notification);
};

exports.remove = async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) res.status(500).json({ message: 'ID is not valid' });

    const notification = await notificationModel.findByIdAndRemove({ _id: id });

    res.json(notification);
};
