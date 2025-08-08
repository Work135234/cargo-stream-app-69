const PricingRule = require('../models/PricingRule');
const axios = require('axios');

/**
 * Calculate distance using OpenCage Geocoding API and Haversine formula
 * @param {string} origin - Origin address
 * @param {string} destination - Destination address
 * @returns {Promise<number>} - Distance in kilometers
 */
async function calculateDistance(origin, destination) {
  try {
    // Geocode origin address
    const originResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        q: origin,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1
      }
    });

    // Geocode destination address
    const destinationResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        q: destination,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1
      }
    });

    if (originResponse.data.results.length === 0 || destinationResponse.data.results.length === 0) {
      throw new Error('Unable to geocode one or both addresses');
    }

    const originCoords = originResponse.data.results[0].geometry;
    const destinationCoords = destinationResponse.data.results[0].geometry;

    // Calculate distance using Haversine formula
    const distance = haversineDistance(
      originCoords.lat,
      originCoords.lng,
      destinationCoords.lat,
      destinationCoords.lng
    );

    return distance;
  } catch (error) {
    console.error('OpenCage API error:', error);
    throw new Error('Failed to calculate distance');
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

/**
 * Calculates fare based on pricing rules, addresses, weight, and mode of transport
 * @param {string} origin - Pickup address
 * @param {string} destination - Delivery address
 * @param {number} weight - Product weight in kilograms
 * @param {string} modeOfTransport - Mode of transport (e.g., 'train', 'truck')
 * @returns {Promise<Object>} - Calculated fare and distance
 */
async function calculateFare(origin, destination, weight, modeOfTransport) {
  try {
    // Get pricing rule for the mode of transport
    const rule = await PricingRule.findOne({ modeOfTransport, isActive: true });
    if (!rule) {
      throw new Error('No pricing rule found for this mode of transport');
    }

    // Calculate distance using OpenCage API
    const distance = await calculateDistance(origin, destination);

    // Calculate fare based on pricing rule
    const fare = rule.baseFare + (rule.perKmRate * distance) + (rule.perKgRate * weight);

    return {
      fare: Math.round(fare * 100) / 100, // Round to 2 decimal places
      distance: Math.round(distance * 100) / 100,
      breakdown: {
        baseFare: rule.baseFare,
        distanceCost: rule.perKmRate * distance,
        weightCost: rule.perKgRate * weight,
        totalDistance: distance
      }
    };
  } catch (error) {
    console.error('Fare calculation error:', error);
    throw error;
  }
}

module.exports = calculateFare;
