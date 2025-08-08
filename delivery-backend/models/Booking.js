const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  distance: { type: Number, required: true },
  weight: { type: Number, required: true },
  modeOfTransport: {
    type: String,
    required: true,
    enum: ['train', 'truck'],
    default: 'truck'
  },
  productType: { type: String },
  dimensions: { type: String },
  pickupDate: { type: Date },
  specialInstructions: { type: String },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  fare: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Scheduled', 'In Transit', 'Delivered'], default: 'Pending' },
  history: [{
    status: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
