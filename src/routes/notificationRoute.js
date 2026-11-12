
let express = require('express');
let router = express.Router();
let notificationController = require('../controllers/notificationController');
let authMiddleware = require('../middleware/auth_middleware');

router.get('/', authMiddleware.verifyToken, notificationController.getNotifications);
router.get('/unread-count', authMiddleware.verifyToken, notificationController.getUnreadCount);
router.patch('/read-all', authMiddleware.verifyToken, notificationController.markAllAsRead);
router.delete('/', authMiddleware.verifyToken, notificationController.deleteAllNotifications);
router.patch('/:id/read', authMiddleware.verifyToken, notificationController.markAsRead);
router.delete('/:id', authMiddleware.verifyToken, notificationController.deleteNotification);

module.exports = router;
