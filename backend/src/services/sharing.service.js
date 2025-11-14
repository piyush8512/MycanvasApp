// import prisma from '../config/prisma.js';
// import crypto from 'crypto';
// // --- END FIX ---

// // HELPER FUNCTIONS
// // Generate unique share token
// const generateShareToken = () => {
//   return crypto.randomBytes(16).toString('hex');
// };

// // Check if user is owner or has permission
// const checkFolderPermission = async (folderId, userId) => {
//   // --- FIX: Handle userId being null ---
//   if (!userId) {
//     const folder = await prisma.folder.findUnique({ where: { id: folderId } });
//     if (!folder) {
//       const error = new Error('Folder not found');
//       error.statusCode = 404;
//       throw error;
//     }
//     return { folder, isOwner: false, isEditor: false, hasPermission: false };
//   }
//   // --- END FIX ---

//   const folder = await prisma.folder.findUnique({
//     where: { id: folderId },
//     include: {
//       collaborators: {
//         where: { userId }
//       }
//     }
//   });

//   if (!folder) {
//     const error = new Error('Folder not found');
//     error.statusCode = 404;
//     throw error;
//   }

//   const isOwner = folder.ownerId === userId;
//   const collaborator = folder.collaborators[0];
  
//   // --- FIX: Use correct enum values ---
//   const isEditor = collaborator?.role === 'EDITOR';
//   const hasPermission = isOwner || isEditor || collaborator?.role === 'VIEWER';
//   // --- END FIX ---

//   return { folder, isOwner, isEditor, hasPermission };
// };

// const checkFilePermission = async (fileId, userId) => {
//   // --- FIX: Handle userId being null ---
//   if (!userId) {
//     const file = await prisma.file.findUnique({ where: { id: fileId } });
//     if (!file) {
//       const error = new Error('File not found');
//       error.statusCode = 404;
//       throw error;
//     }
//     return { file, isOwner: false, isEditor: false, hasPermission: false };
//   }
//   // --- END FIX ---

//   const file = await prisma.file.findUnique({
//     where: { id: fileId },
//     include: {
//       collaborators: {
//         where: { userId }
//       }
//     }
//   });

//   if (!file) {
//     const error = new Error('File not found');
//     error.statusCode = 404;
//     throw error;
//   }

//   const isOwner = file.ownerId === userId;
//   const collaborator = file.collaborators[0];
  
//   // --- FIX: Use correct enum values ---
//   const isEditor = collaborator?.role === 'EDITOR';
//   const hasPermission = isOwner || isEditor || collaborator?.role === 'VIEWER';
//   // --- END FIX ---
  
//   return { file, isOwner, isEditor, hasPermission };
// };

// // Check if users are friends
// const areFriends = async (userId1, userId2) => {
//   const friendship = await prisma.friendship.findFirst({
//     where: {
//       OR: [
//         { userId: userId1, friendId: userId2 },
//         { userId: userId2, friendId: userId1 }
//       ]
//     }
//   });
//   return !!friendship;
// };


// // FOLDER SHARING SERVICES
// // --- FIX: Use export const ---
// export const generateFolderShareLink = async (folderId, userId, expiryDays) => {
//   const { folder, isOwner } = await checkFolderPermission(folderId, userId);

//   if (!isOwner) {
//     const error = new Error('Only folder owner can generate share links');
//     error.statusCode = 403;
//     throw error;
//   }

//   // Generate new token if doesn't exist
//   const shareToken = folder.shareToken || generateShareToken();
  
//   // Calculate expiry date if provided
//   let shareTokenExpiry = null;
//   if (expiryDays) {
//     shareTokenExpiry = new Date();
//     shareTokenExpiry.setDate(shareTokenExpiry.getDate() + expiryDays);
//   }

//   const updatedFolder = await prisma.folder.update({
//     where: { id: folderId },
//     data: {
//       shareToken,
//       shareTokenExpiry,
//       isPubliclyShared: true
//     },
//     select: {
//       id: true,
//       name: true,
//       shareToken: true,
//       isPubliclyShared: true,
//       publicShareRole: true,
//       shareTokenExpiry: true
//     }
//   });

//   return {
//     ...updatedFolder,
//     shareLink: `${process.env.FRONTEND_URL}/shared/folder/${shareToken}`
//   };
// };

// export const toggleFolderPublicSharing = async (folderId, userId, isPubliclyShared) => {
//   const { isOwner } = await checkFolderPermission(folderId, userId);

//   if (!isOwner) {
//     const error = new Error('Only folder owner can toggle public sharing');
//     error.statusCode = 403;
//     throw error;
//   }

//   return await prisma.folder.update({
//     where: { id: folderId },
//     data: { isPubliclyShared },
//     select: {
//       id: true,
//       name: true,
//       isPubliclyShared: true,
//       shareToken: true
//     }
//   });
// };

// export const updateFolderPublicRole = async (folderId, userId, publicShareRole) => {
//   const { isOwner } = await checkFolderPermission(folderId, userId);

//   if (!isOwner) {
//     const error = new Error('Only folder owner can update public share role');
//     error.statusCode = 403;
//     throw error;
//   }

//   if (!['VIEWER', 'EDITOR'].includes(publicShareRole)) {
//     const error = new Error('Invalid role. Must be VIEWER or EDITOR');
//     error.statusCode = 400;
//     throw error;
//   }

//   return await prisma.folder.update({
//     where: { id: folderId },
//     data: { publicShareRole: publicShareRole }, // Removed 'as any'
//     select: {
//       id: true,
//       name: true,
//       publicShareRole: true
//     }
//   });
// };

// export const addFolderCollaborators = async (folderId, userId, collaborators) => {
//   const { isOwner } = await checkFolderPermission(folderId, userId);

//   if (!isOwner) {
//     const error = new Error('Only folder owner can add collaborators');
//     error.statusCode = 403;
//     throw error;
//   }

//   // Validate that all users are friends
//   for (const collab of collaborators) {
//     const isFriend = await areFriends(userId, collab.userId);
//     if (!isFriend) {
//       const error = new Error(`User ${collab.userId} is not your friend`);
//       error.statusCode = 400;
//       throw error;
//     }
//   }

//   // Add collaborators
//   const addedCollaborators = await Promise.all(
//     collaborators.map(async (collab) => {
//       return await prisma.folderCollaborator.upsert({
//         where: {
//           folderId_userId: {
//             folderId,
//             userId: collab.userId
//           }
//         },
//         update: {
//           role: collab.role || 'VIEWER', // Removed 'as any'
//         },
//         create: {
//           folderId,
//           userId: collab.userId,
//           role: collab.role || 'VIEWER', // Removed 'as any'
//           invitedBy: userId
//         },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               friendCode: true
//             }
//           }
//         }
//       });
//     })
//   );

//   // Create SharedItem records
//   await Promise.all(
//     collaborators.map(async (collab) => {
//       return await prisma.sharedItem.upsert({
//         where: {
//           userId_folderId: {
//             userId: collab.userId,
//             folderId
//           }
//         },
//         update: {},
//         create: {
//           userId: collab.userId,
//           folderId,
//           sharedBy: userId
//         }
//       });
//     })
//   );

//   return addedCollaborators;
// };

// export const getFolderCollaborators = async (folderId, userId) => {
//   const { hasPermission } = await checkFolderPermission(folderId, userId);

//   if (!hasPermission) {
//     const error = new Error('You do not have permission to view collaborators');
//     error.statusCode = 403;
//     throw error;
//   }

//   return await prisma.folderCollaborator.findMany({
//     where: { folderId },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           friendCode: true
//         }
//       }
//     },
//     orderBy: {
//       invitedAt: 'desc'
//     }
//   });
// };

// export const updateFolderCollaboratorRole = async (folderId, collaboratorId, userId, role) => {
//   const { isOwner } = await checkFolderPermission(folderId, userId);

//   if (!isOwner) {
//     const error = new Error('Only folder owner can update collaborator roles');
//     error.statusCode = 403;
//     throw error;
//   }

//   if (!['VIEWER', 'EDITOR'].includes(role)) {
//     const error = new Error('Invalid role. Must be VIEWER or EDITOR');
//     error.statusCode = 400;
//     throw error;
//   }

//   return await prisma.folderCollaborator.update({
//     where: { id: collaboratorId },
//     data: { role: role }, // Removed 'as any'
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true
//         }
//       }
//     }
//   });
// };

// export const removeFolderCollaborator = async (folderId, collaboratorId, userId) => {
//   const { isOwner } = await checkFolderPermission(folderId, userId);

//   if (!isOwner) {
//     const error = new Error('Only folder owner can remove collaborators');
//     error.statusCode = 403;
//     throw error;
//   }

//   // Get collaborator details before deleting
//   const collaborator = await prisma.folderCollaborator.findUnique({
//     where: { id: collaboratorId }
//   });

//   if (!collaborator) {
//     const error = new Error('Collaborator not found');
//     error.statusCode = 404;
//     throw error;
//   }

//   // Delete collaborator
//   await prisma.folderCollaborator.delete({
//     where: { id: collaboratorId }
//   });

//   // Also remove from SharedItem
//   await prisma.sharedItem.deleteMany({
//     where: {
//       userId: collaborator.userId,
//       folderId
//     }
//   });
// };

// export const accessFolderViaLink = async (shareToken, userId) => {
//   const folder = await prisma.folder.findUnique({
//     where: { shareToken },
//     include: {
//       owner: {
//         select: {
//           id: true,
//           name: true,
//           email: true
//         }
//       },
//       files: {
//         select: {
//           id: true,
//           name: true,
//           size: true,
//           url: true,
//           createdAt: true
//         }
//       }
//     }
//   });

//   if (!folder) {
//     const error = new Error('Invalid or expired share link');
//     error.statusCode = 404;
//     throw error;
//   }

//   if (!folder.isPubliclyShared) {
//     const error = new Error('This folder is no longer publicly shared');
//     error.statusCode = 403;
//     throw error;
//   }

//   // Check if link has expired
//   if (folder.shareTokenExpiry && new Date() > folder.shareTokenExpiry) {
//     const error = new Error('This share link has expired');
//     error.statusCode = 403;
//     throw error;
//   }

//   return {
//     folder,
//     accessRole: folder.publicShareRole,
//     isOwner: userId && folder.ownerId === userId
//   };
// };

// // FILE/CANVAS SHARING SERVICES
// export const generateFileShareLink = async (fileId, userId, expiryDays) => {
//   const { file, isOwner } = await checkFilePermission(fileId, userId);

//   if (!isOwner) {
//     const error = new Error('Only file owner can generate share links');
//     error.statusCode = 403;
//     throw error;
//   }

//   const shareToken = file.shareToken || generateShareToken();
  
//   let shareTokenExpiry = null;
//   if (expiryDays) {
//     shareTokenExpiry = new Date();
//     shareTokenExpiry.setDate(shareTokenExpiry.getDate() + expiryDays);
//   }

//   const updatedFile = await prisma.file.update({
//     where: { id: fileId },
//     data: {
//       shareToken,
//       shareTokenExpiry,
//       isPubliclyShared: true
//     },
//     select: {
//       id: true,
//       name: true,
//       shareToken: true,
//       isPubliclyShared: true,
//       publicShareRole: true,
//       shareTokenExpiry: true
//     }
//   });

//   return {
//     ...updatedFile,
//     shareLink: `${process.env.FRONTEND_URL}/shared/canvas/${shareToken}`
//   };
// };

// export const toggleFilePublicSharing = async (fileId, userId, isPubliclyShared) => {
//   const { isOwner } = await checkFilePermission(fileId, userId);

//   if (!isOwner) {
//     const error = new Error('Only file owner can toggle public sharing');
//     error.statusCode = 403;
//     throw error;
//   }

//   return await prisma.file.update({
//     where: { id: fileId },
//     data: { isPubliclyShared },
//     select: {
//       id: true,
//       name: true,
//       isPubliclyShared: true,
//       shareToken: true
//     }
//   });
// };

// export const updateFilePublicRole = async (fileId, userId, publicShareRole) => {
//   const { isOwner } = await checkFilePermission(fileId, userId);

//   if (!isOwner) {
//     const error = new Error('Only file owner can update public share role');
//     error.statusCode = 403;
//     throw error;
//   }

//   if (!['VIEWER', 'EDITOR'].includes(publicShareRole)) {
//     const error = new Error('Invalid role. Must be VIEWER or EDITOR');
//     error.statusCode = 400;
//     throw error;
//   }

//   return await prisma.file.update({
//     where: { id: fileId },
//     data: { publicShareRole: publicShareRole }, // Removed 'as any'
//     select: {
//       id: true,
//       name: true,
//       publicShareRole: true
//     }
//   });
// };

// export const addFileCollaborators = async (fileId, userId, collaborators) => {
//   const { isOwner } = await checkFilePermission(fileId, userId);

//   if (!isOwner) {
//     const error = new Error('Only file owner can add collaborators');
//     error.statusCode = 403;
//     throw error;
//   }

//   // Validate that all users are friends
//   for (const collab of collaborators) {
//     const isFriend = await areFriends(userId, collab.userId);
//     if (!isFriend) {
//       const error = new Error(`User ${collab.userId} is not your friend`);
//       error.statusCode = 400;
//       throw error;
//     }
//   }

//   const addedCollaborators = await Promise.all(
//     collaborators.map(async (collab) => {
//       return await prisma.fileCollaborator.upsert({
//         where: {
//           fileId_userId: {
//             fileId,
//             userId: collab.userId
//           }
//         },
//         update: {
//           role: collab.role || 'VIEWER' // Removed 'as any'
//         },
//         create: {
//           fileId,
//           userId: collab.userId,
//           role: collab.role || 'VIEWER', // Removed 'as any'
//           invitedBy: userId
//         },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               friendCode: true
//             }
//           }
//         }
//       });
//     })
//   );

//   // Create SharedItem records
//   await Promise.all(
//     collaborators.map(async (collab) => {
//       return await prisma.sharedItem.upsert({
//         where: {
//           userId_fileId: {
//             userId: collab.userId,
//             fileId
//           }
//         },
//         update: {},
//         create: {
//           userId: collab.userId,
//           fileId,
//           sharedBy: userId
//         }
//       });
//     })
//   );

//   return addedCollaborators;
// };

// export const getFileCollaborators = async (fileId, userId) => {
//   const { hasPermission } = await checkFilePermission(fileId, userId);

//   if (!hasPermission) {
//     const error = new Error('You do not have permission to view collaborators');
//     error.statusCode = 403;
//     throw error;
//   }

//   return await prisma.fileCollaborator.findMany({
//     where: { fileId },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           friendCode: true
//         }
//       }
//     },
//     orderBy: {
//       invitedAt: 'desc'
//     }
//   });
// };

// export const updateFileCollaboratorRole = async (fileId, collaboratorId, userId, role) => {
//   const { isOwner } = await checkFilePermission(fileId, userId);

//   if (!isOwner) {
//     const error = new Error('Only file owner can update collaborator roles');
//     error.statusCode = 403;
//     throw error;
//   }

//   if (!['VIEWER', 'EDITOR'].includes(role)) {
//     const error = new Error('Invalid role. Must be VIEWER or EDITOR');
//     error.statusCode = 400;
//     throw error;
//   }

//   return await prisma.fileCollaborator.update({
//     where: { id: collaboratorId },
//     data: { role: role }, // Removed 'as any'
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true
//         }
//       }
//     }
//   });
// };

// export const removeFileCollaborator = async (fileId, collaboratorId, userId) => {
//   const { isOwner } = await checkFilePermission(fileId, userId);

//   if (!isOwner) {
//     const error = new Error('Only file owner can remove collaborators');
//     error.statusCode = 403;
//     throw error;
//   }

//   const collaborator = await prisma.fileCollaborator.findUnique({
//     where: { id: collaboratorId }
//   });

//   if (!collaborator) {
//     const error = new Error('Collaborator not found');
//     error.statusCode = 404;
//     throw error;
//   }

//   await prisma.fileCollaborator.delete({
//     where: { id: collaboratorId }
//   });

//   await prisma.sharedItem.deleteMany({
//     where: {
//       userId: collaborator.userId,
//       fileId
//     }
//   });
// };

// export const accessFileViaLink = async (shareToken, userId) => {
//   const file = await prisma.file.findUnique({
//     where: { shareToken },
//     include: {
//       owner: {
//         select: {
//           id: true,
//           name: true,
//           email: true
//         }
//       },
//       canvasItems: {
//         select: {
//           id: true,
//           name: true,
//           type: true,
//           content: true,
//           color: true,
//           position: true,
//           size: true,
//           createdAt: true
//         }
//       }
//     }
//   });

//   if (!file) {
//     const error = new Error('Invalid or expired share link');
//     error.statusCode = 404;
//     throw error;
//   }

//   if (!file.isPubliclyShared) {
//     const error = new Error('This file is no longer publicly shared');
//     error.statusCode = 403;
//     throw error;
//   }

//   if (file.shareTokenExpiry && new Date() > file.shareTokenExpiry) {
//     const error = new Error('This share link has expired');
//     error.statusCode = 403;
//     throw error;
//   }

//   return {
//     file,
//     accessRole: file.publicShareRole,
//     isOwner: userId && file.ownerId === userId
//   };
// };

// // GENERAL SERVICES
// export const getSharedWithMe = async (userId) => {
//   const sharedItems = await prisma.sharedItem.findMany({
//     where: { userId },
//     include: {
//       folder: {
//         include: {
//           owner: {
//             select: {
//               id: true,
//               name: true,
//               email: true
//             }
//           }
//         }
//       },
//       file: {
//         include: {
//           owner: {
//             select: {
//               id: true,
//               name: true,
//               email: true
//             }
//           }
//         }
//       }
//     },
//     orderBy: {
//       sharedAt: 'desc'
//     }
//   });

//   return sharedItems;
// };

// export const revokeShareLink = async (itemType, itemId, userId) => {
//   if (itemType === 'folder') {
//     const { isOwner } = await checkFolderPermission(itemId, userId);
    
//     if (!isOwner) {
//       const error = new Error('Only folder owner can revoke share links');
//       error.statusCode = 403;
//       throw error;
//     }

//     await prisma.folder.update({
//       where: { id: itemId },
//       data: {
//         shareToken: null,
//         isPubliclyShared: false,
//         shareTokenExpiry: null
//       }
//     });
//   } else if (itemType === 'file') {
//     const { isOwner } = await checkFilePermission(itemId, userId);
    
//     if (!isOwner) {
//       const error = new Error('Only file owner can revoke share links');
//       error.statusCode = 403;
//       throw error;
//     }

//     await prisma.file.update({
//       where: { id: itemId },
//       data: {
//         shareToken: null,
//         isPubliclyShared: false,
//         shareTokenExpiry: null
//       }
//     });
//   } else {
//     const error = new Error('Invalid item type. Must be folder or file');
//     error.statusCode = 400;
//     throw error;
//   }
// };


// --- FIX: Use ESM import for prisma and crypto ---
import prisma from '../config/prisma.js';
import crypto from 'crypto';
// --- END FIX ---

// HELPER FUNCTIONS
// Generate unique share token
const generateShareToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Check if user is owner or has permission
const checkFolderPermission = async (folderId, userId) => {
  // --- FIX: Handle userId being null ---
  if (!userId) {
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      throw error;
    }
    return { folder, isOwner: false, isEditor: false, hasPermission: false };
  }
  // --- END FIX ---

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      collaborators: {
        where: { userId }
      }
    }
  });

  if (!folder) {
    const error = new Error('Folder not found');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = folder.ownerId === userId;
  const collaborator = folder.collaborators[0];
  
  // --- FIX: Use correct enum values ---
  const isEditor = collaborator?.role === 'EDITOR';
  const hasPermission = isOwner || isEditor || collaborator?.role === 'VIEWER';
  // --- END FIX ---

  return { folder, isOwner, isEditor, hasPermission };
};

const checkFilePermission = async (fileId, userId) => {
  // --- FIX: Handle userId being null ---
  if (!userId) {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      throw error;
    }
    return { file, isOwner: false, isEditor: false, hasPermission: false };
  }
  // --- END FIX ---

  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: {
      collaborators: {
        where: { userId }
      }
    }
  });

  if (!file) {
    const error = new Error('File not found');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = file.ownerId === userId;
  const collaborator = file.collaborators[0];
  
  // --- FIX: Use correct enum values ---
  const isEditor = collaborator?.role === 'EDITOR';
  const hasPermission = isOwner || isEditor || collaborator?.role === 'VIEWER';
  // --- END FIX ---
  
  return { file, isOwner, isEditor, hasPermission };
};

// Check if users are friends
const areFriends = async (userId1, userId2) => {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: userId1, friendId: userId2 },
        { userId: userId2, friendId: userId1 }
      ]
    }
  });
  return !!friendship;
};


// FOLDER SHARING SERVICES
// --- FIX: Use export const ---
export const generateFolderShareLink = async (folderId, userId, expiryDays) => {
  const { folder, isOwner } = await checkFolderPermission(folderId, userId);

  if (!isOwner) {
    const error = new Error('Only folder owner can generate share links');
    error.statusCode = 403;
    throw error;
  }

  // Generate new token if doesn't exist
  const shareToken = folder.shareToken || generateShareToken();
  
  // Calculate expiry date if provided
  let shareTokenExpiry = null;
  if (expiryDays) {
    shareTokenExpiry = new Date();
    shareTokenExpiry.setDate(shareTokenExpiry.getDate() + expiryDays);
  }

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      shareToken,
      shareTokenExpiry,
      isPubliclyShared: true
    },
    select: {
      id: true,
      name: true,
      shareToken: true,
      isPubliclyShared: true,
      publicShareRole: true,
      shareTokenExpiry: true
    }
  });

  return {
    ...updatedFolder,
    shareLink: `${process.env.FRONTEND_URL}/shared/folder/${shareToken}`
  };
};

export const toggleFolderPublicSharing = async (folderId, userId, isPubliclyShared) => {
  const { isOwner } = await checkFolderPermission(folderId, userId);

  if (!isOwner) {
    const error = new Error('Only folder owner can toggle public sharing');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.folder.update({
    where: { id: folderId },
    data: { isPubliclyShared },
    select: {
      id: true,
      name: true,
      isPubliclyShared: true,
      shareToken: true
    }
  });
};

export const updateFolderPublicRole = async (folderId, userId, publicShareRole) => {
  const { isOwner } = await checkFolderPermission(folderId, userId);

  if (!isOwner) {
    const error = new Error('Only folder owner can update public share role');
    error.statusCode = 403;
    throw error;
  }

  if (!['VIEWER', 'EDITOR'].includes(publicShareRole)) {
    const error = new Error('Invalid role. Must be VIEWER or EDITOR');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.folder.update({
    where: { id: folderId },
    data: { publicShareRole: publicShareRole }, // Removed 'as any'
    select: {
      id: true,
      name: true,
      publicShareRole: true
    }
  });
};

export const addFolderCollaborators = async (folderId, userId, collaborators) => {
  const { isOwner } = await checkFolderPermission(folderId, userId);

  if (!isOwner) {
    const error = new Error('Only folder owner can add collaborators');
    error.statusCode = 403;
    throw error;
  }

  // Validate that all users are friends
  for (const collab of collaborators) {
    const isFriend = await areFriends(userId, collab.userId);
    if (!isFriend) {
      const error = new Error(`User ${collab.userId} is not your friend`);
      error.statusCode = 400;
      throw error;
    }
  }

  // Add collaborators
  const addedCollaborators = await Promise.all(
    collaborators.map(async (collab) => {
      return await prisma.folderCollaborator.upsert({
        where: {
          folderId_userId: {
            folderId,
            userId: collab.userId
          }
        },
        update: {
          role: collab.role || 'VIEWER', // Removed 'as any'
        },
        create: {
          folderId,
          userId: collab.userId,
          role: collab.role || 'VIEWER', // Removed 'as any'
          invitedBy: userId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              friendCode: true
            }
          }
        }
      });
    })
  );

  // Create SharedItem records
  await Promise.all(
    collaborators.map(async (collab) => {
      return await prisma.sharedItem.upsert({
        where: {
          userId_folderId: {
            userId: collab.userId,
            folderId
          }
        },
        update: {},
        create: {
          userId: collab.userId,
          folderId,
          sharedBy: userId
        }
      });
    })
  );

  return addedCollaborators;
};

export const getFolderCollaborators = async (folderId, userId) => {
  const { hasPermission } = await checkFolderPermission(folderId, userId);

  if (!hasPermission) {
    const error = new Error('You do not have permission to view collaborators');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.folderCollaborator.findMany({
    where: { folderId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          friendCode: true
        }
      }
    },
    orderBy: {
      invitedAt: 'desc'
    }
  });
};

export const updateFolderCollaboratorRole = async (folderId, collaboratorId, userId, role) => {
  const { isOwner } = await checkFolderPermission(folderId, userId);

  if (!isOwner) {
    const error = new Error('Only folder owner can update collaborator roles');
    error.statusCode = 403;
    throw error;
  }

  if (!['VIEWER', 'EDITOR'].includes(role)) {
    const error = new Error('Invalid role. Must be VIEWER or EDITOR');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.folderCollaborator.update({
    where: { id: collaboratorId },
    data: { role: role }, // Removed 'as any'
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const removeFolderCollaborator = async (folderId, collaboratorId, userId) => {
  const { isOwner } = await checkFolderPermission(folderId, userId);

  if (!isOwner) {
    const error = new Error('Only folder owner can remove collaborators');
    error.statusCode = 403;
    throw error;
  }

  // Get collaborator details before deleting
  const collaborator = await prisma.folderCollaborator.findUnique({
    where: { id: collaboratorId }
  });

  if (!collaborator) {
    const error = new Error('Collaborator not found');
    error.statusCode = 404;
    throw error;
  }

  // Delete collaborator
  await prisma.folderCollaborator.delete({
    where: { id: collaboratorId }
  });

  // Also remove from SharedItem
  await prisma.sharedItem.deleteMany({
    where: {
      userId: collaborator.userId,
      folderId
    }
  });
};

export const accessFolderViaLink = async (shareToken, userId) => {
  const folder = await prisma.folder.findUnique({
    where: { shareToken },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      files: {
        select: {
          id: true,
          name: true,
          size: true,
          url: true,
          createdAt: true
        }
      }
    }
  });

  if (!folder) {
    const error = new Error('Invalid or expired share link');
    error.statusCode = 404;
    throw error;
  }

  if (!folder.isPubliclyShared) {
    const error = new Error('This folder is no longer publicly shared');
    error.statusCode = 403;
    throw error;
  }

  // Check if link has expired
  if (folder.shareTokenExpiry && new Date() > folder.shareTokenExpiry) {
    const error = new Error('This share link has expired');
    error.statusCode = 403;
    throw error;
  }

  return {
    folder,
    accessRole: folder.publicShareRole,
    isOwner: userId && folder.ownerId === userId
  };
};

// FILE/CANVAS SHARING SERVICES
export const generateFileShareLink = async (fileId, userId, expiryDays) => {
  const { file, isOwner } = await checkFilePermission(fileId, userId);

  if (!isOwner) {
    const error = new Error('Only file owner can generate share links');
    error.statusCode = 403;
    throw error;
  }

  const shareToken = file.shareToken || generateShareToken();
  
  let shareTokenExpiry = null;
  if (expiryDays) {
    shareTokenExpiry = new Date();
    shareTokenExpiry.setDate(shareTokenExpiry.getDate() + expiryDays);
  }

  const updatedFile = await prisma.file.update({
    where: { id: fileId },
    data: {
      shareToken,
      shareTokenExpiry,
      isPubliclyShared: true
    },
    select: {
      id: true,
      name: true,
      shareToken: true,
      isPubliclyShared: true,
      publicShareRole: true,
      shareTokenExpiry: true
    }
  });

  return {
    ...updatedFile,
    shareLink: `${process.env.FRONTEND_URL}/shared/canvas/${shareToken}`
  };
};

export const toggleFilePublicSharing = async (fileId, userId, isPubliclyShared) => {
  const { isOwner } = await checkFilePermission(fileId, userId);

  if (!isOwner) {
    const error = new Error('Only file owner can toggle public sharing');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.file.update({
    where: { id: fileId },
    data: { isPubliclyShared },
    select: {
      id: true,
      name: true,
      isPubliclyShared: true,
      shareToken: true
    }
  });
};

export const updateFilePublicRole = async (fileId, userId, publicShareRole) => {
  const { isOwner } = await checkFilePermission(fileId, userId);

  if (!isOwner) {
    const error = new Error('Only file owner can update public share role');
    error.statusCode = 403;
    throw error;
  }

  if (!['VIEWER', 'EDITOR'].includes(publicShareRole)) {
    const error = new Error('Invalid role. Must be VIEWER or EDITOR');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.file.update({
    where: { id: fileId },
    data: { publicShareRole: publicShareRole }, // Removed 'as any'
    select: {
      id: true,
      name: true,
      publicShareRole: true
    }
  });
};

export const addFileCollaborators = async (fileId, userId, collaborators) => {
  const { isOwner } = await checkFilePermission(fileId, userId);

  if (!isOwner) {
    const error = new Error('Only file owner can add collaborators');
    error.statusCode = 403;
    throw error;
  }

  // Validate that all users are friends
  for (const collab of collaborators) {
    const isFriend = await areFriends(userId, collab.userId);
    if (!isFriend) {
      const error = new Error(`User ${collab.userId} is not your friend`);
      error.statusCode = 400;
      throw error;
    }
  }

  const addedCollaborators = await Promise.all(
    collaborators.map(async (collab) => {
      return await prisma.fileCollaborator.upsert({
        where: {
          fileId_userId: {
            fileId,
            userId: collab.userId
          }
        },
        update: {
          role: collab.role || 'VIEWER' // Removed 'as any'
        },
        create: {
          fileId,
          userId: collab.userId,
          role: collab.role || 'VIEWER', // Removed 'as any'
          invitedBy: userId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              friendCode: true
            }
          }
        }
      });
    })
  );

  // Create SharedItem records
  await Promise.all(
    collaborators.map(async (collab) => {
      return await prisma.sharedItem.upsert({
        where: {
          userId_fileId: {
            userId: collab.userId,
            fileId
          }
        },
        update: {},
        create: {
          userId: collab.userId,
          fileId,
          sharedBy: userId
        }
      });
    })
  );

  return addedCollaborators;
};

export const getFileCollaborators = async (fileId, userId) => {
  const { hasPermission } = await checkFilePermission(fileId, userId);

  if (!hasPermission) {
    const error = new Error('You do not have permission to view collaborators');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.fileCollaborator.findMany({
    where: { fileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          friendCode: true
        }
      }
    },
    orderBy: {
      invitedAt: 'desc'
    }
  });
};

export const updateFileCollaboratorRole = async (fileId, collaboratorId, userId, role) => {
  const { isOwner } = await checkFilePermission(fileId, userId);

  if (!isOwner) {
    const error = new Error('Only file owner can update collaborator roles');
    error.statusCode = 403;
    throw error;
  }

  if (!['VIEWER', 'EDITOR'].includes(role)) {
    const error = new Error('Invalid role. Must be VIEWER or EDITOR');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.fileCollaborator.update({
    where: { id: collaboratorId },
    data: { role: role }, // Removed 'as any'
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const removeFileCollaborator = async (fileId, collaboratorId, userId) => {
  const { isOwner } = await checkFilePermission(fileId, userId);

  if (!isOwner) {
    const error = new Error('Only file owner can remove collaborators');
    error.statusCode = 403;
    throw error;
  }

  const collaborator = await prisma.fileCollaborator.findUnique({
    where: { id: collaboratorId }
  });

  if (!collaborator) {
    const error = new Error('Collaborator not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.fileCollaborator.delete({
    where: { id: collaboratorId }
  });

  await prisma.sharedItem.deleteMany({
    where: {
      userId: collaborator.userId,
      fileId
    }
  });
};

export const accessFileViaLink = async (shareToken, userId) => {
  const file = await prisma.file.findUnique({
    where: { shareToken },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      canvasItems: {
        select: {
          id: true,
          name: true,
          type: true,
          content: true,
          color: true,
          position: true,
          size: true,
          createdAt: true
        }
      }
    }
  });

  if (!file) {
    const error = new Error('Invalid or expired share link');
    error.statusCode = 404;
    throw error;
  }

  if (!file.isPubliclyShared) {
    const error = new Error('This file is no longer publicly shared');
    error.statusCode = 403;
    throw error;
  }

  if (file.shareTokenExpiry && new Date() > file.shareTokenExpiry) {
    const error = new Error('This share link has expired');
    error.statusCode = 403;
    throw error;
  }

  return {
    file,
    accessRole: file.publicShareRole,
    isOwner: userId && file.ownerId === userId
  };
};

// GENERAL SERVICES
export const getSharedWithMe = async (userId) => {
  const sharedItems = await prisma.sharedItem.findMany({
    where: { userId },
    include: {
      folder: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      file: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      sharedAt: 'desc'
    }
  });

  return sharedItems;
};

export const revokeShareLink = async (itemType, itemId, userId) => {
  if (itemType === 'folder') {
    const { isOwner } = await checkFolderPermission(itemId, userId);
    
    if (!isOwner) {
      const error = new Error('Only folder owner can revoke share links');
      error.statusCode = 403;
      throw error;
    }

    await prisma.folder.update({
      where: { id: itemId },
      data: {
        shareToken: null,
        isPubliclyShared: false,
        shareTokenExpiry: null
      }
    });
  } else if (itemType === 'file') {
    const { isOwner } = await checkFilePermission(itemId, userId);
    
    if (!isOwner) {
      const error = new Error('Only file owner can revoke share links');
      error.statusCode = 403;
      throw error;
    }

    await prisma.file.update({
      where: { id: itemId },
      data: {
        shareToken: null,
        isPubliclyShared: false,
        shareTokenExpiry: null
      }
    });
  } else {
    const error = new Error('Invalid item type. Must be folder or file');
    error.statusCode = 400;
    throw error;
  }
};