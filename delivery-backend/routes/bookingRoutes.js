const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All booking routes require authentication
router.use(auth);

// Create new booking (Customer only)
router.post('/', role('Customer'), bookingController.createBooking);

// Get user's own bookings
router.get('/my', bookingController.getUserBookings);

// Get booking stats for dashboard
router.get('/stats', bookingController.getBookingStats);

// Get recent bookings
router.get('/recent', bookingController.getRecentBookings);

// Calculate fare
router.post('/calculate-fare', bookingController.calculateFare);

// Assign dispatcher (Admin only)
router.post('/assign-dispatcher', role('Admin'), bookingController.assignDispatcher);

// Update booking status (Admin and Dispatcher)
router.post('/update-status', role(['Admin', 'Dispatcher']), bookingController.updateStatus);

// Get booking history
router.get('/history/:bookingId', bookingController.getBookingHistory);

// Get all bookings (Admin only)
router.get('/all', role('Admin'), bookingController.getAllBookings);

module.exports = router;
