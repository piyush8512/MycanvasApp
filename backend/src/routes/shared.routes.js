import { Router } from "express";

const router = Router();


router.route('/').get(fileController.getAllFiles);// Get all user's files  or folder shared wioth me 

router.route('/:id/share').get(sharedController.getSharedByMe); //shared by me 

export default router;





