const mongoose = require('mongoose');

const PricingRuleSchema = new mongoose.Schema({
  modeOfTransport: {
    type: String,
    required: true,
    enum: ['train', 'truck'],
    default: 'truck'
  },
  baseFare: { type: Number, required: true },
  perKmRate: { type: Number, required: true },
  perKgRate: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('PricingRule', PricingRuleSchema);
