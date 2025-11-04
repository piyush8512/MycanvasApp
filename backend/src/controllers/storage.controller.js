import { supabase } from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Get a secure, signed URL for uploading a file
 */
// export const getSignedUploadUrl = async (req, res) => {
//   try {
//     const { fileName, fileType } = req.body;
//     const clerkId = req.auth.userId;
//     console.log(fileType,fileName);

//     if (!fileName || !fileType) {
//       return res
//         .status(400)
//         .json({ success: false, message: "fileName and fileType are required" });
//     }

//     // Create a unique path for the file, namespaced by the user's ID
//     const path = `${clerkId}/${uuidv4()}-${fileName}`;

//     // Get a signed URL from Supabase
//     // This URL is temporary (expires in 60s) and can only be used for POST
//     const { data, error } = await supabase.storage
//       .from("canvas-uploads")
//       .createSignedUrl(path, 60, {
//         httpMethod: "PUT",
//         upsert: false, // Don't allow overwriting files
//         headers: {
//           "Content-Type": fileType,
//         },
//       });

//     if (error) {
//       throw error;
//     }

//     res.status(200).json({
//       success: true,
//       signedUrl: data.signedUrl,
//       path: path, // Send the path back to the client
//     });
//   } catch (error) {
//     console.error("Error creating signed upload URL:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create signed upload URL",
//       error: error.message,
//     });
//   }
// };

export const getSignedUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const clerkId = req.auth.userId;
    console.log("📤 Upload request:", { fileType, fileName });

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ success: false, message: "fileName and fileType are required" });
    }

    // Create a unique path for the file
    const path = `${clerkId}/${uuidv4()}-${fileName}`;
    console.log("📁 Generated path:", path);

    // --- FIX: Use createSignedUploadUrl instead of createSignedUrl ---
    const { data, error } = await supabase.storage
      .from("canvas-uploads")
      .createSignedUploadUrl(path); // ← This is the correct method for uploads!

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Signed upload URL created");

    res.status(200).json({
      success: true,
      signedUrl: data.signedUrl,
      path: path,
      token: data.token, // Also return the token
    });
  } catch (error) {
    console.error("💥 Error creating signed upload URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create signed upload URL",
      error: error.message,
    });
  }
};
/**
 * Get the permanent public URL of a file
 */
export const getPublicUrl = async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) {
      return res
        .status(400)
        .json({ success: false, message: "File 'path' is required" });
    }

    // Get the public URL
    const { data } = supabase.storage
      .from("canvas-uploads")
      .getPublicUrl(path);

    res.status(200).json({
      success: true,
      publicUrl: data.publicUrl,
    });
  } catch (error) {
    console.error("Error getting public URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get public URL",
      error: error.message,
    });
  }
};

/**
 * --- NEW FUNCTION ---
 * Delete a file from Supabase storage
 */
export const deleteFile = async (req, res) => {
  try {
    const { path } = req.body;
    const clerkId = req.auth.userId;

    if (!path) {
      return res
        .status(400)
        .json({ success: false, message: "File 'path' is required" });
    }

    // --- SECURITY CHECK ---
    // This is your "policy"!
    // We check that the file path starts with the user's own ID.
    // This prevents a user from deleting someone else's files.
    if (!path.startsWith(clerkId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete this file.",
      });
    }

    // Delete the file from the bucket
    const { data, error } = await supabase.storage
      .from("canvas-uploads")
      .remove([path]);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

