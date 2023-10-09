const commentModel = require('../../models/comment');
const courseModel = require('../../models/course');

exports.create = async (req, res, next) => {
    const { body, courseHref, score } = req.body;
    const course = await courseModel.findOne({ href: courseHref }).lean();
    const comment = await commentModel.create({
        body,
        course: course._id,
        creator: req.user._id,
        score,
        isAnswer: 0,
        isAccepted: 0, // 1 => show as public
    });

    return res.status(201).json(comment);
};

exports.getAll = async (req, res, next) => {
    const comments = await commentModel
        .find({})
        .populate('course', 'title cover href price')
        .populate('creator', '-password -phone -__v')
        .lean();

    let allComments = [];

    comments.forEach((comment) => {
        comments.forEach((answerComment) => {
            if (String(comment._id) == String(answerComment.mainCommentID)) {
                allComments.push({
                    ...comment,
                    course: comment.course.name,
                    creator: comment.creator.name,
                    answerComment,
                });
            }
        });
    });

    return res.json({ comments: allComments });
};

exports.remove = async (req, res, next) => {
    const deletedComment = await commentModel.findOneAndRemove({ _id: req.params.id });

    if (!deletedComment) {
        return res.status(404).json({
            message: 'Comment not found !!',
        });
    }

    return res.json({ deletedComment });
};

exports.accept = async (req, res, next) => {
    const acceptedComment = await commentModel.findOneAndUpdate({ _id: req.params.id }, { isAccepted: 1 });

    if (!acceptedComment) {
        return res.status(404).json({
            message: 'Comment not found !!',
        });
    }

    return res.json({ message: 'Comment accepted successfully.' });
};

exports.reject = async (req, res, next) => {
    const rejectedComment = await commentModel.findOneAndUpdate({ _id: req.params.id }, { isAccepted: 0 });

    if (!rejectedComment) {
        return res.status(404).json({
            message: 'Comment not found !!',
        });
    }

    return res.json({ message: 'Comment rejeted successfully.' });
};

exports.answer = async (req, res, next) => {
    const { body } = req.body;

    const acceptedComment = await commentModel.findOneAndUpdate({ _id: req.params.id }, { isAccepted: 1, isAnswer: 1 });

    if (!acceptedComment) {
        return res.status(404).json({
            message: 'Comment not found !!',
        });
    }

    const answerComment = await commentModel.create({
        body,
        course: acceptedComment.course,
        creator: req.user._id,
        isAnswer: 0,
        isAccepted: 1,
        mainCommentID: req.params.id,
    });

    return res.status(201).json(answerComment);
};
