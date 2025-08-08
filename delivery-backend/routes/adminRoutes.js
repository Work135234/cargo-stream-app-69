const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All admin routes require Admin role
router.use(auth, role('Admin'));

// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Pricing Rules Management
router.get('/pricing-rules', adminController.getAllPricingRules);
router.post('/pricing-rules', adminController.createPricingRule);
router.put('/pricing-rules/:ruleId', adminController.updatePricingRule);
router.delete('/pricing-rules/:ruleId', adminController.deletePricingRule);



// Booking Management
router.get('/bookings', adminController.getAllBookings);

// Reports
router.get('/reports', adminController.generateReport);

// PATCH /api/admin/pricing-rules/:id/toggle
router.patch('/pricing-rules/:id/toggle', adminController.toggleRuleActive);

module.exports = router;
