const Booking = require('../models/Booking');
const User = require('../models/User');

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
  try {
    const bookingData = {
      ...req.body,
      customer: req.user.id,
      status: 'Pending'
    };

    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('dispatcher', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign dispatcher
const assignDispatcher = async (req, res) => {
  try {
    const { bookingId, dispatcherId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { dispatcher: dispatcherId },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
const updateStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status,
        $push: { history: { status, timestamp: new Date() } }
      },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking history
const getBookingHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('customer', 'name email')
      .populate('dispatcher', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookingStats,
  getRecentBookings,
  getUserBookings,
  calculateFare,
  createBooking,
  getAllBookings,
  assignDispatcher,
  updateStatus,
  getBookingHistory
};
