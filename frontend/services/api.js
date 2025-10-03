import axios from "axios";
export const syncUserWithBackend = async (getToken) => {
  try {
    const token = await getToken();
    if (!token) {
      console.log("No token found, skipping sync.");
      return;
    }

    // IMPORTANT: Replace with your actual backend URL
    const backendUrl = "http://192.168.1.33:3000/api/v1/users/sync";

    await axios.post(
      backendUrl,
      {}, // The body is empty because the JWT in the header has all the info
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ User synced successfully with backend.");

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("❌ Error syncing user with backend:", errorMessage);
  }
};