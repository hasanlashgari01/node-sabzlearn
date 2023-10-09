const courseModel = require('../../models/course');

exports.get = async (req, res, next) => {
    const { keyword } = req.params;

    const courses = await courseModel.find({ name: { $regex: '.*' + keyword + '.*' } });

    console.log(courses);

    res.json(courses);
};
