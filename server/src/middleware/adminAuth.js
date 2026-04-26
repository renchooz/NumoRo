export const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";

  // Basic/hardcoded auth for now (frontend stores token in localStorage).
  if (token !== "admin-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

