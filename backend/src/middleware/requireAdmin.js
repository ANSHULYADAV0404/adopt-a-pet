import { verifyAuthToken } from "../utils/authToken.js";

export function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyAuthToken(token);
    req.auth = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.auth.role !== "admin") {
      return res.status(403).json({ message: "Admin access only." });
    }

    next();
  });
}

export function requireUser(req, res, next) {
  requireAuth(req, res, () => {
    if (req.auth.role !== "user") {
      return res.status(403).json({ message: "User access only." });
    }

    next();
  });
}

export function requireAdminOrUser(req, res, next) {
  requireAuth(req, res, () => {
    if (!["admin", "user"].includes(req.auth.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  });
}
