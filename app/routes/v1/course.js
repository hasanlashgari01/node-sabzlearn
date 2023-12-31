const express = require('express');
const courseController = require('../../controllers/v1/course');
const multer = require('multer');
const multerStorage = require('../../utils/uploader');
const authMiddleware = require('../../middlewares/auth');
const isAdminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router
    .route('/')
    .post(
        multer({ storage: multerStorage, limits: { fileSize: 1000000 } }).single('cover'),
        authMiddleware,
        isAdminMiddleware,
        courseController.create
    );

router.route('/popular').get(courseController.getPopular);
router.route('/presell').get(courseController.getPresell);
router.route('/related/:href').get(courseController.getRelated);
router.route('/:href').get(authMiddleware, courseController.getOne);
router.route('/:id').delete(authMiddleware, isAdminMiddleware, courseController.remove);
router.route('/category/:href').get(courseController.getCoursesByCategory);
router.route('/:href/:sessionID').get(courseController.getSessionInfo);
router.route('/:id/register').post(authMiddleware, courseController.register);

router
    .route('/:id/sessions')
    .post(
        multer({ storage: multerStorage, limits: { fileSize: 1000000000 } }).single('video'),
        authMiddleware,
        isAdminMiddleware,
        courseController.createSession
    );

router.route('/sessions').get(authMiddleware, isAdminMiddleware, courseController.getAllSessions);
router
    .route('/sessions/:id')
    .delete(authMiddleware, isAdminMiddleware, courseController.removeSession);

module.exports = router;
