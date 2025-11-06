"use client";

import { useEffect, useState } from "react";
import { useAuth, SignIn } from "@clerk/nextjs";

// Read the Extension ID from your environment variables
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

export default function ExtensionLogin() {
  const { isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState("Loading authentication...");

  useEffect(() => {
    if (!EXTENSION_ID) {
      setStatus("Error: EXTENSION_ID is not configured in .env.local");
      return;
    }  

    if (isSignedIn) {
      setStatus("Success! Sending token to extension...");

      const sendToken = async () => {
        try {
          // 1. Get auth token from Clerk
          const token = await getToken();

          // 2. Send the token to the extension
          // We check if 'chrome.runtime' exists to prevent errors
          if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(
              EXTENSION_ID,
              { type: "AUTH_SUCCESS", token: token },
              (response) => {
                if (chrome.runtime.lastError) {
                  // This happens if the extension isn't running or listening
                  console.error(chrome.runtime.lastError);
                  setStatus(
                    "Error: Could not connect to extension. Please make sure it's installed and enabled."
                  );
                } else {
                  // 3. Success! Close this tab
                  setStatus("Token sent. You can close this tab.");
                  window.close();
                }
              }
            );
          } else {
            // This runs if the page is opened in a normal browser tab
            setStatus(
              "Error: Not in an extension context. Please open this from your Chrome extension."
            );
          }
        } catch (error) {
          console.error("Error getting token", error);
          setStatus("Error: Could not get auth token.");
        }
      };

      sendToken();
    }
  }, [isSignedIn, getToken]);

  // If user is NOT logged in, show the Clerk <SignIn> component
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-2">
            Extension Login
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to connect your extension to My Canvas App.
          </p>
          <SignIn
            // This is the key:
            // Force the user to come BACK to this page after logging in
            // instead of going to /dashboard.
            afterSignInUrl="/extension-login"
            afterSignUpUrl="/extension-login"
          />
        </div>
      </div>
    );
  }

  // If user IS logged in, show a status message
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">{status}</h2>
      </div>
    </div>
  );
}
