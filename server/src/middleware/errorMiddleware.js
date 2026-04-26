export const notFound = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, _req, res, _next) => {
  // If a handler already set a statusCode, keep it; otherwise allow thrown errors
  // to optionally carry a statusCode (basic pattern used across this repo).
  // eslint-disable-next-line no-unsafe-optional-chaining
  const fromError = typeof err?.statusCode === "number" ? err.statusCode : undefined;
  const statusCode =
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : undefined) ??
    fromError ??
    500;
  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
};
