const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (roles = []) => {
  // Ensure roles is always an array (even if a single role string is passed)
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header is present and correctly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided, unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid token format, unauthorized" });
    }

    try {
      // Verify token with secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if user has the required role(s)
      if (roles.length && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access forbidden: insufficient permissions" });
      }

      next();
    } catch (error) {
      // Handle token verification errors (e.g., expired, invalid)
      return res
        .status(401)
        .json({ message: "Token is invalid or expired, unauthorized" });
    }
  };
};

module.exports = authMiddleware;
