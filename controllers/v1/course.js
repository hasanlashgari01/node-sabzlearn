const { default: mongoose } = require('mongoose');
const courseModel = require('../../models/course');
const sessionModel = require('../../models/session');
const categoryModel = require('../../models/category');
const commentModel = require('../../models/comment');
const courseUserModel = require('../../models/course-user');

exports.create = async (req, res, next) => {
  const { title, description, support, cover, href, price, status, discount, categoryID } = req.body;

  const course = await courseModel.create({
    title,
    description,
    // cover: req.file.filename,
    cover,
    support,
    href,
    price,
    status,
    discount,
    categoryID,
    creator: req.user._id,
  });

  const mainCourse = await courseModel.findById(course._id).populate('creator', '-password');

  return res.status(201).json(mainCourse);
};

exports.getOne = async (req, res, next) => {
  const course = await courseModel
    .findOne({ href: req.params.href })
    .populate('creator', '-password -__v')
    .populate('categoryID', '-__v');

  if (!course) {
    return res.status(404).json({
      message: 'Course not found',
    });
  }

  const sessions = await sessionModel.find({ course: course._id }).lean();

  let removeItem = '-password -phone -email -__v -createdAt -updatedAt';
  const comments = await commentModel
    .find({ course: course._id, isAccepted: 1 }, removeItem)
    .populate('creator', removeItem)
    .lean();

  const courseStudentCount = await courseUserModel.find({ course: course._id }).count();

  const isUserRegisteredToThisCourse = !!(await courseUserModel.findOne({
    user: req.user._id,
    course: course._id,
  }));

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

  res.json({
    course,
    sessions,
    comments: allComments,
    courseStudentCount,
    isUserRegisteredToThisCourse,
  });
};

exports.createSession = async (req, res, next) => {
  const { title, free, time } = req.body;
  const { id } = req.params;

  const session = await sessionModel.create({
    title,
    free,
    time,
    video: 'Video.mp4', // req.file.filename
    course: id,
  });

  return res.status(201).json(session);
};

exports.getAllSessions = async (req, res, next) => {
  const sessions = await sessionModel.find().populate('course', 'title').lean();

  return res.json(sessions);
};

exports.getSessionInfo = async (req, res, next) => {
  const course = await courseModel.findOne({ href: req.params.href }).lean();
  const session = await sessionModel.findOne({ _id: req.params.sessionID });
  const sessions = await sessionModel.find({ course: course._id });

  return res.json({ session, sessions });
};

exports.removeSession = async (req, res, next) => {
  const deletedCourse = await sessionModel.findOneAndDelete({
    _id: req.params.id,
  });

  if (!deletedCourse) {
    return res.status(404).json({ message: 'Course not found !!' });
  }

  return res.json(deletedCourse);
};

exports.register = async (req, res, next) => {
  const isUserAlreadyRegistered = await courseUserModel
    .findOne({
      user: req.user._id,
      course: req.user._id,
    })
    .lean();

  if (isUserAlreadyRegistered) {
    return res.status(409).json({
      message: 'User already registered in this course',
    });
  }

  const register = await courseUserModel.create({
    user: req.user._id,
    course: req.params.id,
    price: req.body.price,
  });

  return res.status(201).json({ message: 'You are registered successfully' });
};

exports.getCoursesByCategory = async (req, res, next) => {
  const { href } = req.params;
  const category = await categoryModel.findOne({ href });

  if (category) {
    const categoryCourses = await courseModel.find({ categoryID: category._id }).sort({ updatedAt: 1 });

    res.json(categoryCourses);
  } else {
    res.json([]);
  }
};

exports.remove = async (req, res, next) => {
  const isObjectIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isObjectIdValid) {
    return res.status(409).json({
      message: 'Course Id is not valid !!',
    });
  }

  const deletedCourse = await courseModel.findOneAndRemove({ _id: req.params.id });

  if (!deletedCourse) {
    return res.status(404).json({
      message: 'Course not found !!',
    });
  }

  return res.json({ deletedCourse });
};

exports.getRelated = async (req, res, next) => {
  const { href } = req.params;

  const course = await courseModel.findOne({ href });

  if (!course) {
    return res.status(404).json({
      message: 'Course not found',
    });
  }

  let relatedCourses = await courseModel.find({ categoryID: course.categoryID }).select('title cover href price');
  relatedCourses = relatedCourses.filter((course) => course.href !== href);

  return res.json(relatedCourses);
};

exports.getPopular = async (req, res, next) => {
  const popularCourses = await courseModel
    .find({})
    .sort({ score: -1 })
    .select('-description -support -creator -__v -createdAt')
    .lean();

  res.json(popularCourses);
};

exports.getPresell = async (req, res, next) => {
  const presellCourses = await courseModel
    .find({ status: 'presell' })
    .sort({ updatedAt: -1 })
    .select('-description -support -__v -createdAt')
    .lean();

  res.json(presellCourses);
};
