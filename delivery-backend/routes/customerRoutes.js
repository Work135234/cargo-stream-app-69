const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All customer routes require Customer role
router.use(auth, role('Customer'));

// Get customer's bookings
router.get('/bookings', bookingController.getCustomerBookings);

// Create a new booking
router.post('/bookings', bookingController.createBooking);

// Get a specific booking
router.get('/bookings/:bookingId', bookingController.getBooking);

// Cancel a booking
router.patch('/bookings/:bookingId/cancel', bookingController.cancelBooking);

module.exports = router;