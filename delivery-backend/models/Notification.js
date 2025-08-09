// const mongoose = require('mongoose');

// const NotificationSchema = new mongoose.Schema({
//   recipient: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   sender: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   },
//   type: { 
//     type: String, 
//     required: true,
//     enum: ['booking_created', 'booking_assigned', 'driver_assigned', 'status_updated', 'booking_confirmed']
//   },
//   title: { 
//     type: String, 
//     required: true 
//   },
//   message: { 
//     type: String, 
//     required: true 
//   },
//   relatedBooking: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Booking' 
//   },
//   isRead: { 
//     type: Boolean, 
//     default: false 
//   },
//   priority: { 
//     type: String, 
//     enum: ['low', 'medium', 'high'], 
//     default: 'medium' 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Index for efficient queries
// NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// module.exports = mongoose.model('Notification', NotificationSchema);





















const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['booking_created', 'dispatcher_assigned', 'status_updated', 'delivery_completed', 'system'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);