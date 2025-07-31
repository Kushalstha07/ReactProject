export const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.user || !req.user.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Check if user has admin role
    if (req.user.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const requireAdminOrOwner = (req, res, next) => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.params.id || req.user.user.id;
    const isAdmin = req.user.user.role === 'admin';
    const isOwner = req.user.user.id == userId;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
