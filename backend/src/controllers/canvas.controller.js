// import prisma from "../config/prisma.js";

// export const createCanvas = async (req, res) => {
//   try {
//     // Get name and an OPTIONAL folderId from the request body
//     const { name, folderId } = req.body;

//     // --- 1. Validate Input ---
//     if (!name || name.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Canvas name is required",
//       });
//     }

//     // --- 2. Prepare Canvas Data ---
//     // This object will be sent to Prisma
//     const canvasData = {
//       name,
//     };

//     // --- 3. Handle Folder Logic (if folderId is provided) ---
//     if (folderId) {
//       // If a folderId is given, first check if that folder actually exists
//       const folderExists = await prisma.folder.findUnique({
//         where: { id: folderId },
//       });
//       console.log(folderExists);

//       // If the folder doesn't exist, return an error
//       if (!folderExists) {
//         return res.status(404).json({
//           success: false,
//           message: "Folder not found",
//         });
//       }

//       // If folder exists, add the folderId to the data we're creating
//       canvasData.folderId = folderId;
//     }

//     // --- 4. Create Canvas (inside or outside a folder) ---
//     // Use a transaction (like in your original code)
//     const result = await prisma.$transaction(async (tx) => {
//       const canvas = await tx.file.create({
//         data: canvasData, // Pass the prepared data
//       });
//       return canvas;
//     });

//     res.status(201).json({
//       success: true,
//       message: "Canvas created successfully",
//       canvas: result,
//     });
//   } catch (error) {
//     console.error("Failed to create canvas:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create canvas",
//       error: error.message,
//     });
//   }
// };






// import prisma from "../config/prisma.js";


// //create canvas
// export const createCanvas = async (req, res) => {
//   try {
//     // --- 1. Get User (You were missing this) ---
//     // This assumes req.auth.userId is available from your auth middleware
//     const clerkId = req.auth.userId;
//     if (!clerkId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId },
//     });

//     if (!dbUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // --- 2. Get Request Body ---
//     const { name, folderId } = req.body;

//     if (!name || name.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         message: "Canvas name is required",
//       });
//     }

//     // --- 3. Handle Optional Folder ---
//     let folder = null; // Use this to store the folder if it exists
//     if (folderId) {
//       folder = await prisma.folder.findUnique({
//         where: { id: folderId },
//       });

//       if (!folder) {
//         return res.status(404).json({
//           success: false,
//           message: "Folder not found",
//         });
//       }
//     }

//     // --- 4. Create Canvas with Custom URL (in a transaction) ---
//     const newCanvas = await prisma.$transaction(async (tx) => {
      
//       // Step A: Create the file
//       // We must provide all required fields: name, ownerId, size, url
//       const canvas = await tx.file.create({
//         data: {
//           name: name.trim(),
//           ownerId: dbUser.id,
//           size: 0, // A new canvas is 0 bytes
//           url: "temp-url", // A temporary placeholder, since URL is required
//           folderId: folder ? folder.id : null, // Add folderId if it exists
//         },
//       });

//       // Step B: Create the custom URL using the new canvas's ID
//       const customUrl = `/canvas/${canvas.id}`;

//       // Step C: Update the file with its real, permanent URL
//       const updatedCanvas = await tx.file.update({
//         where: { id: canvas.id },
//         data: {
//           url: customUrl,
//         },
//       });

//       return updatedCanvas; // Return the fully updated canvas
//     });

//     res.status(201).json({
//       success: true,
//       message: "Canvas created successfully",
//       canvas: newCanvas,
//     });

//   } catch (error) {
//     console.error("Failed to create canvas:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create canvas",
//       error: error.message,
//     });
//   }
// };


// //get all canvas by not having folder id
// export const getAllCanvas = async (req, res) => {
//   try {
//     const userId = req.auth.userId;

//     // Get user from database
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId: userId }
//     });

//     if (!dbUser) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const canvas = await prisma.file.findMany({
//       where: {
//         ownerId: dbUser.id,
//         folderId: null
//       }
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Canvas fetched successfully',
//       canvas
//     });
//   } catch (error) {
//     console.error('Failed to fetch canvas:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch canvas',
//       error: error.message
//     });
//   }
// };

// //get canvas item that it contain 

// export const canvasItems = async (req, res) => {
//   try {
//     const canvasId = req.params.canvasId;

//     const canvas = await prisma.file.findUnique({
//       where: { id: canvasId }
//     });

//     if (!canvas) {
//       return res.status(404).json({
//         success: false,
//         message: 'Canvas not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Canvas items fetched successfully',
//       canvas
//     });
//   } catch (error) {
//     console.error('Failed to fetch canvas items:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch canvas items',
//       error: error.message
//     });
//   }
// };  

// //by folder id is in folder controller


// export const getCanvasItems = async (req, res) => {
//   try {
//     const { canvasId } = req.params;
//     const clerkId = req.auth.userId;

//     // TODO: Add logic to verify user has access to this canvas
//     // For now, we just fetch all items for the canvas
    
//     const items = await prisma.canvasItem.findMany({
//       where: {
//         canvasId: canvasId,
//       },
//       // You can order them if you like
//       // orderBy: {
//       //   createdAt: 'asc',
//       // }
//     });

//     res.status(200).json({
//       success: true,
//       items: items,
//     });

//   } catch (error) {
//     console.error("Failed to get canvas items:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get canvas items",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Create a new item on a canvas
//  * (This is the controller you provided, with a small fix)
//  */
// export const createItem = async (req, res) => {
//   try {
//     const { canvasId } = req.params;
//     const clerkId = req.auth.userId;

//     // Get the card data from the request body
//     const { type, name, color, position, size, content } = req.body;

//     // 1. Get the DB user (owner)
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId },
//     });
//     if (!dbUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 2. Find the parent canvas (which is a 'File')
//     const canvasFile = await prisma.file.findUnique({
//       where: { id: canvasId },
//     });
//     if (!canvasFile) {
//       return res.status(404).json({ message: "Canvas not found" });
//     }

//     // TODO: Check if user has permission to edit this canvas

//     // 3. Create the new canvas item
//     const newItem = await prisma.canvasItem.create({
//       data: {
//         type: type,
//         name: name,
//         color: color,
//         position: position,
//         size: size,
//         content: content, // This will store the JSON blob
//         createdBy: dbUser.id, // Link to DB user ID
//         canvasId: canvasFile.id, // Link to canvas ID
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Item created successfully",
//       item: newItem,
//     });
//   } catch (error) {
//     console.error("Failed to create canvas item:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create canvas item",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Update an existing item on a canvas
//  */
// export const updateItem = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const clerkId = req.auth.userId;
    
//     // Get the data to update from the body
//     // This could be { position: ... } or { content: ... }
//     const { position, size, name, color, content } = req.body;

//     // TODO: Verify user has permission to edit this item

//     const updatedItem = await prisma.canvasItem.update({
//       where: {
//         id: itemId,
//       },
//       data: {
//         position,
//         size,
//         name,
//         color,
//         content,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Item updated successfully",
//       item: updatedItem,
//     });

//   } catch (error) {
//     console.error("Failed to update canvas item:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update canvas item",
//       error: error.message,
//     });
//   }
// };



import prisma from "../config/prisma.js";

//create canvas
export const createCanvas = async (req, res) => {
  try {
    // --- 1. Get User (You were missing this) ---
    // This assumes req.auth.userId is available from your auth middleware
    const clerkId = req.auth.userId;
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
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

    // --- 2. Get Request Body ---
    const { name, folderId } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Canvas name is required",
      });
    }

    // --- 3. Handle Optional Folder ---
    let folder = null; // Use this to store the folder if it exists
    if (folderId) {
      folder = await prisma.folder.findUnique({
        where: { id: folderId },
      });

      if (!folder) {
        return res.status(404).json({
          success: false,
          message: "Folder not found",
        });
      }
    }

    // --- 4. Create Canvas with Custom URL (in a transaction) ---
    const newCanvas = await prisma.$transaction(async (tx) => {
      // Step A: Create the file
      // We must provide all required fields: name, ownerId, size, url
      const canvas = await tx.file.create({
        data: {
          name: name.trim(),
          ownerId: dbUser.id,
          size: 0, // A new canvas is 0 bytes
          url: "temp-url", // A temporary placeholder, since URL is required
          folderId: folder ? folder.id : null, // Add folderId if it exists
        },
      });

      // Step B: Create the custom URL using the new canvas's ID
      const customUrl = `/canvas/${canvas.id}`;

      // Step C: Update the file with its real, permanent URL
      const updatedCanvas = await tx.file.update({
        where: { id: canvas.id },
        data: {
          url: customUrl,
        },
      });

      return updatedCanvas; // Return the fully updated canvas
    });

    res.status(201).json({
      success: true,
      message: "Canvas created successfully",
      canvas: newCanvas,
    });
  } catch (error) {
    console.error("Failed to create canvas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create canvas",
      error: error.message,
    });
  }
};

//get all canvas by not having folder id
export const getAllCanvas = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const canvas = await prisma.file.findMany({
      where: {
        ownerId: dbUser.id,
        folderId: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Canvas fetched successfully",
      canvas,
    });
  } catch (error) {
    console.error("Failed to fetch canvas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch canvas",
      error: error.message,
    });
  }
};

// --- RENAMED & FIXED ---
// This function gets the DETAILS for a single canvas (File)
// (Previously named canvasItems)
export const getCanvasDetails = async (req, res) => {
  try {
    const canvasId = req.params.id; // Changed from .canvasId to .id to match route

    const canvas = await prisma.file.findUnique({
      where: { id: canvasId },
      // You can include owner details if needed
      // include: {
      //   owner: { select: { name: true, email: true } }
      // }
    });

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: "Canvas not found",
      });
    }

    // TODO: Verify user has access to this canvas

    res.status(200).json({
      success: true,
      message: "Canvas details fetched successfully",
      canvas: canvas, // Send the canvas file object
    });
  } catch (error) {
    console.error("Failed to fetch canvas details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch canvas details",
      error: error.message,
    });
  }
};

// This is your CORRECT function to get all items
export const getCanvasItems = async (req, res) => {
  try {
    const { canvasId } = req.params;
    const clerkId = req.auth.userId;

    // TODO: Add logic to verify user has access to this canvas
    // For now, we just fetch all items for the canvas

    const items = await prisma.canvasItem.findMany({
      where: {
        canvasId: canvasId,
      },
      // You can order them if you like
      // orderBy: {
      //   createdAt: 'asc',
      // }
    });

    res.status(200).json({
      success: true,
      items: items,
    });
  } catch (error) {
    console.error("Failed to get canvas items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get canvas items",
      error: error.message,
    });
  }
};

/**
 * Create a new item on a canvas
 * (This is the controller you provided, with a small fix)
 */
export const createItem = async (req, res) => {
  try {
    const { canvasId } = req.params; // Correctly get canvasId from URL
    const clerkId = req.auth.userId;

    // Get the card data from the request body
    // --- FIX: Use your flat canvaitems interface ---
    const {
      type,
      name,
      color,
      position,
      size,
      content,
      url,
      videoId,
      note,
      title,
    } = req.body;

    // 1. Get the DB user (owner)
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find the parent canvas (which is a 'File')
    const canvasFile = await prisma.file.findUnique({
      where: { id: canvasId },
    });
    if (!canvasFile) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    // TODO: Check if user has permission to edit this canvas

    // 3. Create the new canvas item
    const newItem = await prisma.canvasItem.create({
      data: {
        type: type,
        // --- FIX: Use all fields from your interface ---
        name: name,
        title: title,
        content: content,
        note: note,
        url: url,
        videoId: videoId,
        color: color,
        position: position,
        size: size,
        // --- End Fix ---
        createdBy: dbUser.id, // Link to DB user ID
        canvasId: canvasFile.id, // Link to canvas ID
      },
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Failed to create canvas item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create canvas item",
      error: error.message,
    });
  }
};

/**
 * Update an existing item on a canvas
 */
export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const clerkId = req.auth.userId;

    // Get the data to update from the body
    // This could be { position: ... } or { content: ... }
    // --- FIX: Use all fields from your interface ---
    const {
      position,
      size,
      name,
      color,
      content,
      url,
      videoId,
      note,
      title,
    } = req.body;

    // TODO: Verify user has permission to edit this item

    const updatedItem = await prisma.canvasItem.update({
      where: {
        id: itemId,
      },
      data: {
        // --- FIX: Only update fields that are sent ---
        // (This prevents overwriting fields with 'undefined')
        ...(position !== undefined && { position }),
        ...(size !== undefined && { size }),
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
        ...(color !== undefined && { color }),
        ...(content !== undefined && { content }),
        ...(note !== undefined && { note }),
        ...(url !== undefined && { url }),
        ...(videoId !== undefined && { videoId }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Failed to update canvas item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update canvas item",
      error: error.message,
    });
  }
};

// delete cavasn by id 
export const deleteCanvas = async (req, res) => {
  try {
    // --- FIX ---
    // The route parameter is 'id', not 'canvasId'
    const { id } = req.params;
    
    // TODO: Verify user is the owner before deleting

    const canvas = await prisma.file.delete({
      where: {
        id: id, // Use the correct variable
      },
    });

    res.status(200).json({
      success: true,
      message: "Canvas deleted successfully",
      canvas,
    });
  } catch (error) {
    console.error("Failed to delete canvas:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete canvas",
      error: error.message,
    });
  }
};
