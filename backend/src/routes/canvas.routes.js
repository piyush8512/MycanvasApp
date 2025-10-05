import { Router } from "express";

const router = Router();
//folderroutes
router.route('/').post(testCreateUser); //Create a new folder in a canvas
router.route('/:id').get(tfileController.getFileById);//:id - Get specific file
router.route('/:id').put(testCreateUser); //Rename file or change position
router.route('/:id').delete(testCreateUser); //Delete file and contained items
router.route('/').get(fileController.getAllFiles);// Get all user's files (optionally filtered by folderId)
router.route('/:id/share').post(sharefolder); // Share file with user
router.route('/:id/collaborators/:collaboratorId').delete(folderController.removeCollaborator);

export default router;





