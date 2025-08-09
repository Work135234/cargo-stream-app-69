// const NotificationService = require('../utils/notificationService');

// // Get user notifications
// exports.getNotifications = async (req, res) => {
//   try {
//     const notifications = await NotificationService.getUserNotifications(req.user.id);
//     res.json({
//       success: true,
//       notifications
//     });
//   } catch (error) {
//     console.error('Error getting notifications:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get notifications'
//     });
//   }
// };

// // Get unread count
// exports.getUnreadCount = async (req, res) => {
//   try {
//     const count = await NotificationService.getUnreadCount(req.user.id);
//     res.json({
//       success: true,
//       count
//     });
//   } catch (error) {
//     console.error('Error getting unread count:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get unread count'
//     });
//   }
// };

// // Mark notification as read
// exports.markAsRead = async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     const notification = await NotificationService.markAsRead(notificationId, req.user.id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       notification
//     });
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark notification as read'
//     });
//   }
// };

// // Mark all notifications as read
// exports.markAllAsRead = async (req, res) => {
//   try {
//     await NotificationService.markAllAsRead(req.user.id);
//     res.json({
//       success: true,
//       message: 'All notifications marked as read'
//     });
//   } catch (error) {
//     console.error('Error marking all notifications as read:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark all notifications as read'
//     });
//   }
// };

// // Delete notification
// exports.deleteNotification = async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     const notification = await NotificationService.deleteNotification(notificationId, req.user.id);

//     if (!notification) {
//       return res.status(404).json({
//         success: false,
//         message: 'Notification not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Notification deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete notification'
//     });
//   }
// };















const Notification = require('../models/Notification');
const User = require('../models/User');

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all as read error:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.json({ success: true, count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ success: false, message: 'Failed to get unread count' });
  }
};

// Create a notification (internal use)
exports.createNotification = async (userId, title, message, type = 'system', bookingId = null) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      bookingId
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error('Create notification error:', err);
    throw err;
  }
};

// Create notification for booking created
exports.notifyBookingCreated = async (booking) => {
  try {
    // Notify admin about new booking
    const adminUsers = await User.find({ role: 'Admin' });

    for (const admin of adminUsers) {
      await this.createNotification(
        admin._id,
        'New Booking Created',
        `A new booking has been created by ${booking.customer.name}. Booking ID: ${booking._id.slice(-6)}`,
        'booking_created',
        booking._id
      );
    }

    // Notify customer about booking confirmation
    await this.createNotification(
      booking.customer,
      'Booking Confirmed',
      `Your booking has been successfully created. Booking ID: ${booking._id.slice(-6)}`,
      'booking_created',
      booking._id
    );
  } catch (err) {
    console.error('Notify booking created error:', err);
  }
};

// Create notification for dispatcher assignment
exports.notifyDispatcherAssigned = async (booking, dispatcher) => {
  try {
    // Notify dispatcher about new assignment
    await this.createNotification(
      dispatcher._id,
      'New Delivery Assignment',
      `You have been assigned to delivery booking ${booking._id.slice(-6)}`,
      'dispatcher_assigned',
      booking._id
    );

    // Notify customer about dispatcher assignment
    await this.createNotification(
      booking.customer,
      'Dispatcher Assigned',
      `A dispatcher has been assigned to your delivery. Booking ID: ${booking._id.slice(-6)}`,
      'dispatcher_assigned',
      booking._id
    );
  } catch (err) {
    console.error('Notify dispatcher assigned error:', err);
  }
};

// Create notification for status update
exports.notifyStatusUpdate = async (booking, oldStatus, newStatus) => {
  try {
    // Notify customer about status change
    await this.createNotification(
      booking.customer,
      'Delivery Status Updated',
      `Your delivery status has been updated from ${oldStatus} to ${newStatus}. Booking ID: ${booking._id.slice(-6)}`,
      'status_updated',
      booking._id
    );

    // If status is "Delivered", notify admin
    if (newStatus === 'Delivered') {
      const adminUsers = await User.find({ role: 'Admin' });

      for (const admin of adminUsers) {
        await this.createNotification(
          admin._id,
          'Delivery Completed',
          `Delivery completed for booking ${booking._id.slice(-6)}`,
          'delivery_completed',
          booking._id
        );
      }
    }
  } catch (err) {
    console.error('Notify status update error:', err);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};