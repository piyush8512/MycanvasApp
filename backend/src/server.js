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
// Make sure this is imported if you use it in other routes
// import { requireAuth } from "./middleware/clerkAuth.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- THIS IS THE CRITICAL FIX ---
// 1. Get your Extension ID from chrome://extensions (Developer mode)
//    I am using the ID from your previous logs: 'jlgedciogpkojlojkgmdamhaomdofkan'
//    !! IMPORTANT: Replace this if your ID is different !!
const EXTENSION_ID = 'ajfafhdnmjahkkdkefjlpcclpjobmend'; 

// 2. Add your extension's origin to the whitelist
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', // Your React Native app
    'http://localhost:3000', // Your Next.js login app
    `chrome-extension://${EXTENSION_ID}` // Allow your extension
  ],
  credentials: true
};

app.use(cors(corsOptions)); // 3. Use the new options
// --- END FIX ---

app.use(express.json());

// Your existing routes
app.use("/api/users", userRoutes);
app.use("/api/folders",folderRoutes);
app.use("/api/canvas", canvasRoutes);
app.use("/api/shared",userRoutes);
app.use('/api/storage', storageRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Clerk authentication enabled`);
});