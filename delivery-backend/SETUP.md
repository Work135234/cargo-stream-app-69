# Cargo Stream Delivery App - Environment Setup Guide

## 🚀 Quick Setup

### Step 1: Create .env File

Create a `.env` file in the `delivery-backend` directory with the following content:

```env
# =============================================================================
# CARGO STREAM DELIVERY APP - ENVIRONMENT VARIABLES
# =============================================================================

# SERVER CONFIGURATION
PORT=5000
NODE_ENV=development

# DATABASE CONFIGURATION
MONGO_URI=mongodb://localhost:27017/cargo-stream

# AUTHENTICATION & SECURITY
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# DISTANCE CALCULATION - OPENCAGE API (REQUIRED)
OPENCAGE_API_KEY=your_opencage_api_key_here

# CORS CONFIGURATION
CORS_ORIGIN=http://localhost:8080

# LOGGING & DEBUGGING
DEBUG=true
LOG_LEVEL=info

# RATE LIMITING
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 2: Get OpenCage API Key (REQUIRED for Distance Calculation)

1. **Go to OpenCage Data**: https://opencagedata.com/
2. **Sign up for a free account**
3. **Get your API key** from the dashboard
4. **Replace** `your_opencage_api_key_here` in your `.env` file with your actual API key

**Free Tier**: 2,500 requests per day (sufficient for testing and small applications)

### Step 3: Generate JWT Secret

Run this command in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and replace `your_super_secret_jwt_key_here_make_it_long_and_random` in your `.env` file.

### Step 4: Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/cargo-stream`

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cargo-stream`

## 🔧 Testing Distance Calculation

### Test the Setup

1. **Start the servers**:
   ```bash
   npm run dev:all
   ```

2. **Check backend logs** for:
   - ✅ MongoDB connected
   - ✅ Server running on port 5000
   - No OpenCage API errors

3. **Test fare calculation**:
   - Go to http://localhost:8080
   - Login as Customer
   - Use the Fare Calculator
   - Enter sample addresses:
     - **Pickup**: "123 Main St, New York, NY"
     - **Delivery**: "456 Broadway, New York, NY"

### Sample Test Addresses

Try these address pairs to test distance calculation:

| Pickup Address | Delivery Address | Expected Distance |
|----------------|------------------|-------------------|
| "123 Main St, New York, NY" | "456 Broadway, New York, NY" | ~2-5 km |
| "Times Square, New York, NY" | "Central Park, New York, NY" | ~3-6 km |
| "Eiffel Tower, Paris, France" | "Louvre Museum, Paris, France" | ~2-4 km |
| "Big Ben, London, UK" | "Buckingham Palace, London, UK" | ~1-3 km |

## 🐛 Troubleshooting

### Common Issues

1. **"No pricing rule found for this mode of transport"**
   - **Solution**: Add pricing rules via Admin Dashboard
   - Go to Admin → Pricing Rules
   - Add rules for "train" and "truck" modes

2. **"Failed to calculate distance"**
   - **Check**: OpenCage API key is correct
   - **Check**: API key has remaining requests
   - **Check**: Addresses are valid and complete

3. **"MongoDB connection error"**
   - **Check**: MongoDB is running
   - **Check**: MONGO_URI is correct
   - **Check**: Network connectivity

4. **"JWT Secret not set"**
   - **Solution**: Generate and set JWT_SECRET in .env

### Debug Mode

Enable debug logging by setting in `.env`:
```env
DEBUG=true
LOG_LEVEL=debug
```

This will show detailed logs including:
- API requests to OpenCage
- Distance calculation steps
- Database operations

## 📊 Monitoring API Usage

### OpenCage API Limits
- **Free Tier**: 2,500 requests/day
- **Check Usage**: Visit your OpenCage dashboard
- **Upgrade**: If you need more requests

### Check API Response
The distance calculation will return:
```json
{
  "fare": 25.50,
  "distance": 12.5,
  "breakdown": {
    "baseFare": 10,
    "distanceCost": 12.5,
    "weightCost": 3,
    "totalDistance": 12.5
  }
}
```

## 🔒 Security Notes

1. **Never commit .env file** to version control
2. **Keep API keys secure** and don't share them
3. **Use strong JWT secrets** in production
4. **Rotate API keys** regularly
5. **Monitor API usage** to avoid rate limits

## 🚀 Production Setup

For production deployment:

1. **Use environment variables** from your hosting platform
2. **Set NODE_ENV=production**
3. **Use strong JWT secrets**
4. **Configure CORS** for your domain
5. **Set up monitoring** for API usage
6. **Use HTTPS** for all communications

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify all environment variables** are set
3. **Test with sample addresses** first
4. **Check OpenCage API status**: https://status.opencagedata.com/

---

**Happy coding! 🎉**
