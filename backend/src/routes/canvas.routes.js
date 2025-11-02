// import { Router } from "express";
// import { requireAuth } from "../middleware/clerkAuth.js";
// import { createCanvas, getAllCanvas, canvasItems,createItem ,getCanvasItems, updateItem } from "../controllers/canvas.controller.js";

// const router = Router();
// //folderroutes
// router.route('/').post(requireAuth,createCanvas); //Create a new folder in a canvas
// router.route('/').get(requireAuth,getAllCanvas); // Get all user's folders
// router.route('/:id').get(requireAuth,canvasItems);
// router.route('/:id').post(requireAuth,createItem);//get all canvas items form canvas items
// //get all canvas by folder id
// // router.route('/:id').get(requireAuth);
// // router.route('/:id').post(requireAuth,createItem);//get all canvas items form canvas items

// // router.route("/:id").get(getCanvasItems); // Get all items for a canvas
// // // POST /api/canvas/:canvasId/items
// // router.route("/:canvasId/items").post(createItem); // Create a new item on a canvas
// // PATCH /api/canvas/:canvasId/items/:itemId
// router.route("/:canvasId/items/:itemId").patch(updateItem); // Update an item

// // router.route('/:id').get(tfileController.getFileById);//:id - Get specific file
// // router.route('/:id').put(testCreateUser); //Rename file or change position
// // router.route('/:id').delete(testCreateUser); //Delete file and contained items
// // router.route('/').get(fileController.getAllFiles);// Get all user's files (optionally filtered by folderId)
// // router.route('/:id/share').post(sharefolder); // Share file with user
// // router.route('/:id/collaborators/:collaboratorId').delete(folderController.removeCollaborator);

// export default router;


// // import { Router } from "express";
// // import { createFolder, getAllFolders, getFolderById, deleteFolderById, updateFolder } from "../controllers/folder.controller.js";
// // import { requireAuth } from "../middleware/clerkAuth.js";


// // //folderroutes
// // router.route('/').post(requireAuth, createFolder); //Create a new folder in a canvas
// // router.route('/').get(requireAuth,getAllFolders); // Get all user's folders
// // router.route('/:id').get(requireAuth,getFolderById);/// get folderdetails by id
// // router.route('/:id').put(requireAuth,updateFolder); //Rename folder or change position
// // router.route('/:id').delete(requireAuth,deleteFolderById); //Delete folder and contained items

// // // router.route('/:id/share').post(sharefolder); // Share folder with user
// // // router.route('/:id/collaborators/:collaboratorId').delete(folderController.removeCollaborator);












import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth.js";
import {
  createCanvas,
  getAllCanvas,
  getCanvasDetails, // Renamed from canvasItems for clarity
  getCanvasItems,
  createItem,
  updateItem,
  deleteCanvas
} from "../controllers/canvas.controller.js";

const router = Router();

// --- Canvas (File) Routes ---
// POST /api/canvas
router.route("/").post(requireAuth, createCanvas); // Create a new canvas
// GET /api/canvas
router.route("/").get(requireAuth, getAllCanvas); // Get all user's canvases (without folder)
// GET /api/canvas/:id
router.route("/:id").get(requireAuth, getCanvasDetails); // Get a single canvas's details
router.route("/:id").delete(requireAuth,deleteCanvas );
 
// --- CanvasItem Routes ---
// GET /api/canvas/:canvasId/items
router.route("/:canvasId/items").get(requireAuth, getCanvasItems); // Get all items for a canvas
// POST /api/canvas/:canvasId/items
router.route("/:canvasId/items").post(requireAuth, createItem); // Create a new item on a canvas
// PATCH /api/canvas/:canvasId/items/:itemId
router.route("/:canvasId/items/:itemId").patch(requireAuth, updateItem); // Update an item

export default router;



