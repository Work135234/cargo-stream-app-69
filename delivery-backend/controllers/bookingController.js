// const Booking = require('../models/Booking');
// const User = require('../models/User');

// // Get real booking stats for dashboard
// const getBookingStats = async (req, res) => {
//   try {
//     const customerId = req.user.id;

//     const [
//       totalBookings,
//       activeDeliveries,
//       completedDeliveries,
//       totalSpent
//     ] = await Promise.all([
//       Booking.countDocuments({ customer: customerId }),
//       Booking.countDocuments({ customer: customerId, status: 'In Transit' }),
//       Booking.countDocuments({ customer: customerId, status: 'Delivered' }),
//       Booking.aggregate([
//         { $match: { customer: customerId } },
//         { $group: { _id: null, total: { $sum: '$fare' } } }
//       ])
//     ]);

//     res.json({
//       totalBookings,
//       activeDeliveries: activeDeliveries || 0,
//       completedDeliveries: completedDeliveries || 0,
//       totalSpent: totalSpent[0]?.total || 0
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get real recent bookings
// const getRecentBookings = async (req, res) => {
//   try {
//     const customerId = req.user.id;
//     const limit = parseInt(req.query.limit) || 10;

//     const bookings = await Booking.find({ customer: customerId })
//       .populate('customer', 'name email')
//       .sort({ createdAt: -1 })
//       .limit(limit);

//     const formattedBookings = bookings.map(booking => ({
//       id: booking._id.toString(),
//       from: booking.pickupAddress,
//       to: booking.deliveryAddress,
//       status: booking.status,
//       date: booking.createdAt.toISOString().split('T')[0],
//       amount: booking.fare,
//       progress: booking.status === 'Delivered' ? 100 :
//         booking.status === 'In Transit' ? 75 : 0
//     }));

//     res.json(formattedBookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get user's own bookings
// const getUserBookings = async (req, res) => {
//   try {
//     const customerId = req.user.id;
//     const bookings = await Booking.find({ customer: customerId })
//       .populate('customer', 'name email')
//       .sort({ createdAt: -1 });

//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Calculate real fare
// const calculateFare = async (req, res) => {
//   try {
//     const { distance, weight, transportMode } = req.body;

//     if (!distance || !weight || !transportMode) {
//       return res.status(400).json({ message: 'Missing required parameters' });
//     }

//     const baseRate = transportMode === 'truck' ? 2.5 : 1.8;
//     const weightRate = 0.15;
//     const baseFare = 50;

//     const calculatedFare = baseFare + (distance * baseRate) + (parseFloat(weight) * weightRate);

//     res.json({ fare: calculatedFare });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create new booking
// const createBooking = async (req, res) => {
//   try {
//     const bookingData = {
//       ...req.body,
//       customer: req.user.id,
//       status: 'Pending'
//     };

//     const booking = new Booking(bookingData);
//     await booking.save();

//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all bookings for admin
// const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate('customer', 'name email')
//       .populate('dispatcher', 'name email')
//       .sort({ createdAt: -1 });

//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Assign dispatcher
// const assignDispatcher = async (req, res) => {
//   try {
//     const { bookingId, dispatcherId } = req.body;

//     const booking = await Booking.findByIdAndUpdate(
//       bookingId,
//       { dispatcher: dispatcherId },
//       { new: true }
//     );

//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update booking status
// const updateStatus = async (req, res) => {
//   try {
//     const { bookingId, status } = req.body;

//     const booking = await Booking.findByIdAndUpdate(
//       bookingId,
//       {
//         status,
//         $push: { history: { status, timestamp: new Date() } }
//       },
//       { new: true }
//     );

//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get booking history
// const getBookingHistory = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId)
//       .populate('customer', 'name email')
//       .populate('dispatcher', 'name email');

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getBookingStats,
//   getRecentBookings,
//   getUserBookings,
//   calculateFare,
//   createBooking,
//   getAllBookings,
//   assignDispatcher,
//   updateStatus,
//   getBookingHistory
// };













const Booking = require('../models/Booking');
const User = require('../models/User');
const notificationController = require('./notificationController');

// Get real booking stats for dashboard
const getBookingStats = async (req, res) => {
  try {
    const customerId = req.user.id;

    const [
      totalBookings,
      activeDeliveries,
      completedDeliveries,
      totalSpent
    ] = await Promise.all([
      Booking.countDocuments({ customer: customerId }),
      Booking.countDocuments({ customer: customerId, status: 'In Transit' }),
      Booking.countDocuments({ customer: customerId, status: 'Delivered' }),
      Booking.aggregate([
        { $match: { customer: customerId } },
        { $group: { _id: null, total: { $sum: '$fare' } } }
      ])
    ]);

    res.json({
      totalBookings,
      activeDeliveries: activeDeliveries || 0,
      completedDeliveries: completedDeliveries || 0,
      totalSpent: totalSpent[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get real recent bookings
const getRecentBookings = async (req, res) => {
  try {
    const customerId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.find({ customer: customerId })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    const formattedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      from: booking.pickupAddress,
      to: booking.deliveryAddress,
      status: booking.status,
      date: booking.createdAt.toISOString().split('T')[0],
      amount: booking.fare,
      progress: booking.status === 'Delivered' ? 100 :
        booking.status === 'In Transit' ? 75 : 0
    }));

    res.json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's own bookings
const getUserBookings = async (req, res) => {
  try {
    const customerId = req.user.id;
    const bookings = await Booking.find({ customer: customerId })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer's bookings (for customer portal)
const getCustomerBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = { customer: req.user._id || req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('dispatcher', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Get assigned bookings (for dispatcher portal)
const getAssignedBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = { dispatcher: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
  } catch (error) {
    console.error('Get assigned bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assigned bookings' });
  }
};

// Get a specific assigned booking
const getAssignedBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      dispatcher: req.user._id
    }).populate('customer', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get assigned booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

// Calculate real fare
const calculateFare = async (req, res) => {
  try {
    const { distance, weight, transportMode } = req.body;

    if (!distance || !weight || !transportMode) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const baseRate = transportMode === 'truck' ? 2.5 : 1.8;
    const weightRate = 0.15;
    const baseFare = 50;

    const calculatedFare = baseFare + (distance * baseRate) + (parseFloat(weight) * weightRate);

    res.json({ fare: calculatedFare });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  // Debug: log customer value used
  console.log('Customer value for booking:', req.user._id || req.user.id);
  // Debug: log incoming payload and user
  console.log('Booking payload:', req.body);
  console.log('Authenticated user:', req.user);
  try {
    const {
      pickupAddress,
      deliveryAddress,
      distance,
      weight,
      modeOfTransport,
      fare
    } = req.body;

    if (!pickupAddress || !deliveryAddress || !distance || !weight || !modeOfTransport || !fare) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const booking = new Booking({
      customer: req.user._id || req.user.id,
      pickupAddress,
      deliveryAddress,
      distance: parseFloat(distance),
      weight: parseFloat(weight),
      modeOfTransport,
      fare: parseFloat(fare),
      status: 'Pending',
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      productType: req.body.productType,
      dimensions: req.body.dimensions,
      pickupDate: req.body.pickupDate,
      specialInstructions: req.body.specialInstructions
    });

    await booking.save();

    // Populate customer info for notification
    await booking.populate('customer', 'name email');

    // Send notifications
    await notificationController.notifyBookingCreated(booking);

    res.status(201).json({
      success: true,
      booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

// Get a specific booking
const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user._id
    }).populate('dispatcher', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, customer: req.user._id, status: 'Pending' },
      { status: 'Cancelled' },
      { new: true }
    ).populate('customer', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or cannot be cancelled' });
    }

    // Send notification about cancellation
    await notificationController.notifyStatusUpdate(booking, 'Pending', 'Cancelled');

    res.json({
      success: true,
      booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
};

// Update booking status (for dispatchers)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, notes } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: 'Booking ID and status are required' });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      dispatcher: req.user._id
    }).populate('customer', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    if (notes) {
      booking.notes = notes;
    }

    await booking.save();

    // Send notification about status change
    await notificationController.notifyStatusUpdate(booking, oldStatus, status);

    res.json({
      success: true,
      booking,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
};

// Schedule a booking
const scheduleBooking = async (req, res) => {
  try {
    const { bookingId, scheduledDate, estimatedDelivery } = req.body;

    if (!bookingId || !scheduledDate || !estimatedDelivery) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, dispatcher: req.user._id },
      {
        scheduledDate: new Date(scheduledDate),
        estimatedDelivery: new Date(estimatedDelivery),
        status: 'Scheduled'
      },
      { new: true }
    ).populate('customer', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Send notification about scheduling
    await notificationController.notifyStatusUpdate(booking, 'Pending', 'Scheduled');

    res.json({
      success: true,
      booking,
      message: 'Booking scheduled successfully'
    });
  } catch (error) {
    console.error('Schedule booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule booking' });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
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
    console.error('Get all bookings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Assign dispatcher to booking
const assignDispatcher = async (req, res) => {
  try {
    const { bookingId, dispatcherId } = req.body;

    if (!bookingId || !dispatcherId) {
      return res.status(400).json({ success: false, message: 'Booking ID and dispatcher ID are required' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { dispatcher: dispatcherId },
      { new: true }
    ).populate('customer', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const dispatcher = await User.findById(dispatcherId);
    if (!dispatcher) {
      return res.status(404).json({ success: false, message: 'Dispatcher not found' });
    }

    // Send notifications
    await notificationController.notifyDispatcherAssigned(booking, dispatcher);

    res.json({
      success: true,
      booking,
      message: 'Dispatcher assigned successfully'
    });
  } catch (err) {
    console.error('Assign dispatcher error:', err);
    res.status(500).json({ success: false, message: 'Failed to assign dispatcher' });
  }
};

// Update booking status (admin)
const updateStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: 'Booking ID and status are required' });
    }

    const booking = await Booking.findById(bookingId).populate('customer', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Send notification about status change
    await notificationController.notifyStatusUpdate(booking, oldStatus, status);

    res.json({
      success: true,
      booking,
      message: 'Booking status updated successfully'
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
};

// Get booking history
const getBookingHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email')
      .populate('dispatcher', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (err) {
    console.error('Get booking history error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch booking history' });
  }
};

module.exports = {
  getBookingStats,
  getRecentBookings,
  getUserBookings,
  getCustomerBookings,
  getAssignedBookings,
  getAssignedBooking,
  calculateFare,
  createBooking,
  getBooking,
  cancelBooking,
  updateBookingStatus,
  scheduleBooking,
  getAllBookings,
  assignDispatcher,
  updateStatus,
  getBookingHistory
};