// import { Router } from "express";
// import { requireAuth } from "../middleware/clerkAuth.js";
// import {
//   generateFolderShareLink,
//   toggleFolderPublicSharing,
//   updateFolderPublicRole,
//     addFolderCollaborators,
//     getFolderCollaborators,
//     updateFolderCollaboratorRole,
//     removeFolderCollaborator,
//     accessFolderViaLink,
//     generateFileShareLink,
//     toggleFilePublicSharing,
//     updateFilePublicRole,
//     addFileCollaborators,
//     getFileCollaborators,
//     updateFileCollaboratorRole,
//     removeFileCollaborator,
//     accessFileViaLink,
//     getSharedWithMe,
//     revokeShareLink
// } from "../controllers/sharing.controller.js";
// import { generateShareLink, getSharedFile } from '../controllers/sharing.controller.js';

// const router = Router();
// router.use(requireAuth);
// router.route('/folder/:folderId/generate-link').post(generateFolderShareLink);
// router.route('/folder/:folderId/toggle-public').patch(toggleFolderPublicSharing);
// router.route('/folder/:folderId/public-role').patch(updateFolderPublicRole);
// router.route('/folder/:folderId/collaborators').post(addFolderCollaborators);
// router.route('/folder/:folderId/collaborators').get(getFolderCollaborators);
// router.route('/folder/:folderId/collaborators/:collaboratorId').patch(updateFolderCollaboratorRole);
// router.route('/folder/:folderId/collaborators/:collaboratorId').delete(removeFolderCollaborator);
// router.route('/folder/link/:shareToken').get(accessFolderViaLink);

// // FILE/CANVAS SHARING ROUTES
// router.route('/file/:fileId/generate-link').post(generateFileShareLink);
// router.route('/file/:fileId/toggle-public').patch(toggleFilePublicSharing);
// router.route('/file/:fileId/public-role').patch(updateFilePublicRole);
// router.route('/file/:fileId/collaborators').post(addFileCollaborators);
// router.route('/file/:fileId/collaborators').get(getFileCollaborators);
// router.route('/file/:fileId/collaborators/:collaboratorId').patch(updateFileCollaboratorRole);
// router.route('/file/:fileId/collaborators/:collaboratorId').delete(removeFileCollaborator);
// router.route('/file/link/:shareToken').get(accessFileViaLink);

// // GENERAL ROUTES
// router.route('/shared-with-me').get(getSharedWithMe);
// router.route('/revoke/:itemType/:itemId/link').delete(revokeShareLink);

// // Generate share link (protected - requires auth)
// router.post('/generate', requireAuth, generateShareLink);

// // Get shared file (public - no auth needed)
// router.get('/:shareToken', getSharedFile);

// export default router;

// --- FIX: Use ESM imports ---
import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/clerkAuth.js";
import {
    generateFolderShareLink,
    toggleFolderPublicSharing,
    updateFolderPublicRole,
    addFolderCollaborators,
    getFolderCollaborators,
    updateFolderCollaboratorRole,
    removeFolderCollaborator,
    accessFolderViaLink,
    generateFileShareLink,
    toggleFilePublicSharing,
    updateFilePublicRole,
    addFileCollaborators,
    getFileCollaborators,
    updateFileCollaboratorRole,
    removeFileCollaborator,
    accessFileViaLink,
    getSharedWithMe,
    revokeShareLink
    // getSharedByMe was removed as it's not defined in your controller
} from "../controllers/sharing.controller.js";
// --- END FIX ---

const router = Router();

// --- FIX: Apply middleware per-route ---
// FOLDER SHARING ROUTES
router.route('/folder/:folderId/generate-link').post(requireAuth, generateFolderShareLink);
router.route('/folder/:folderId/toggle-public').patch(requireAuth, toggleFolderPublicSharing);
router.route('/folder/:folderId/public-role').patch(requireAuth, updateFolderPublicRole);
router.route('/folder/:folderId/collaborators').post(requireAuth, addFolderCollaborators);
router.route('/folder/:folderId/collaborators').get(requireAuth, getFolderCollaborators);
router.route('/folder/:folderId/collaborators/:collaboratorId').patch(requireAuth, updateFolderCollaboratorRole);
router.route('/folder/:folderId/collaborators/:collaboratorId').delete(requireAuth, removeFolderCollaborator);
// Public link access should have *optional* auth
router.route('/folder/link/:shareToken').get(optionalAuth, accessFolderViaLink);

// FILE/CANVAS SHARING ROUTES
router.route('/file/:fileId/generate-link').post(requireAuth, generateFileShareLink);
router.route('/file/:fileId/toggle-public').patch(requireAuth, toggleFilePublicSharing);
router.route('/file/:fileId/public-role').patch(requireAuth, updateFilePublicRole);
router.route('/file/:fileId/collaborators').post(requireAuth, addFileCollaborators);
router.route('/file/:fileId/collaborators').get(requireAuth, getFileCollaborators);
router.route('/file/:fileId/collaborators/:collaboratorId').patch(requireAuth, updateFileCollaboratorRole);
router.route('/file/:fileId/collaborators/:collaboratorId').delete(requireAuth, removeFileCollaborator);
// Public link access should have *optional* auth
router.route('/file/link/:shareToken').get(optionalAuth, accessFileViaLink);


// GENERAL ROUTES
router.route('/shared-with-me').get(requireAuth, getSharedWithMe);
router.route('/revoke/:itemType/:itemId/link').delete(requireAuth, revokeShareLink);
// --- END FIX ---

export default router;