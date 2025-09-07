export function verifyRole(requiredRole) {

  // unify the data type of requiredRole as an array
  const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
