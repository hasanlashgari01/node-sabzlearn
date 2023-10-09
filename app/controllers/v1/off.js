const { isValidObjectId } = require('mongoose');
const coursesModel = require('../../models/course');
const offModel = require('../../models/off');

exports.getAll = async (req, res, next) => {
    const offs = await offModel
        .find({}, '-__v')
        .populate('course', 'name href')
        .populate('creator', 'name')
        .lean();

    res.json(offs);
};

exports.create = async (req, res, next) => {
    const { code, course, percent, max } = req.body;

    const newOff = await offModel.create({
        code,
        course,
        percent,
        max,
        uses: 0,
        creator: req.user._id,
    });

    res.status(201).json(newOff);
};

exports.setOnAll = async (req, res, next) => {
    const { discount } = req.body;

    const coursesDiscounts = await coursesModel.updateMany({ discount });

    res.json({ message: 'Discounts set successfully  :))' });
};

exports.getOne = async (req, res, next) => {
    const { course } = req.params;
    const { code } = req.body;
    if (!isValidObjectId(course))
        return res.status(404).json({ message: 'Course ID is not valid!!' });

    const off = await offModel.findOne({ code, course });

    if (!off) {
        return res.status(404).json({ message: 'Code is not valid' });
    } else if (off.max == off.uses) {
        return res.status(409).json({ message: 'This code already used !!' });
    } else {
        await offModel.findOneAndUpdate({ code, course }, { uses: off.uses + 1 });
    }

    res.json(off);
};

exports.remove = async (req, res, next) => {
    const { id: course } = req.params;
    const { code } = req.body;

    const off = await offModel.findOneAndRemove({ course, code });
    if (!off) return res.status(404).json({ message: 'Course with this discount is not fount!!' });

    res.json(off);
};
