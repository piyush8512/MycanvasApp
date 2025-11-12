import  prisma  from '../config/prisma.js';

function sanitizeUsername(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special chars
    .substring(0, 20); // Max 20 chars
}

//Generate friend code from name Format: @username#XXXX
export async function generateFriendCode(name) {
  const sanitized = sanitizeUsername(name);
  
  if (!sanitized || sanitized.length === 0) {
    throw new Error('Invalid name for friend code generation');
  }

  // Try to find available discriminator (0000-9999)
  for (let attempt = 0; attempt < 100; attempt++) {
    // Generate random 4-digit number
    const discriminator = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    
    const friendCode = `@${sanitized}#${discriminator}`;

    // Check if this friend code is available
    const existing = await prisma.user.findUnique({
      where: { friendCode },
    });

    if (!existing) {
      return friendCode;
    }
  }
  // If still not found after 100 attempts, throw error
  throw new Error('Unable to generate unique friend code. Please try again.');
}

//Generate friend code on user creationUses the 'name' field to generate friend code
export async function createUserWithFriendCode(clerkId, email, name) {
  try {
    // Use name as base for friend code generation
    // If no name provided, use email prefix
    const baseName = name || email.split('@')[0];
    const friendCode = await generateFriendCode(baseName);

    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
        friendCode,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user with friend code:', error);
    throw error;
  }
}

// Regenerate friend code for user  With 30-day cooldown
export async function regenerateFriendCode(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check cooldown (30 days)
    if (user.lastCodeRegeneration) {
      const daysSinceLastRegen = Math.floor(
        (Date.now() - user.lastCodeRegeneration.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastRegen < 30) {
        throw new Error(
          `You can regenerate your friend code in ${30 - daysSinceLastRegen} days`
        );
      }
    }

    // Generate new friend code
    const baseName = user.name || user.email.split('@')[0];
    const newFriendCode = await generateFriendCode(baseName);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        friendCode: newFriendCode,
        lastCodeRegeneration: new Date(),
      },
    });

    return updatedUser.friendCode;
  } catch (error) {
    console.error('Error regenerating friend code:', error);
    throw error;
  }
}

// Find user by friend code
export async function findUserByFriendCode(friendCode) {
  try {
    // Validate format: @username#1234
    const friendCodeRegex = /^@[a-z0-9]{1,20}#\d{4}$/;
    
    if (!friendCodeRegex.test(friendCode.toLowerCase())) {
      throw new Error('Invalid friend code format. Use @username#1234');
    }

    const user = await prisma.user.findUnique({
      where: { friendCode: friendCode.toLowerCase() },
      select: {
        id: true,
        name: true,
        friendCode: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found with this friend code');
    }

    return user;
  } catch (error) {
    console.error('Error finding user by friend code:', error);
    throw error;
  }
}

//  Send a friend request by friend code
export async function sendFriendRequestByCode(senderId, friendCode, message) {
  try {
    // Find user by friend code
    const receiver = await findUserByFriendCode(friendCode);

    if (senderId === receiver.id) {
      throw new Error('Cannot send friend request to yourself');
    }

    // Check if already friends
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: receiver.id },
          { userId: receiver.id, friendId: senderId },
        ],
      },
    });

    if (existingFriendship) {
      throw new Error('Already friends with this user');
    }

    // Check for existing pending request
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId: receiver.id, status: 'PENDING' },
          { senderId: receiver.id, receiverId: senderId, status: 'PENDING' },
        ],
      },
    });

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId: receiver.id,
        message,
        status: 'PENDING',
      },
      include: {
        sender: { 
          select: { 
            id: true, 
            name: true, 
            friendCode: true,
            email: true 
          } 
        },
        receiver: { 
          select: { 
            id: true, 
            name: true, 
            friendCode: true,
            email: true 
          } 
        },
      },
    });

    return friendRequest;
  } catch (error) {
    console.error('Error sending friend request by code:', error);
    throw error;
  }
}

// Accept a friend request
export async function acceptFriendRequest(requestId, userId) {
  try {
    // Get the friend request
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new Error('Unauthorized to accept this request');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Request is not pending');
    }

    // Use transaction to update request and create friendships
    const result = await prisma.$transaction(async (tx) => {
      // Update request status
      await tx.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });

      // Create bidirectional friendship
      await tx.friendship.createMany({
        data: [
          { userId: request.senderId, friendId: request.receiverId },
          { userId: request.receiverId, friendId: request.senderId },
        ],
      });

      return { success: true };
    });

    return result;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
}

//   Reject a friend request
export async function rejectFriendRequest(requestId, userId) {
  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Friend request not found');
    }

    if (request.receiverId !== userId) {
      throw new Error('Unauthorized to reject this request');
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    return { success: true };
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
}

//  Cancel a sent friend request
export async function cancelFriendRequest(requestId, userId) {
  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Friend request not found');
    }

    if (request.senderId !== userId) {
      throw new Error('Unauthorized to cancel this request');
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling friend request:', error);
    throw error;
  }
}

//  Get pending friend requests for a user
export async function getPendingRequests(userId) {
  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests;
  } catch (error) {
    console.error('Error getting pending requests:', error);
    throw error;
  }
}

//Get sent friend requests
export async function getSentRequests(userId) {
  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests;
  } catch (error) {
    console.error('Error getting sent requests:', error);
    throw error;
  }
}

// Get all friends for a user
export async function getFriends(userId) {
  try {
    const friendships = await prisma.friendship.findMany({
      where: { userId },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            friendCode: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return friendships.map(f => f.friend);
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
}

 //Remove a friend (unfriend)
export async function removeFriend(userId, friendId) {
  try {
    await prisma.$transaction([
      prisma.friendship.deleteMany({
        where: {
          userId: userId,
          friendId: friendId,
        },
      }),
      prisma.friendship.deleteMany({
        where: {
          userId: friendId,
          friendId: userId,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}





//not using for now --------------------
 // Check if two users are friends 
export async function areFriends(userId, otherUserId) {
  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        userId: userId,
        friendId: otherUserId,
      },
    });

    return !!friendship;
  } catch (error) {
    console.error('Error checking friendship:', error);
    throw error;
  }
}
 //Search users by name (for friend suggestions)
export async function searchUsers(searchTerm, currentUserId, limit = 10) {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                friendCode: {
                  contains: searchTerm.toLowerCase(),
                },
              },
            ],
          },
          {
            id: {
              not: currentUserId, // Exclude current user
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        friendCode: true,
        email: true,
      },
      take: limit,
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}