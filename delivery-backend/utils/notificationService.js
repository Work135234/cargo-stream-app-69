const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create a notification
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create booking created notification for admin
  static async notifyBookingCreated(booking) {
    try {
      // Find all admin users
      const admins = await User.find({ role: 'Admin' });
      
      const notifications = admins.map(admin => ({
        recipient: admin._id,
        type: 'booking_created',
        title: 'New Booking Available',
        message: `A new booking has been created and is ready for dispatcher assignment. Booking ID: ${booking._id}`,
        relatedBooking: booking._id,
        priority: 'high'
      }));

      await Notification.insertMany(notifications);
      console.log(`Created ${notifications.length} notifications for admins`);
    } catch (error) {
      console.error('Error notifying booking created:', error);
    }
  }

  // Create booking assigned notification for dispatcher
  static async notifyBookingAssigned(booking, dispatcherId) {
    try {
      const notification = await this.createNotification({
        recipient: dispatcherId,
        type: 'booking_assigned',
        title: 'New Booking Assigned',
        message: `You have been assigned a new booking. Pickup: ${booking.pickupAddress}, Delivery: ${booking.deliveryAddress}`,
        relatedBooking: booking._id,
        priority: 'high'
      });
      
      console.log(`Created notification for dispatcher ${dispatcherId}`);
      return notification;
    } catch (error) {
      console.error('Error notifying booking assigned:', error);
    }
  }

  // Create driver assigned notification for customer
  static async notifyDriverAssigned(booking) {
    try {
      const notification = await this.createNotification({
        recipient: booking.customer,
        type: 'driver_assigned',
        title: 'Driver Assigned',
        message: `A driver has been assigned to your delivery. Your order is now being processed.`,
        relatedBooking: booking._id,
        priority: 'medium'
      });
      
      console.log(`Created notification for customer ${booking.customer}`);
      return notification;
    } catch (error) {
      console.error('Error notifying driver assigned:', error);
    }
  }

  // Create booking confirmed notification for customer
  static async notifyBookingConfirmed(booking) {
    try {
      const notification = await this.createNotification({
        recipient: booking.customer,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: `Your booking has been confirmed! Fare: $${booking.fare}`,
        relatedBooking: booking._id,
        priority: 'medium'
      });
      
      console.log(`Created confirmation notification for customer ${booking.customer}`);
      return notification;
    } catch (error) {
      console.error('Error notifying booking confirmed:', error);
    }
  }

  // Create status update notification for customer
  static async notifyStatusUpdate(booking, status) {
    try {
      const statusMessages = {
        'Scheduled': 'Your delivery has been scheduled',
        'In Transit': 'Your delivery is now in transit',
        'Delivered': 'Your delivery has been completed'
      };

      const notification = await this.createNotification({
        recipient: booking.customer,
        type: 'status_updated',
        title: 'Status Update',
        message: statusMessages[status] || `Your delivery status has been updated to ${status}`,
        relatedBooking: booking._id,
        priority: 'medium'
      });
      
      console.log(`Created status update notification for customer ${booking.customer}`);
      return notification;
    } catch (error) {
      console.error('Error notifying status update:', error);
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId, limit = 20) {
    try {
      const notifications = await Notification.find({ recipient: userId })
        .populate('sender', 'name')
        .populate('relatedBooking', 'pickupAddress deliveryAddress')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false
      });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
      });
      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
