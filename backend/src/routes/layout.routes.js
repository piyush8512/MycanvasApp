import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import {
  getCanvasLayouts,
  updateCanvasLayout,
  bulkUpdateCanvasLayouts,
  getFolderLayouts,
  updateFolderLayout,
  bulkUpdateFolderLayouts,
  deleteCanvasLayout,
} from "../controllers/layout.controller.js";

const router = Router();

// === Canvas Layout Routes ===
// GET /api/layouts/canvas - Get all canvas positions for current user
router.route("/canvas").get(requireAuth, getCanvasLayouts);

// PUT /api/layouts/canvas/bulk - Bulk update multiple canvas positions
router.route("/canvas/bulk").put(requireAuth, bulkUpdateCanvasLayouts);

// PUT /api/layouts/canvas/:fileId - Update a single canvas position
router.route("/canvas/:fileId").put(requireAuth, updateCanvasLayout);

// DELETE /api/layouts/canvas/:fileId - Delete a canvas layout (reset position)
router.route("/canvas/:fileId").delete(requireAuth, deleteCanvasLayout);

// === Folder Layout Routes ===
// GET /api/layouts/folder - Get all folder positions for current user
router.route("/folder").get(requireAuth, getFolderLayouts);

// PUT /api/layouts/folder/bulk - Bulk update multiple folder positions
router.route("/folder/bulk").put(requireAuth, bulkUpdateFolderLayouts);

// PUT /api/layouts/folder/:folderId - Update a single folder position
router.route("/folder/:folderId").put(requireAuth, updateFolderLayout);

export default router;
