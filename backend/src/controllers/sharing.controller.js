
// import sharingService from '../services/sharing.service.js';


// // --- Helper function to get the DB user from Clerk ID ---
// async function getDbUser(clerkId) {
//   if (!clerkId) return null;
//   return await prisma.user.findUnique({ where: { clerkId } });
// }

// // FOLDER SHARING CONTROLLERS
// // --- FIX: Use export const ---
// export const generateFolderShareLink = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     // --- FIX: Get DB user ID ---
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     // --- END FIX ---
//     const { expiryDays } = req.body; 

//     const result = await sharingService.generateFolderShareLink(folderId, userId, expiryDays);
    
//     res.status(200).json({
//       success: true,
//       message: 'Share link generated successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error generating folder share link:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to generate share link'
//     });
//   }
// };

// export const toggleFolderPublicSharing = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { isPubliclyShared } = req.body;

//     const result = await sharingService.toggleFolderPublicSharing(folderId, userId, isPubliclyShared);
    
//     res.status(200).json({
//       success: true,
//       message: `Public sharing ${isPubliclyShared ? 'enabled' : 'disabled'}`,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error toggling folder public sharing:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to toggle public sharing'
//     });
//   }
// };

// export const updateFolderPublicRole = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { publicShareRole } = req.body; 

//     const result = await sharingService.updateFolderPublicRole(folderId, userId, publicShareRole);
    
//     res.status(200).json({
//       success: true,
//       message: 'Public share role updated',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error updating folder public role:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to update public role'
//     });
//   }
// };

// export const addFolderCollaborators = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { collaborators } = req.body; 

//     const result = await sharingService.addFolderCollaborators(folderId, userId, collaborators);
    
//     res.status(201).json({
//       success: true,
//       message: 'Collaborators added successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error adding folder collaborators:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to add collaborators'
//     });
//   }
// };

// export const getFolderCollaborators = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;

//     const collaborators = await sharingService.getFolderCollaborators(folderId, userId);
    
//     res.status(200).json({
//       success: true,
//       data: collaborators
//     });
//   } catch (error) {
//     console.error('Error getting folder collaborators:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to get collaborators'
//     });
//   }
// };

// export const updateFolderCollaboratorRole = async (req, res) => {
//   try {
//     const { folderId, collaboratorId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { role } = req.body; // VIEWER or EDITOR

//     const result = await sharingService.updateFolderCollaboratorRole(folderId, collaboratorId, userId, role);
    
//     res.status(200).json({
//       success: true,
//       message: 'Collaborator role updated',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error updating folder collaborator role:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to update collaborator role'
//     });
//   }
// };

// export const removeFolderCollaborator = async (req, res) => {
//   try {
//     const { folderId, collaboratorId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;

//     await sharingService.removeFolderCollaborator(folderId, collaboratorId, userId);
    
//     res.status(200).json({
//       success: true,
//       message: 'Collaborator removed successfully'
//     });
//   } catch (error) {
//     console.error('Error removing folder collaborator:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to remove collaborator'
//     });
//   }
// };

// export const accessFolderViaLink = async (req, res) => {
//   try {
//     const { shareToken } = req.params;
//     // --- FIX: Use req.auth.userId (Clerk ID) ---
//     const dbUser = await getDbUser(req.auth?.userId); // Optional auth
//     const userId = dbUser?.id || null; // Can be null if not logged in
//     // --- END FIX ---
//     const result = await sharingService.accessFolderViaLink(shareToken, userId); 	

//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error accessing folder via link:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to access folder'
//     });
//   }
// };

// // FILE/CANVAS SHARING CONTROLLERS
// export const generateFileShareLink = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { expiryDays } = req.body;

//     const result = await sharingService.generateFileShareLink(fileId, userId, expiryDays);
    
//     res.status(200).json({
//       success: true,
//       message: 'Share link generated successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error generating file share link:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to generate share link'
//     });
//   }
// };

// export const toggleFilePublicSharing = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { isPubliclyShared } = req.body;

//     const result = await sharingService.toggleFilePublicSharing(fileId, userId, isPubliclyShared);
    
//     res.status(200).json({
//       success: true,
//       message: `Public sharing ${isPubliclyShared ? 'enabled' : 'disabled'}`,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error toggling file public sharing:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to toggle public sharing'
//     });
//   }
// };

// export const updateFilePublicRole = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { publicShareRole } = req.body;

//     const result = await sharingService.updateFilePublicRole(fileId, userId, publicShareRole);
    
//     res.status(200).json({
//       success: true,
//       message: 'Public share role updated',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error updating file public role:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to update public role'
//     });
//   }
// };

// export const addFileCollaborators = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { collaborators } = req.body;

//     const result = await sharingService.addFileCollaborators(fileId, userId, collaborators);
    
//     res.status(201).json({
//       success: true,
//       message: 'Collaborators added successfully',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error adding file collaborators:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to add collaborators'
//     });
//   }
// };

// export const getFileCollaborators = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;

//     const collaborators = await sharingService.getFileCollaborators(fileId, userId);
    
//     res.status(200).json({
//       success: true,
//       data: collaborators
//     });
//   } catch (error) {
//     console.error('Error getting file collaborators:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to get collaborators'
//     });
//   }
// };

// export const updateFileCollaboratorRole = async (req, res) => {
//   try {
//     const { fileId, collaboratorId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;
//     const { role } = req.body;

//     const result = await sharingService.updateFileCollaboratorRole(fileId, collaboratorId, userId, role);
    
//     res.status(200).json({
//       success: true,
//       message: 'Collaborator role updated',
//       data: result
//     });
//   } catch (error) {
//     console.error('Error updating file collaborator role:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to update collaborator role'
//     });
//   }
// };

// export const removeFileCollaborator = async (req, res) => {
//   try {
//     const { fileId, collaboratorId } = req.params;
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;

//     await sharingService.removeFileCollaborator(fileId, collaboratorId, userId);
    
//     res.status(200).json({
//       success: true,
//       message: 'Collaborator removed successfully'
//     });
//   } catch (error) {
//     console.error('Error removing file collaborator:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to remove collaborator'
//     });
//   }
// };

// export const accessFileViaLink = async (req, res) => {
//   try {
//     const { shareToken } = req.params;
//     // --- FIX: Use req.auth.userId (Clerk ID) ---
//     const dbUser = await getDbUser(req.auth?.userId); // Optional auth
//     const userId = dbUser?.id || null;
//     // --- END FIX ---

//     const result = await sharingService.accessFileViaLink(shareToken, userId);
    
//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Error accessing file via link:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to access file'
//     });
//   }
// };


// // GENERAL CONTROLLERS
// export const getSharedWithMe = async (req, res) => {
//   try {
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;

//     const sharedItems = await sharingService.getSharedWithMe(userId);
    
//     res.status(200).json({
//       success: true,
//       data: sharedItems
//     });
//   } catch (error) {
//     console.error('Error getting shared items:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to get shared items'
//     });
//   }
// };

// export const revokeShareLink = async (req, res) => {
//   try {
//     const { itemType, itemId } = req.params; // itemType: 'folder' or 'file'
//     const dbUser = await getDbUser(req.auth.userId);
//     if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
//     const userId = dbUser.id;

//     await sharingService.revokeShareLink(itemType, itemId, userId);
    
//     res.status(200).json({
//       success: true,
//       message: 'Share link revoked successfully'
//     });
//   } catch (error) {
//     console.error('Error revoking share link:', error);
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || 'Failed to revoke share link'
//     });
//   }
// };

// import prisma from '../config/prisma.js';

// export const generateShareLink = async (req, res) => {
//   try {
//     const { spaceId, access } = req.body;
//     const userId = req.auth.userId;

//     console.log('Generate link request - userId:', userId, 'spaceId:', spaceId);

//     if (!spaceId) {
//       return res.status(400).json({
//         success: false,
//         message: 'spaceId is required'
//       });
//     }

//     // Get user from database
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId: userId }
//     });

//     if (!dbUser) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found in database'
//       });
//     }

//     // Check if user owns the file
//     const file = await prisma.file.findUnique({
//       where: { id: spaceId }
//     });

//     if (!file) {
//       return res.status(404).json({
//         success: false,
//         message: 'File not found'
//       });
//     }

//     if (file.ownerId !== dbUser.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'You do not have permission to share this file'
//       });
//     }

//     // Generate share token
//     const shareToken = `${file.id}-${Math.random().toString(36).substr(2, 9)}`;

//     // Create or update share record
//     const sharing = await prisma.sharing.upsert({
//       where: { fileId_userId: { fileId: spaceId, userId: dbUser.id } },
//       update: { access: access || 'INVITED' },
//       create: {
//         fileId: spaceId,
//         userId: dbUser.id,
//         access: access || 'INVITED',
//         shareToken: shareToken
//       }
//     });

//     // Generate the shareable URL
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
//     const shareUrl = `${frontendUrl}/shared/${sharing.shareToken}`;

//     res.json({
//       success: true,
//       link: shareUrl,
//       url: shareUrl,
//       message: 'Share link generated successfully'
//     });

//   } catch (error) {
//     console.error('Generate share link error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate share link',
//       error: error.message
//     });
//   }
// };

// export const getSharedFile = async (req, res) => {
//   try {
//     const { shareToken } = req.params;

//     const sharing = await prisma.sharing.findUnique({
//       where: { shareToken },
//       include: {
//         file: {
//           include: {
//             owner: {
//               select: { id: true, name: true, email: true }
//             }
//           }
//         }
//       }
//     });

//     if (!sharing) {
//       return res.status(404).json({
//         success: false,
//         message: 'Shared file not found'
//       });
//     }

//     res.json({
//       success: true,
//       file: sharing.file
//     });

//   } catch (error) {
//     console.error('Get shared file error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch shared file',
//       error: error.message
//     });
//   }
// };


// --- FIX: Use ESM import for the service ---
import * as sharingService from '../services/sharing.service.js';
// --- FIX: Import prisma to find user ---
import prisma from '../config/prisma.js';

// --- Helper function to get the DB user from Clerk ID ---
async function getDbUser(clerkId) {
  if (!clerkId) return null;
  return await prisma.user.findUnique({ where: { clerkId } });
}

// FOLDER SHARING CONTROLLERS
// --- FIX: Use export const ---
export const generateFolderShareLink = async (req, res) => {
  try {
    const { folderId } = req.params;
    // --- FIX: Get DB user ID ---
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    // --- END FIX ---
    const { expiryDays } = req.body; 

    const result = await sharingService.generateFolderShareLink(folderId, userId, expiryDays);
    
    res.status(200).json({
      success: true,
      message: 'Share link generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error generating folder share link:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to generate share link'
    });
  }
};

export const toggleFolderPublicSharing = async (req, res) => {
  try {
    const { folderId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { isPubliclyShared } = req.body;

    const result = await sharingService.toggleFolderPublicSharing(folderId, userId, isPubliclyShared);
    
    res.status(200).json({
      success: true,
      message: `Public sharing ${isPubliclyShared ? 'enabled' : 'disabled'}`,
      data: result
    });
  } catch (error) {
    console.error('Error toggling folder public sharing:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to toggle public sharing'
    });
  }
};

export const updateFolderPublicRole = async (req, res) => {
  try {
    const { folderId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { publicShareRole } = req.body; 

    const result = await sharingService.updateFolderPublicRole(folderId, userId, publicShareRole);
    
    res.status(200).json({
      success: true,
      message: 'Public share role updated',
      data: result
    });
  } catch (error) {
    console.error('Error updating folder public role:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update public role'
    });
  }
};

export const addFolderCollaborators = async (req, res) => {
  try {
    const { folderId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { collaborators } = req.body; 

    const result = await sharingService.addFolderCollaborators(folderId, userId, collaborators);
    
    res.status(201).json({
      success: true,
      message: 'Collaborators added successfully',
      data: result
    });
  } catch (error) {
    console.error('Error adding folder collaborators:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add collaborators'
    });
  }
};

export const getFolderCollaborators = async (req, res) => {
  try {
    const { folderId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;

    const collaborators = await sharingService.getFolderCollaborators(folderId, userId);
    
    res.status(200).json({
      success: true,
      data: collaborators
    });
  } catch (error) {
    console.error('Error getting folder collaborators:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get collaborators'
    });
  }
};

export const updateFolderCollaboratorRole = async (req, res) => {
  try {
    const { folderId, collaboratorId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { role } = req.body; // VIEWER or EDITOR

    const result = await sharingService.updateFolderCollaboratorRole(folderId, collaboratorId, userId, role);
    
    res.status(200).json({
      success: true,
      message: 'Collaborator role updated',
      data: result
    });
  } catch (error) {
    console.error('Error updating folder collaborator role:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update collaborator role'
    });
  }
};

export const removeFolderCollaborator = async (req, res) => {
  try {
    const { folderId, collaboratorId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;

    await sharingService.removeFolderCollaborator(folderId, collaboratorId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    console.error('Error removing folder collaborator:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove collaborator'
    });
  }
};

export const accessFolderViaLink = async (req, res) => {
  try {
    const { shareToken } = req.params;
    // --- FIX: Use req.auth.userId (Clerk ID) ---
    const dbUser = await getDbUser(req.auth?.userId); // Optional auth
    const userId = dbUser?.id || null; // Can be null if not logged in
    // --- END FIX ---
    const result = await sharingService.accessFolderViaLink(shareToken, userId); 	

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error accessing folder via link:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to access folder'
    });
  }
};

// FILE/CANVAS SHARING CONTROLLERS
export const generateFileShareLink = async (req, res) => {
  try {
    const { fileId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { expiryDays } = req.body;

    const result = await sharingService.generateFileShareLink(fileId, userId, expiryDays);
    
    res.status(200).json({
      success: true,
      message: 'Share link generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error generating file share link:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to generate share link'
    });
  }
};

export const toggleFilePublicSharing = async (req, res) => {
  try {
    const { fileId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { isPubliclyShared } = req.body;

    const result = await sharingService.toggleFilePublicSharing(fileId, userId, isPubliclyShared);
    
    res.status(200).json({
      success: true,
      message: `Public sharing ${isPubliclyShared ? 'enabled' : 'disabled'}`,
      data: result
    });
  } catch (error) {
    console.error('Error toggling file public sharing:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to toggle public sharing'
    });
  }
};

export const updateFilePublicRole = async (req, res) => {
  try {
    const { fileId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { publicShareRole } = req.body;

    const result = await sharingService.updateFilePublicRole(fileId, userId, publicShareRole);
    
    res.status(200).json({
      success: true,
      message: 'Public share role updated',
      data: result
    });
  } catch (error) {
    console.error('Error updating file public role:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update public role'
    });
  }
};

export const addFileCollaborators = async (req, res) => {
  try {
    const { fileId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { collaborators } = req.body;

    const result = await sharingService.addFileCollaborators(fileId, userId, collaborators);
    
    res.status(201).json({
      success: true,
      message: 'Collaborators added successfully',
      data: result
    });
  } catch (error) {
    console.error('Error adding file collaborators:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add collaborators'
    });
  }
};

export const getFileCollaborators = async (req, res) => {
  try {
    const { fileId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;

    const collaborators = await sharingService.getFileCollaborators(fileId, userId);
    
    res.status(200).json({
      success: true,
      data: collaborators
    });
  } catch (error) {
    console.error('Error getting file collaborators:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get collaborators'
    });
  }
};

export const updateFileCollaboratorRole = async (req, res) => {
  try {
    const { fileId, collaboratorId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;
    const { role } = req.body;

    const result = await sharingService.updateFileCollaboratorRole(fileId, collaboratorId, userId, role);
    
    res.status(200).json({
      success: true,
      message: 'Collaborator role updated',
      data: result
    });
  } catch (error) {
    console.error('Error updating file collaborator role:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update collaborator role'
    });
  }
};

export const removeFileCollaborator = async (req, res) => {
  try {
    const { fileId, collaboratorId } = req.params;
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;

    await sharingService.removeFileCollaborator(fileId, collaboratorId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    console.error('Error removing file collaborator:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove collaborator'
    });
  }
};

export const accessFileViaLink = async (req, res) => {
  try {
    const { shareToken } = req.params;
    // --- FIX: Use req.auth.userId (Clerk ID) ---
    const dbUser = await getDbUser(req.auth?.userId); // Optional auth
    const userId = dbUser?.id || null;
    // --- END FIX ---

    const result = await sharingService.accessFileViaLink(shareToken, userId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error accessing file via link:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to access file'
    });
  }
};


// GENERAL CONTROLLERS
export const getSharedWithMe = async (req, res) => {
  try {
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;

    const sharedItems = await sharingService.getSharedWithMe(userId);
    
    res.status(200).json({
      success: true,
      data: sharedItems
    });
  } catch (error) {
    console.error('Error getting shared items:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get shared items'
    });
  }
};

export const revokeShareLink = async (req, res) => {
  try {
    const { itemType, itemId } = req.params; // itemType: 'folder' or 'file'
    const dbUser = await getDbUser(req.auth.userId);
    if (!dbUser) return res.status(404).json({ success: false, message: "User not found" });
    const userId = dbUser.id;

    await sharingService.revokeShareLink(itemType, itemId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Share link revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking share link:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to revoke share link'
    });
  }
};

// --- FIX: These two functions were in your routes file but not this controller ---
export const generateShareLink = (req, res) => {
  // This is a generic function. We should decide if it's for files or folders.
  // Let's assume it's for FILES (canvases) for now.
  req.params.fileId = req.body.spaceId; // Get spaceId from body
  return generateFileShareLink(req, res);
};

export const getSharedFile = (req, res) => {
  // This is the public route, it maps to accessFileViaLink
  return accessFileViaLink(req, res);
};
// --- END FIX ---