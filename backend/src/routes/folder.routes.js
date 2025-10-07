import { Router } from "express";
import { createFolder, getAllFolders } from "../controllers/folder.controller.js";
import { requireAuth } from "../middleware/clerkAuth.js";

const router = Router();
//folderroutes
router.route('/').post(requireAuth, createFolder); //Create a new folder in a canvas
router.route('/').get(requireAuth,getAllFolders); // Get all user's folders
// router.route('/:id').get(testCreateUser);/// get folderdetails by id
// router.route('/:id').put(testCreateUser); //Rename folder or change position
// router.route('/:id').delete(testCreateUser); //Delete folder and contained items

// router.route('/:id/share').post(sharefolder); // Share folder with user
// router.route('/:id/collaborators/:collaboratorId').delete(folderController.removeCollaborator);

export default router;





