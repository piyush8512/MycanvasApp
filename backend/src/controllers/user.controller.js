
import prisma from "../config/prisma.js";
import { clerkClient } from '@clerk/clerk-sdk-node';


export const healthCheck = (req, res) => {  
    res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
};

export const testconnection = async (req, res) => {
      try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    
    res.json({ 
      success: true,
      message: "✅ Successfully connected to Supabase!",
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to connect to Supabase",
      error: err.message 
    });
  }
};

export const getOrCreateCurrentUser = async (req, res) => 
{   try {
    const clerkUserId = req.auth.userId;
    const clerkUser = req.clerkUser;

    // Check if user exists in Supabase
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    // If user doesn't exist in database, create them
    if (!dbUser) {
      const primaryEmail = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      );

      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: primaryEmail?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        },
      });

      console.log('✅ New user synced to Supabase:', dbUser.email);
    }

    res.json({ 
      success: true,
      message: "User data retrieved successfully",
      user: {
        // Clerk data
        clerk: {
          id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          imageUrl: clerkUser.imageUrl,
          createdAt: clerkUser.createdAt,
        },
        // Supabase data
        database: dbUser
      }
    });
  } catch (err) {
    console.error("❌ /api/me error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to get user data",
      error: err.message 
    });
  }
};

export const updateUserProfile = async (req, res) => {
     try {
    const clerkUserId = req.auth.userId;
    const { name, email } = req.body;

    // Update in Supabase
    const updatedUser = await prisma.user.update({
      where: { clerkId: clerkUserId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json({ 
      success: true,
      message: "Profile updated successfully",
      user: updatedUser 
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to update profile",
      error: err.message 
    });
  }
};

export const testCreateUser = async (req, res) => {
      try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "clerkId and email are required" 
      });
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (dbUser) {
      return res.json({ 
        success: true,
        message: "User already exists",
        user: dbUser 
      });
    }

    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkId,
        email: email,
        name: name || null,
      },
    });

    res.status(201).json({ 
      success: true,
      message: "✅ User created successfully",
      user: dbUser 
    });
  } catch (err) {
    console.error("❌ Create user error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to create user",
      error: err.message 
    });
  }
};




