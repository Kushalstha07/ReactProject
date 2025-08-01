import jwt from 'jsonwebtoken';

// Optional authentication middleware - sets req.user if token is valid, but doesn't reject if no token
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Set user if token is valid
    }
    // Continue regardless of whether token exists or is valid
    next();
  } catch (error) {
    // If token is invalid, continue without setting req.user
    next();
  }
};
