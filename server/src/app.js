import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import numerologyRoutes from "./routes/numerologyRoutes.js";
import adminGridContentRoutes from "./routes/adminGridContentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import "./config/loadEnv.js";

const app = express();
const normalizeOrigin = (value) => value?.trim().replace(/\/$/, "");
const configuredOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://numoro-1.onrender.com",
  normalizeOrigin(process.env.CLIENT_URL),
  ...configuredOrigins
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (no Origin header)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/numerology", numerologyRoutes);
app.use("/api/v1/admin", adminGridContentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
