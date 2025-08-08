const User = require('../models/User');
const PricingRule = require('../models/PricingRule');
const Booking = require('../models/Booking');

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// Pricing Rules Management
exports.getAllPricingRules = async (req, res) => {
  try {
    const pricingRules = await PricingRule.find().sort({ modeOfTransport: 1 });
    res.json({ success: true, pricingRules });
  } catch (err) {
    console.error('Get pricing rules error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing rules' });
  }
};

exports.createPricingRule = async (req, res) => {
  try {
    const { modeOfTransport, baseFare, perKmRate, perKgRate } = req.body;

    // Check if pricing rule already exists for this transport mode
    const existingRule = await PricingRule.findOne({ modeOfTransport });
    if (existingRule) {
      return res.status(400).json({
        success: false,
        message: 'Pricing rule already exists for this transport mode'
      });
    }

    const pricingRule = new PricingRule({
      modeOfTransport,
      baseFare,
      perKmRate,
      perKgRate,
      isActive: true
    });

    await pricingRule.save();
    res.status(201).json({ success: true, pricingRule });
  } catch (err) {
    console.error('Create pricing rule error:', err);
    res.status(500).json({ success: false, message: 'Failed to create pricing rule' });
  }
};

exports.updatePricingRule = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const { modeOfTransport, baseFare, perKmRate, perKgRate, isActive } = req.body;

    const pricingRule = await PricingRule.findByIdAndUpdate(
      ruleId,
      { modeOfTransport, baseFare, perKmRate, perKgRate, isActive },
      { new: true, runValidators: true }
    );

    if (!pricingRule) {
      return res.status(404).json({ success: false, message: 'Pricing rule not found' });
    }

    res.json({ success: true, pricingRule });
  } catch (err) {
    console.error('Update pricing rule error:', err);
    res.status(500).json({ success: false, message: 'Failed to update pricing rule' });
  }
};

exports.deletePricingRule = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const pricingRule = await PricingRule.findByIdAndDelete(ruleId);

    if (!pricingRule) {
      return res.status(404).json({ success: false, message: 'Pricing rule not found' });
    }

    res.json({ success: true, message: 'Pricing rule deleted successfully' });
  } catch (err) {
    console.error('Delete pricing rule error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete pricing rule' });
  }
};

// Booking Management
exports.getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
      startDate = '',
      endDate = '',
      customerId = ''
    } = req.query;

    const skip = (page - 1) * limit;
    let query = {};

    if (status) query.status = status;
    if (customerId) query.customer = customerId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email')
      .populate('dispatcher', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Reports
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let reportData = {};

    switch (reportType) {
      case 'bookings':
        const bookings = await Booking.find(query)
          .populate('customer', 'name email')
          .populate('dispatcher', 'name email');

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.fare, 0);
        const statusCounts = bookings.reduce((acc, booking) => {
          acc[booking.status] = (acc[booking.status] || 0) + 1;
          return acc;
        }, {});

        reportData = {
          totalBookings,
          totalRevenue,
          statusCounts,
          bookings
        };
        break;

      case 'users':
        const users = await User.find(query).select('-password');
        const userCounts = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        reportData = {
          totalUsers: users.length,
          userCounts,
          users
        };
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }

    res.json({
      success: true,
      reportData,
      filters: { startDate, endDate, reportType }
    });
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
};


// adminController.js  ⬅︎ bottom of file
exports.toggleRuleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await PricingRule.findById(id);
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });

    const mode = rule.modeOfTransport;
    const allRules = await PricingRule.find({ modeOfTransport: mode });

    // > 2 rules → manual choice
    if (allRules.length > 2 && !req.body.force) {
      return res.json({ type: 'MANUAL_CHOICE_REQUIRED', rules: allRules });
    }

    // Auto-switch
    if (!rule.isActive) {
      await PricingRule.updateMany({ modeOfTransport: mode, isActive: true }, { isActive: false });
    }
    rule.isActive = !rule.isActive;
    await rule.save();
    res.json({ success: true, rule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to toggle rule' });
  }
};