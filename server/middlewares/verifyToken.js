import jwt from "jsonwebtoken";

// verify token (check Authorization Bearer first; if missing, fallback to Cookie: auth_token)
export function verifyToken(req, res, next) {
  let token = null;

  // 1) Authorization: Bearer xxx
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2) Cookie: auth_token=xxx
  if (!token && req.headers.cookie) {
    const m = req.headers.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/); // Todo: change to use cookie-parser middleware
    if (m) token = m[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
