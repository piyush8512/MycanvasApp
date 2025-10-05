import { Router } from "express";

const router = Router();


router.route('/activities').get(fileController.getAllFiles);// Get recent activities

router.route('/accessed').get(sharedController.getSharedByMe); //Get recently accessed items

export default router;