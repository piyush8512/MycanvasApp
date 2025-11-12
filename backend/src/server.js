// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import userRoutes from "./routes/user.routes.js";
// import folderRoutes from "./routes/folder.routes.js";
// import canvasRoutes from "./routes/canvas.routes.js";
// import storageRoutes from "./routes/storage.routes.js";
// import { requireAuth } from "./middleware/clerkAuth.js";


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());


// app.use("/api/users", userRoutes);
// app.use("/api/folders",folderRoutes);
// app.use("/api/canvas", canvasRoutes);
// app.use("/api/shared",userRoutes);
// app.use("/api/storage", storageRoutes);




// // 404 Handler

// app.use((req, res) => {
//   res.status(404).json({ 
//     success: false,
//     message: "Route not found" 
//   });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//   console.log(`🔐 Clerk authentication enabled`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`\n📋 Protected Endpoints (require Clerk token):`);
//   console.log(`   GET  http://localhost:${PORT}/api/me`);
//   console.log(`   PUT  http://localhost:${PORT}/api/me`);
//   console.log(`   GET  http://localhost:${PORT}/api/users`);
//   console.log(`\n📋 Public/Test Endpoints:`);
//   console.log(`   GET  http://localhost:${PORT}/health`);
//   console.log(`   GET  http://localhost:${PORT}/api/test-connection`);
//   console.log(`   POST http://localhost:${PORT}/api/test-create-user`);
//   console.log(`   GET  http://localhost:${PORT}/api/test-get-users\n`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import canvasRoutes from "./routes/canvas.routes.js";
import storageRoutes from "./routes/storage.routes.js";
import friendRoutes from "./routes/friend.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const EXTENSION_ID = 'ajfafhdnmjahkkdkefjlpcclpjobmend'; 

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    `chrome-extension://${EXTENSION_ID}` 
  ],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/folders",folderRoutes);
app.use("/api/canvas", canvasRoutes);
app.use("/api/shared",userRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/friends', friendRoutes);

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