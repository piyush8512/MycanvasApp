import prisma from "../config/prisma.js";

/**
 * Get user's layout positions for all canvases (files)
 * Returns positions specific to this user
 */
export const getCanvasLayouts = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const layouts = await prisma.userCanvasLayout.findMany({
      where: {
        userId: dbUser.id,
      },
    });

    res.status(200).json({
      success: true,
      layouts,
    });
  } catch (error) {
    console.error("Failed to get canvas layouts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get canvas layouts",
      error: error.message,
    });
  }
};

/**
 * Update or create a canvas position for the current user
 * This is user-specific - won't affect other users' layouts
 */
export const updateCanvasLayout = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { positionX, positionY } = req.body;
    const clerkId = req.auth.userId;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the file exists
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

    // Upsert: Update if exists, create if not
    const layout = await prisma.userCanvasLayout.upsert({
      where: {
        userId_fileId: {
          userId: dbUser.id,
          fileId: fileId,
        },
      },
      update: {
        positionX: positionX,
        positionY: positionY,
      },
      create: {
        userId: dbUser.id,
        fileId: fileId,
        positionX: positionX,
        positionY: positionY,
      },
    });

    res.status(200).json({
      success: true,
      message: "Canvas layout updated successfully",
      layout,
    });
  } catch (error) {
    console.error("Failed to update canvas layout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update canvas layout",
      error: error.message,
    });
  }
};

/**
 * Bulk update multiple canvas positions at once
 * Useful for saving entire dashboard layout
 */
export const bulkUpdateCanvasLayouts = async (req, res) => {
  try {
    const { layouts } = req.body; // Array of { fileId, positionX, positionY }
    const clerkId = req.auth.userId;

    if (!layouts || !Array.isArray(layouts)) {
      return res.status(400).json({
        success: false,
        message: "layouts array is required",
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Use a transaction to update all layouts at once
    const updatedLayouts = await prisma.$transaction(
      layouts.map((layout) =>
        prisma.userCanvasLayout.upsert({
          where: {
            userId_fileId: {
              userId: dbUser.id,
              fileId: layout.fileId,
            },
          },
          update: {
            positionX: layout.positionX,
            positionY: layout.positionY,
          },
          create: {
            userId: dbUser.id,
            fileId: layout.fileId,
            positionX: layout.positionX,
            positionY: layout.positionY,
          },
        })
      )
    );

    res.status(200).json({
      success: true,
      message: "Canvas layouts updated successfully",
      layouts: updatedLayouts,
    });
  } catch (error) {
    console.error("Failed to bulk update canvas layouts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk update canvas layouts",
      error: error.message,
    });
  }
};

/**
 * Get user's layout positions for all folders
 */
export const getFolderLayouts = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const layouts = await prisma.userFolderLayout.findMany({
      where: {
        userId: dbUser.id,
      },
    });

    res.status(200).json({
      success: true,
      layouts,
    });
  } catch (error) {
    console.error("Failed to get folder layouts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get folder layouts",
      error: error.message,
    });
  }
};

/**
 * Update or create a folder position for the current user
 */
export const updateFolderLayout = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { positionX, positionY } = req.body;
    const clerkId = req.auth.userId;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the folder exists
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Upsert: Update if exists, create if not
    const layout = await prisma.userFolderLayout.upsert({
      where: {
        userId_folderId: {
          userId: dbUser.id,
          folderId: folderId,
        },
      },
      update: {
        positionX: positionX,
        positionY: positionY,
      },
      create: {
        userId: dbUser.id,
        folderId: folderId,
        positionX: positionX,
        positionY: positionY,
      },
    });

    res.status(200).json({
      success: true,
      message: "Folder layout updated successfully",
      layout,
    });
  } catch (error) {
    console.error("Failed to update folder layout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update folder layout",
      error: error.message,
    });
  }
};

/**
 * Bulk update multiple folder positions at once
 */
export const bulkUpdateFolderLayouts = async (req, res) => {
  try {
    const { layouts } = req.body; // Array of { folderId, positionX, positionY }
    const clerkId = req.auth.userId;

    if (!layouts || !Array.isArray(layouts)) {
      return res.status(400).json({
        success: false,
        message: "layouts array is required",
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Use a transaction to update all layouts at once
    const updatedLayouts = await prisma.$transaction(
      layouts.map((layout) =>
        prisma.userFolderLayout.upsert({
          where: {
            userId_folderId: {
              userId: dbUser.id,
              folderId: layout.folderId,
            },
          },
          update: {
            positionX: layout.positionX,
            positionY: layout.positionY,
          },
          create: {
            userId: dbUser.id,
            folderId: layout.folderId,
            positionX: layout.positionX,
            positionY: layout.positionY,
          },
        })
      )
    );

    res.status(200).json({
      success: true,
      message: "Folder layouts updated successfully",
      layouts: updatedLayouts,
    });
  } catch (error) {
    console.error("Failed to bulk update folder layouts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk update folder layouts",
      error: error.message,
    });
  }
};

/**
 * Delete a canvas layout (reset to default position)
 */
export const deleteCanvasLayout = async (req, res) => {
  try {
    const { fileId } = req.params;
    const clerkId = req.auth.userId;

    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.userCanvasLayout.delete({
      where: {
        userId_fileId: {
          userId: dbUser.id,
          fileId: fileId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Canvas layout deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete canvas layout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete canvas layout",
      error: error.message,
    });
  }
};
