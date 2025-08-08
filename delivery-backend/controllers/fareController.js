const calculateFare = require('../utils/calculateFare');

exports.getFare = async (req, res) => {
  try {
    const { origin, destination, weight, modeOfTransport } = req.body;

    if (!origin || !destination || weight == null || !modeOfTransport) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: origin, destination, weight, modeOfTransport'
      });
    }

    const fareData = await calculateFare(origin, destination, weight, modeOfTransport);

    res.json({
      success: true,
      ...fareData
    });
  } catch (err) {
    console.error('Fare calculation error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to calculate fare'
    });
  }
};
