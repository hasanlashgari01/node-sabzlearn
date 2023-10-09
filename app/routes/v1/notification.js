const express = require('express');
const notificationController = require('../../controllers/v1/notification');
const authMiddleware = require('../../middlewares/auth');
const isAdminMiddleware = require('../../middlewares/isAdmin');

const router = express.Router();

router
    .route('/')
    .get(authMiddleware, isAdminMiddleware, notificationController.getAll)
    .post(authMiddleware, isAdminMiddleware, notificationController.create);
router.route('/admins').get(authMiddleware, isAdminMiddleware, notificationController.get);
router
    .route('/:id/action')
    .put(authMiddleware, isAdminMiddleware, notificationController.seen)
    .delete(authMiddleware, isAdminMiddleware, notificationController.remove);

module.exports = router;
