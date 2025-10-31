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
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const canvas = await prisma.file.findMany({
      where: {
        ownerId: dbUser.id,
        folderId: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Canvas fetched successfully',
      canvas
    });
  } catch (error) {
    console.error('Failed to fetch canvas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canvas',
      error: error.message
    });
  }
};

//get canvas item that it contain 

export const canvasItems = async (req, res) => {
  try {
    const canvasId = req.params.canvasId;

    const canvas = await prisma.file.findUnique({
      where: { id: canvasId }
    });

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: 'Canvas not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Canvas items fetched successfully',
      canvas
    });
  } catch (error) {
    console.error('Failed to fetch canvas items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canvas items',
      error: error.message
    });
  }
};  

//by folder id is in folder controller


