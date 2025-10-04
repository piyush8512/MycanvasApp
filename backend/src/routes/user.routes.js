import { Router } from "express";
const router = Router();
import { healthCheck , testconnection , getOrCreateCurrentUser, testCreateUser, updateUserProfile} from "../controllers/user.controller";
import { requireAuth } from "../middleware/clerkAuth.js";


//test router
router.route('/health').get(healthCheck);
router.route('/test-connection').get(testconnection);
// Get or Create Current User 
router.route('/me').get(requireAuth, getOrCreateCurrentUser);
router.route('/update-profile').get(requireAuth, updateUserProfile);
router.route('/test-create-user').post(testCreateUser);





