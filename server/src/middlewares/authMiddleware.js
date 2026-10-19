const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Protect routes – validates JWT from Authorization header or cookies.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Fallback: check cookie
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please log in.'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Load user (exclude password)
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return next(new ApiError(401, 'User not found or token is invalid.'));
    }

    if (!user.isActive) {
      return next(new ApiError(403, 'Your account has been deactivated.'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please refresh your session.'));
    }
    next(err);
  }
};

module.exports = { protect };
