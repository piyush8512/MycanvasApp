// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { clerkClient } from '@clerk/clerk-sdk-node';
// import prisma from "./config/prisma.js";
// import { requireAuth, optionalAuth } from "./middleware/clerkAuth.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());

// // ============================================
// // PUBLIC ROUTES
// // ============================================

// // Health Check
// app.get("/health", (req, res) => {
//   res.json({ 
//     status: "OK", 
//     message: "Server is running",
//     timestamp: new Date().toISOString()
//   });
// });

// // Test Supabase Connection
// app.get("/api/test-connection", async (req, res) => {
//   try {
//     await prisma.$queryRaw`SELECT 1`;
//     const userCount = await prisma.user.count();
    
//     res.json({ 
//       success: true,
//       message: "✅ Successfully connected to Supabase!",
//       userCount: userCount,
//       timestamp: new Date().toISOString()
//     });
//   } catch (err) {
//     console.error("❌ Database connection error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to connect to Supabase",
//       error: err.message 
//     });
//   }
// });

// // ============================================
// // CLERK + SUPABASE SYNC ROUTES (PROTECTED)
// // ============================================

// // Get or Create Current User (Sync Clerk with Supabase)
// app.get("/api/me", requireAuth, async (req, res) => {
//   try {
//     const clerkUserId = req.auth.userId;
//     const clerkUser = req.clerkUser;

//     // Check if user exists in Supabase
//     let dbUser = await prisma.user.findUnique({
//       where: { clerkId: clerkUserId },
//     });

//     // If user doesn't exist in database, create them
//     if (!dbUser) {
//       const primaryEmail = clerkUser.emailAddresses.find(
//         (email) => email.id === clerkUser.primaryEmailAddressId
//       );

//       dbUser = await prisma.user.create({
//         data: {
//           clerkId: clerkUserId,
//           email: primaryEmail?.emailAddress || '',
//           name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
//         },
//       });

//       console.log('✅ New user synced to Supabase:', dbUser.email);
//     }

//     res.json({ 
//       success: true,
//       message: "User data retrieved successfully",
//       user: {
//         // Clerk data
//         clerk: {
//           id: clerkUser.id,
//           firstName: clerkUser.firstName,
//           lastName: clerkUser.lastName,
//           email: clerkUser.emailAddresses[0]?.emailAddress,
//           imageUrl: clerkUser.imageUrl,
//           createdAt: clerkUser.createdAt,
//         },
//         // Supabase data
//         database: dbUser
//       }
//     });
//   } catch (err) {
//     console.error("❌ /api/me error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to get user data",
//       error: err.message 
//     });
//   }
// });

// // Update User Profile
// app.put("/api/me", requireAuth, async (req, res) => {
//   try {
//     const clerkUserId = req.auth.userId;
//     const { name, email } = req.body;

//     // Update in Supabase
//     const updatedUser = await prisma.user.update({
//       where: { clerkId: clerkUserId },
//       data: {
//         ...(name && { name }),
//         ...(email && { email }),
//       },
//     });

//     res.json({ 
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser 
//     });
//   } catch (err) {
//     console.error("❌ Update profile error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to update profile",
//       error: err.message 
//     });
//   }
// });

// // Get All Users (Admin route - protected)
// app.get("/api/users", requireAuth, async (req, res) => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         clerkId: true,
//         email: true,
//         name: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     res.json({ 
//       success: true,
//       count: users.length,
//       users: users 
//     });
//   } catch (err) {
//     console.error("❌ Get users error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch users",
//       error: err.message 
//     });
//   }
// });

// // Webhook endpoint for Clerk events (optional but recommended)
// app.post("/api/webhooks/clerk", express.raw({ type: 'application/json' }), async (req, res) => {
//   try {
//     // Parse the webhook payload
//     const evt = req.body;

//     // Handle different event types
//     switch (evt.type) {
//       case 'user.created':
//         // Sync new user to database
//         const user = evt.data;
//         const primaryEmail = user.email_addresses.find(
//           (email) => email.id === user.primary_email_address_id
//         );

//         await prisma.user.create({
//           data: {
//             clerkId: user.id,
//             email: primaryEmail?.email_address || '',
//             name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || null,
//           },
//         });
//         console.log('✅ User created via webhook:', primaryEmail?.email_address);
//         break;

//       case 'user.updated':
//         // Update user in database
//         const updatedUser = evt.data;
//         const updatedEmail = updatedUser.email_addresses.find(
//           (email) => email.id === updatedUser.primary_email_address_id
//         );

//         await prisma.user.update({
//           where: { clerkId: updatedUser.id },
//           data: {
//             email: updatedEmail?.email_address || '',
//             name: `${updatedUser.first_name || ''} ${updatedUser.last_name || ''}`.trim() || null,
//           },
//         });
//         console.log('✅ User updated via webhook');
//         break;

//       case 'user.deleted':
//         // Delete user from database
//         await prisma.user.delete({
//           where: { clerkId: evt.data.id },
//         });
//         console.log('✅ User deleted via webhook');
//         break;
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error('❌ Webhook error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: err.message 
//     });
//   }
// });

// // ============================================
// // TEST ROUTES (Remove in production)
// // ============================================

// // Create Test User (without Clerk auth)
// app.post("/api/test-create-user", async (req, res) => {
//   try {
//     const { clerkId, email, name } = req.body;

//     if (!clerkId || !email) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "clerkId and email are required" 
//       });
//     }

//     let dbUser = await prisma.user.findUnique({
//       where: { clerkId: clerkId },
//     });

//     if (dbUser) {
//       return res.json({ 
//         success: true,
//         message: "User already exists",
//         user: dbUser 
//       });
//     }

//     dbUser = await prisma.user.create({
//       data: {
//         clerkId: clerkId,
//         email: email,
//         name: name || null,
//       },
//     });

//     res.status(201).json({ 
//       success: true,
//       message: "✅ User created successfully",
//       user: dbUser 
//     });
//   } catch (err) {
//     console.error("❌ Create user error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to create user",
//       error: err.message 
//     });
//   }
// });

// // Get All Users (without auth - testing only)
// app.get("/api/test-get-users", async (req, res) => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         clerkId: true,
//         email: true,
//         name: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     res.json({ 
//       success: true,
//       count: users.length,
//       users: users 
//     });
//   } catch (err) {
//     console.error("❌ Get users error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch users",
//       error: err.message 
//     });
//   }
// });

// // ============================================
// // 404 Handler
// // ============================================
// app.use((req, res) => {
//   res.status(404).json({ 
//     success: false,
//     message: "Route not found" 
//   });
// });

// // ============================================
// // Start Server
// // ============================================
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

// // Graceful shutdown
// const shutdown = async () => {
//   console.log('\n🛑 Shutting down gracefully...');
//   await prisma.$disconnect();
//   process.exit(0);
// };

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.use("/api/users", userRoutes);



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
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 Protected Endpoints (require Clerk token):`);
  console.log(`   GET  http://localhost:${PORT}/api/me`);
  console.log(`   PUT  http://localhost:${PORT}/api/me`);
  console.log(`   GET  http://localhost:${PORT}/api/users`);
  console.log(`\n📋 Public/Test Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/test-connection`);
  console.log(`   POST http://localhost:${PORT}/api/test-create-user`);
  console.log(`   GET  http://localhost:${PORT}/api/test-get-users\n`);
});
