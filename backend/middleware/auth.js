const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is deactivated' });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token is not valid' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    
    res.status(500).json({ error: 'Server error in authentication' });
  }
};

// Middleware to check if user has specific role (for future role-based access)
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // For now, all users have the same access level
      // This can be extended later for admin/user roles
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ error: 'Server error in role verification' });
    }
  };
};

// Middleware to validate request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    next();
  };
};

// Middleware to rate limit specific routes
const createRateLimit = (windowMs, maxRequests) => {
  return (req, res, next) => {
    // This is a simple in-memory rate limiter
    // In production, use Redis or a proper rate limiting library
    const key = `${req.ip}:${req.route.path}`;
    const now = Date.now();
    
    if (!global.rateLimitStore) {
      global.rateLimitStore = new Map();
    }
    
    const requests = global.rateLimitStore.get(key) || [];
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        retryAfter: Math.ceil(windowMs / 1000) 
      });
    }
    
    validRequests.push(now);
    global.rateLimitStore.set(key, validRequests);
    next();
  };
};

module.exports = {
  auth,
  requireRole,
  validateRequest,
  createRateLimit
};
