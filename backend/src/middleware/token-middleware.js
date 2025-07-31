import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  // Skip token verification for public routes
  if (req.path === "/api/auth/login" || req.path === "/api/auth/register" || 
      (req.path === "/api/users" && req.method === "POST")) {
    return next();
  }

  // Get token from Authorization header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.secretkey);
    req.user = decoded; // Attach decoded payload to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).send({ message: "Invalid or expired token." });
  }
}
