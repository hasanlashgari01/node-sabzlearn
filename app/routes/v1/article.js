const express = require('express');
const multer = require('multer');
const multerStorage = require('../../utils/uploader');
const authMiddleware = require('../../middlewares/auth');
const isAdminMiddleware = require('../../middlewares/isAdmin');
const articleController = require('../../controllers/v1/article');

const router = express.Router();

router
    .route('/')
    .get(articleController.getAll)
    .post(
        authMiddleware,
        isAdminMiddleware,
        multer({ storage: multerStorage, limits: { fileSize: 10000000 } }).single('cover'),
        articleController.create
    );
router.route('/:href').get(articleController.getOne);
router.route('/:id').delete(authMiddleware, isAdminMiddleware, articleController.remove);
router
    .route('/draft')
    .post(
        authMiddleware,
        isAdminMiddleware,
        multer({ storage: multerStorage, limits: { fileSize: 10000000 } }).single('cover'),
        articleController.saveDraft
    );

module.exports = router;
