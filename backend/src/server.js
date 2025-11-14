import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import canvasRoutes from "./routes/canvas.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import sharingRoutes from "./routes/sharing.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// This is your Extension ID from your manifest.json
const EXTENSION_ID = 'ajfafhdnmjahkkdkefjlpcclpjobmend'; 

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', // Your React Native app
    'http://localhost:3000', // Your Next.js login app
    `chrome-extension://${EXTENSION_ID}` // Your Chrome Extension
  ],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/canvas", canvasRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/friends', friendRoutes);

// --- FIX: Added the leading "/" ---
app.use('/api/sharing', sharingRoutes);
// --- END FIX ---

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Clerk authentication enabled`);
});


// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';

// // Import routes
// import userRoutes from './routes/user.routes.js';
// import folderRoutes from './routes/folder.routes.js';
// import canvasRoutes from './routes/canvas.routes.js';
// import storageRoutes from './routes/storage.routes.js';
// import sharingRoutes from './routes/sharing.routes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/folders', folderRoutes);
// app.use('/api/canvas', canvasRoutes);
// app.use('/api/storage', storageRoutes);
// app.use('/api/sharing', sharingRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import userRoutes from "./routes/user.routes.js";
// import folderRoutes from "./routes/folder.routes.js";
// import canvasRoutes from "./routes/canvas.routes.js";
// import storageRoutes from "./routes/storage.routes.js";
// import friendRoutes from "./routes/friend.routes.js";
// import sharingRoutes from "./routes/sharing.routes.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// const EXTENSION_ID = 'ajfafhdnmjahkkdkefjlpcclpjobmend'; 

// const corsOptions = {
//   origin: [
//     process.env.FRONTEND_URL || 'http://localhost:5173',
//     'http://localhost:3000',
//     `chrome-extension://${EXTENSION_ID}` 
//   ],
//   credentials: true
// };

// app.use(cors(corsOptions));

// app.use(express.json());

// app.use("/api/users", userRoutes);
// app.use("/api/folders",folderRoutes);
// app.use("/api/canvas", canvasRoutes);
// app.use("/api/shared",userRoutes);
// app.use('/api/storage', storageRoutes);
// app.use('/api/friends', friendRoutes);
// app.use('/api/sharing', sharingRoutes);

// app.use((req, res) => {
//   res.status(404).json({ 
//     success: false,
//     message: "Route not found" 
//   });
// });

// app.listen(PORT, () => {
//   console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//   console.log(`🔐 Clerk authentication enabled`);
// });