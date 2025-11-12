import express from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import {
  searchUserByFriendCode,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getPendingRequests,
  getSentRequests,
  getFriendsList,
  removeFriend,
  regenerateUserFriendCode,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.use(requireAuth);

// GET /api/friends/search?code=@john#1234
router.get("/search", searchUserByFriendCode);
// Regenerate friend code (30-day cooldown)
// POST /api/friends/regenerate-code
router.post("/regenerate-code", regenerateUserFriendCode);
// POST /api/friends/request
// Body: { friendCode: "@sarah#4242", message: "Hi!" }
router.post("/request", sendFriendRequest);

// POST /api/friends/request/:id/accept
router.post("/request/:id/accept", acceptFriendRequest);

// POST /api/friends/request/:id/reject
router.post("/request/:id/reject", rejectFriendRequest);

// DELETE /api/friends/request/:id
router.delete("/request/:id", cancelFriendRequest);

// GET /api/friends/requests/pending
router.get("/requests/pending", getPendingRequests);

// GET /api/friends/requests/sent
router.get("/requests/sent", getSentRequests);

// GET /api/friends  all friends
router.get("/", getFriendsList);

// DELETE /api/friends/:friendId
router.delete("/:friendId", removeFriend);

export default router;
