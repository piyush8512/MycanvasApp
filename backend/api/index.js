import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../src/routes/user.routes.js";
import folderRoutes from "../src/routes/folder.routes.js";
import canvasRoutes from "../src/routes/canvas.routes.js";
import storageRoutes from "../src/routes/storage.routes.js";
import friendRoutes from "../src/routes/friend.routes.js";
import sharingRoutes from "../src/routes/sharing.routes.js";

dotenv.config();

const app = express();

const EXTENSION_ID = 'ajfafhdnmjahkkdkefjlpcclpjobmend';

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    `chrome-extension://${EXTENSION_ID}`,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean),
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: "Canvas API is running on Vercel!",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/canvas", canvasRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/sharing', sharingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found",
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    success: false,
    error: err.message
  });
});

// Export for Vercel (no app.listen!)
export default app;