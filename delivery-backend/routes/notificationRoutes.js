// const express = require('express');
// const router = express.Router();
// const notificationController = require('../controllers/notificationController');
// const authMiddleware = require('../middleware/authMiddleware');

// // All routes require authentication
// router.use(authMiddleware);

// // Get user notifications
// router.get('/', notificationController.getNotifications);

// // Get unread count
// router.get('/unread-count', notificationController.getUnreadCount);

// // Mark notification as read
// router.patch('/:notificationId/read', notificationController.markAsRead);

// // Mark all notifications as read
// router.patch('/mark-all-read', notificationController.markAllAsRead);

// // Delete notification
// router.delete('/:notificationId', notificationController.deleteNotification);

// module.exports = router;





const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(auth);

// Get user notifications
router.get('/', notificationController.getNotifications);

// Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark a notification as read
router.patch('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;