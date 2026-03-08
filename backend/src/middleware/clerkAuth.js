// import { clerkClient } from '@clerk/clerk-sdk-node';

// export const requireAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'No authorization token provided'
//       });
//     }

//     const token = authHeader.replace('Bearer ', '');
//     const sessionClaims = await clerkClient.verifyToken(token);
    
//     req.auth = {
//       userId: sessionClaims.sub,
//       sessionId: sessionClaims.sid,
//     };

//     next();
//   } catch (error) {
//     console.error('Auth error:', error.message);
//     return res.status(401).json({ 
//       success: false,
//       message: 'Authentication failed',
//       error: error.message 
//     });
//   }
// };

// export const optionalAuth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.replace('Bearer ', '');
    
//     if (!token) {
//       req.auth = null;
//       req.clerkUser = null;
//       return next();
//     }

//     const sessionClaims = await clerkClient.verifyToken(token);
    
//     if (sessionClaims) {
//       const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
//       req.auth = {
//         userId: sessionClaims.sub,
//         sessionId: sessionClaims.sid,
//       };
//       req.clerkUser = clerkUser;
//     }

//     next();
//   } catch (error) {
//     console.error('Optional auth error:', error);
//     req.auth = null;
//     req.clerkUser = null;
//     next();
//   }
// };


import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/prisma.js'; // Import prisma
import { createUserWithFriendCode } from '../services/friend.service.js';

// --- Helper function to get the DB user from Clerk ID ---
async function getDbUser(clerkId) {
  if (!clerkId) return null;
  return await prisma.user.findUnique({ where: { clerkId } });
}

function getClerkPrimaryEmail(clerkUser) {
  if (!clerkUser) return null;
  const primary = clerkUser.emailAddresses?.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  );
  return primary?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || null;
}

async function ensureDbUser(clerkUserId, clerkUser) {
  let dbUser = await getDbUser(clerkUserId);
  if (dbUser) return dbUser;

  const email = getClerkPrimaryEmail(clerkUser);
  if (!email) {
    throw new Error('Authenticated Clerk user has no primary email address');
  }

  const name = `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || null;
  dbUser = await createUserWithFriendCode(clerkUserId, email, name);
  return dbUser;
}

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const sessionClaims = await clerkClient.verifyToken(token);
    
    // --- THIS IS THE FIX ---
    // 1. Fetch the full Clerk user object
    const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
    // 2. Fetch your internal database user
    const dbUser = await ensureDbUser(sessionClaims.sub, clerkUser);
    
    // 3. Attach all auth info to the request
    req.auth = {
      userId: sessionClaims.sub, // This is the Clerk ID
      sessionId: sessionClaims.sid,
    };
    req.clerkUser = clerkUser; // The full Clerk user object
    req.user = dbUser; // Your internal database user (or null)
    // --- END FIX ---

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      req.auth = null;
      req.clerkUser = null;
      req.user = null; // Add this
      return next();
    }

    const sessionClaims = await clerkClient.verifyToken(token);
    
    if (sessionClaims) {
      const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
      const dbUser = await ensureDbUser(sessionClaims.sub, clerkUser);
      
      req.auth = {
        userId: sessionClaims.sub,
        sessionId: sessionClaims.sid,
      };
      req.clerkUser = clerkUser;
      req.user = dbUser; // Add this
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    req.auth = null;
    req.clerkUser = null;
    req.user = null; // Add this
    next();
  }
};