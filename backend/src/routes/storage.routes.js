import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth.js"; // Adjust this path if needed
import {
  getSignedUploadUrl,
  getPublicUrl,
  deleteFile, // 1. Import the new delete controller
} from "../controllers/storage.controller.js";

const router = Router();

// POST /api/storage/signed-url
// Gets a secure, one-time URL to upload a file to.
router.route("/signed-url").post(requireAuth, getSignedUploadUrl);

// POST /api/storage/public-url
// Gets the permanent public URL of the file after a successful upload.
router.route("/public-url").post(requireAuth, getPublicUrl);

// --- UPDATED DELETE ROUTE ---
// We use a POST route for delete so we can pass the 'path' in the body
// (DELETE request bodies are sometimes tricky)
router.route("/delete").post(requireAuth, deleteFile);
// --- END UPDATE ---

export default router;

