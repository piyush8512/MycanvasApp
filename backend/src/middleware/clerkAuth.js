import { clerkClient } from '@clerk/clerk-sdk-node';

export const requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No authorization token provided' 
      });
    }

    // Verify the session token with Clerk
    const sessionClaims = await clerkClient.verifyToken(token);
    
    if (!sessionClaims) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    // Get full user data from Clerk
    const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
    
    // Attach user info to request
    req.auth = {
      userId: sessionClaims.sub,
      sessionId: sessionClaims.sid,
    };
    req.clerkUser = clerkUser;

    next();
  } catch (error) {
    console.error('Auth error:', error);
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
      return next();
    }

    const sessionClaims = await clerkClient.verifyToken(token);
    
    if (sessionClaims) {
      const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
      req.auth = {
        userId: sessionClaims.sub,
        sessionId: sessionClaims.sid,
      };
      req.clerkUser = clerkUser;
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    req.auth = null;
    req.clerkUser = null;
    next();
  }
};