// import {
//   generateFriendCode as generateCode,
//   findUserByFriendCode as findByCode,
//   sendFriendRequestByCode,
//   acceptFriendRequest as acceptRequest,
//   rejectFriendRequest as rejectRequest,
//   cancelFriendRequest as cancelRequest,
//   getPendingRequests as getPending,
//   getSentRequests as getSent,
//   getFriends,
//   removeFriend as unfriend,
//   regenerateFriendCode,
// } from "../services/friend.service.js";

// // SEARCH USER BY FRIEND CODE
// export const searchUserByFriendCode = async (req, res) => {
//   try {
//     const { code } = req.query;

//     if (!code) {
//       return res.status(400).json({
//         success: false,
//         message: "Friend code is required",
//       });
//     }

//     const user = await findByCode(code);

//     res.json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.name,
//         friendCode: user.friendCode,
//         email: user.email,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Search user error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // SEND FRIEND REQUEST
// export const sendFriendRequest = async (req, res) => {
//   try {
//     const { friendCode, message } = req.body;
//     const userId = req.user.id; // From requireAuth middleware

//     if (!friendCode) {
//       return res.status(400).json({
//         success: false,
//         message: "Friend code is required",
//       });
//     }

//     const friendRequest = await sendFriendRequestByCode(
//       userId,
//       friendCode,
//       message
//     );

//     res.json({
//       success: true,
//       message: "Friend request sent successfully",
//       request: friendRequest,
//     });
//   } catch (error) {
//     console.error("Send friend request error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ACCEPT FRIEND REQUEST
// export const acceptFriendRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     await acceptRequest(id, userId);

//     res.json({
//       success: true,
//       message: "Friend request accepted",
//     });
//   } catch (error) {
//     console.error("Accept friend request error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // REJECT FRIEND REQUEST
// export const rejectFriendRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     await rejectRequest(id, userId);

//     res.json({
//       success: true,
//       message: "Friend request rejected",
//     });
//   } catch (error) {
//     console.error("Reject friend request error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // CANCEL FRIEND REQUEST
// export const cancelFriendRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     await cancelRequest(id, userId);

//     res.json({
//       success: true,
//       message: "Friend request cancelled",
//     });
//   } catch (error) {
//     console.error("Cancel friend request error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET PENDING REQUESTS
// export const getPendingRequests = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const requests = await getPending(userId);
//     res.json({
//       success: true,
//       requests,
//     });
//   } catch (error) {
//     console.error("Get pending requests error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET SENT REQUESTS
// export const getSentRequests = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const requests = await getSent(userId);

//     res.json({
//       success: true,
//       requests,
//     });
//   } catch (error) {
//     console.error("Get sent requests error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET FRIENDS LIST
// export const getFriendsList = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const friends = await getFriends(userId);

//     res.json({
//       success: true,
//       friends,
//     });
//   } catch (error) {
//     console.error("Get friends error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // REMOVE FRIEND
// export const removeFriend = async (req, res) => {
//   try {
//     const { friendId } = req.params;
//     const userId = req.user.id;

//     await unfriend(userId, friendId);

//     res.json({
//       success: true,
//       message: "Friend removed successfully",
//     });
//   } catch (error) {
//     console.error("Remove friend error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // REGENERATE FRIEND CODE
// export const regenerateUserFriendCode = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const newFriendCode = await regenerateFriendCode(userId);

//     res.json({
//       success: true,
//       message: "Friend code regenerated successfully",
//       friendCode: newFriendCode,
//     });
//   } catch (error) {
//     console.error("Regenerate friend code error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import {
  findUserByFriendCode as findByCode,
  sendFriendRequestByCode,
  acceptFriendRequest as acceptRequest,
  rejectFriendRequest as rejectRequest,
  cancelFriendRequest as cancelRequest,
  getPendingRequests as getPending,
  getSentRequests as getSent,
  getFriends,
  removeFriend as unfriend,
  regenerateFriendCode,
} from "../services/friend.service.js";
import prisma from "../config/prisma.js"; // Import prisma

// --- Helper function to get the DB user from Clerk ID ---
async function getDbUser(clerkId) {
  if (!clerkId) return null;
  return await prisma.user.findUnique({ where: { clerkId } });
}

// SEARCH USER BY FRIEND CODE
export const searchUserByFriendCode = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Friend code is required",
      });
    }

    const user = await findByCode(code);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        friendCode: user.friendCode,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Search user error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
  try {
    const { friendCode, message } = req.body;
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---

    if (!friendCode) {
      return res.status(400).json({
        success: false,
        message: "Friend code is required",
      });
    }

    const friendRequest = await sendFriendRequestByCode(
      userId,
      friendCode,
      message
    );

    res.json({
      success: true,
      message: "Friend request sent successfully",
      request: friendRequest,
    });
  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ACCEPT FRIEND REQUEST
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---

    await acceptRequest(id, userId);

    res.json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    console.error("Accept friend request error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// REJECT FRIEND REQUEST
export const rejectFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---

    await rejectRequest(id, userId);

    res.json({
      success: true,
      message: "Friend request rejected",
    });
  } catch (error) {
    console.error("Reject friend request error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// CANCEL FRIEND REQUEST
export const cancelFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---

    await cancelRequest(id, userId);

    res.json({
      success: true,
      message: "Friend request cancelled",
    });
  } catch (error) {
    console.error("Cancel friend request error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PENDING REQUESTS
export const getPendingRequests = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id; // This line was: const userId = req.user.id;
    // --- END FIX ---

    const requests = await getPending(userId);
    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get pending requests error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SENT REQUESTS
export const getSentRequests = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id; // This line was: const userId = req.user.id;
    // --- END FIX ---

    const requests = await getSent(userId);

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get sent requests error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET FRIENDS LIST
export const getFriendsList = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id; // This line was: const userId = req.user.id;
    // --- END FIX ---

    const friends = await getFriends(userId);

    res.json({
      success: true,
      friends,
    });
  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE FRIEND
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---

    await unfriend(userId, friendId);

    res.json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// REGENERATE FRIEND CODE
export const regenerateUserFriendCode = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---

    const newFriendCode = await regenerateFriendCode(userId);

    res.json({
      success: true,
      message: "Friend code regenerated successfully",
      friendCode: newFriendCode,
    });
  } catch (error) {
    console.error("Regenerate friend code error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};