import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import canvasRoutes from "./routes/canvas.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import sharingRoutes from "./routes/sharing.routes.js";
import layoutRoutes from "./routes/layout.routes.js";

dotenv.config();

const EXTENSION_ID = "ncnfkblfdjkfoooejokijaiehmibmlcj";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiSpecPath = path.resolve(__dirname, "../openapi.yaml");
const openApiDocument = YAML.load(openApiSpecPath);

export function createApp(options = {}) {
  const {
    includeLayoutRoutes = false,
    includeRootHealth = false,
    includeApiHealth = false,
    includeRequestTimingLogs = false,
    includeErrorHandler = false,
  } = options;

  const app = express();

  // Allow browser, extension, and deployment origins.
  const corsOptions = {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:3000",
      "https://mycanvas-app-seven.vercel.app",
      `chrome-extension://${EXTENSION_ID}`,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    ].filter(Boolean),
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get("/openapi.json", (req, res) => {
    res.json(openApiDocument);
  });

  if (includeRequestTimingLogs) {
    // Logs slow requests in production and all requests in non-production.
    app.use((req, res, next) => {
      const start = process.hrtime.bigint();

      res.on("finish", () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1_000_000;

        if (process.env.NODE_ENV !== "production" || durationMs >= 500) {
          console.log(
            `[API] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`
          );
        }
      });

      next();
    });
  }

  if (includeRootHealth) {
    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Canvas API is running on Vercel!",
        timestamp: new Date().toISOString(),
      });
    });
  }

  if (includeApiHealth) {
    app.get("/api/health", (req, res) => {
      res.status(200).send("OK");
    });
  }

  app.use("/api/users", userRoutes);
  app.use("/api/folders", folderRoutes);
  app.use("/api/canvas", canvasRoutes);
  app.use("/api/storage", storageRoutes);
  app.use("/api/friends", friendRoutes);
  app.use("/api/sharing", sharingRoutes);

  if (includeLayoutRoutes) {
    app.use("/api/layouts", layoutRoutes);
  }

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.path,
    });
  });

  if (includeErrorHandler) {
    app.use((err, res) => {
      console.error("Error:", err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
  }

  return app;
}

export default createApp;