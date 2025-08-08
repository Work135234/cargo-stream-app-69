const express = require('express');
const router = express.Router();
const fareController = require('../controllers/fareController');
const auth = require('../middleware/authMiddleware');

// Calculate fare (protected route)
router.post('/calculate', auth, fareController.getFare);

module.exports = router;
