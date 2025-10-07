import prisma from "../config/prisma.js";

export const testCreateUser = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Test endpoint - Replace with actual logic"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message
    });
  }
};

//create folder
export const createFolder = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { name } = req.body;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Folder name is required'
      });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create folder and log activity in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create folder
      const folder = await tx.folder.create({
        data: {
          name: name.trim(),
          ownerId: dbUser.id
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Log activity
      await tx.activity.create({
        data: {
          userId: dbUser.id,
          action: 'CREATED',
          itemType: 'FOLDER',
          itemId: folder.id,
          itemName: folder.name,
          folderId: folder.id,
          description: `Created folder "${folder.name}"`
        }
      });

      return folder;
    });

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      folder: result
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create folder',
      error: error.message
    });
  }
};

// ============================================
// GET ALL FOLDERS
// ============================================
export const getAllFolders = async (req, res) => {
  try {
    // Check if auth exists
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'No user ID found in request'
      });
    }

    const userId = req.auth.userId;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all folders for the user
    const folders = await prisma.folder.findMany({
      where: {
        OR: [
          { ownerId: dbUser.id },
          {
            collaborators: {
              some: {
                userId: dbUser.id
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        collaborators: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      folders
    });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch folders',
      error: error.message
    });
  }
};

// ============================================
// GET FOLDER BY ID
// ============================================
export const getFolderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            files: true
          }
        },
        files: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Check if user has access
    const hasAccess = 
      folder.ownerId === dbUser.id ||
      folder.collaborators.some(c => c.userId === dbUser.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this folder'
      });
    }

    res.json({
      success: true,
      folder: {
        ...folder,
        isOwner: folder.ownerId === dbUser.id,
        totalItems: folder._count.files
      }
    });
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch folder',
      error: error.message
    });
  }
};

// ============================================
// UPDATE FOLDER
// ============================================
export const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;
    const { name } = req.body;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if folder exists and user has access
    const existingFolder = await prisma.folder.findUnique({
      where: { id },
      include: {
        collaborators: true
      }
    });

    if (!existingFolder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Check permissions (owner or editor)
    const isOwner = existingFolder.ownerId === dbUser.id;
    const isEditor = existingFolder.collaborators.some(
      c => c.userId === dbUser.id && c.role === 'EDITOR'
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this folder'
      });
    }

    // Update folder and log activity
    const result = await prisma.$transaction(async (tx) => {
      const updatedFolder = await tx.folder.update({
        where: { id },
        data: {
          ...(name && { name: name.trim() })
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Log activity
      await tx.activity.create({
        data: {
          userId: dbUser.id,
          action: 'UPDATED',
          itemType: 'FOLDER',
          itemId: updatedFolder.id,
          itemName: updatedFolder.name,
          folderId: updatedFolder.id,
          description: `Updated folder "${updatedFolder.name}"`
        }
      });

      return updatedFolder;
    });

    res.json({
      success: true,
      message: 'Folder updated successfully',
      folder: result
    });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update folder',
      error: error.message
    });
  }
};

// ============================================
// DELETE FOLDER
// ============================================
export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if folder exists
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            files: true
          }
        }
      }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Only owner can delete
    if (folder.ownerId !== dbUser.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can delete this folder'
      });
    }

    // Delete folder (cascades to files, collaborators, etc.)
    await prisma.$transaction(async (tx) => {
      // Log activity before deletion
      await tx.activity.create({
        data: {
          userId: dbUser.id,
          action: 'DELETED',
          itemType: 'FOLDER',
          itemId: folder.id,
          itemName: folder.name,
          description: `Deleted folder "${folder.name}"`
        }
      });

      // Delete folder
      await tx.folder.delete({
        where: { id }
      });
    });

    res.json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete folder',
      error: error.message
    });
  }
};

// ============================================
// SHARE FOLDER
// ============================================
export const shareFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;
    const { collaboratorEmail, role = 'VIEWER' } = req.body;

    if (!collaboratorEmail) {
      return res.status(400).json({
        success: false,
        message: 'Collaborator email is required'
      });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if folder exists and user is owner
    const folder = await prisma.folder.findUnique({
      where: { id }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    if (folder.ownerId !== dbUser.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can share this folder'
      });
    }

    // Find user to share with
    const collaboratorUser = await prisma.user.findUnique({
      where: { email: collaboratorEmail }
    });

    if (!collaboratorUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found with that email'
      });
    }

    // Can't share with yourself
    if (collaboratorUser.id === dbUser.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot share with yourself'
      });
    }

    // Check if already shared
    const existingCollaboration = await prisma.folderCollaborator.findFirst({
      where: {
        folderId: id,
        userId: collaboratorUser.id
      }
    });

    if (existingCollaboration) {
      return res.status(400).json({
        success: false,
        message: 'Folder is already shared with this user'
      });
    }

    // Share folder
    const result = await prisma.$transaction(async (tx) => {
      // Create collaboration
      const collaboration = await tx.folderCollaborator.create({
        data: {
          folderId: id,
          userId: collaboratorUser.id,
          role
        },
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

      // Create shared item record
      await tx.sharedItem.create({
        data: {
          userId: collaboratorUser.id,
          folderId: id,
          sharedBy: dbUser.id
        }
      });

      // Update folder isShared flag
      await tx.folder.update({
        where: { id },
        data: { isShared: true }
      });

      // Log activity
      await tx.activity.create({
        data: {
          userId: dbUser.id,
          action: 'SHARED',
          itemType: 'FOLDER',
          itemId: id,
          itemName: folder.name,
          folderId: id,
          description: `Shared folder "${folder.name}" with ${collaboratorUser.email}`
        }
      });

      return collaboration;
    });

    res.json({
      success: true,
      message: 'Folder shared successfully',
      collaboration: result
    });
  } catch (error) {
    console.error('Share folder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share folder',
      error: error.message
    });
  }
};

// ============================================
// REMOVE COLLABORATOR
// ============================================
export const removeCollaborator = async (req, res) => {
  try {
    const { id, collaboratorId } = req.params;
    const userId = req.auth.userId;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if folder exists and user is owner
    const folder = await prisma.folder.findUnique({
      where: { id }
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }

    if (folder.ownerId !== dbUser.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can remove collaborators'
      });
    }

    // Remove collaborator
    await prisma.$transaction(async (tx) => {
      // Delete collaboration
      await tx.folderCollaborator.deleteMany({
        where: {
          folderId: id,
          userId: collaboratorId
        }
      });

      // Delete shared item
      await tx.sharedItem.deleteMany({
        where: {
          folderId: id,
          userId: collaboratorId
        }
      });

      // Check if folder still has other collaborators
      const remainingCollaborators = await tx.folderCollaborator.count({
        where: { folderId: id }
      });

      // Update isShared flag if no more collaborators
      if (remainingCollaborators === 0) {
        await tx.folder.update({
          where: { id },
          data: { isShared: false }
        });
      }
    });

    res.json({
      success: true,
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove collaborator',
      error: error.message
    });
  }
};