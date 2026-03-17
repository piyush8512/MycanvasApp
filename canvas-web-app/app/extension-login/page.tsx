"use client";

import { useEffect, useState } from "react";
import { useAuth, SignIn } from "@clerk/nextjs";

// Read the Extension ID from your environment variables
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;
const DEFAULT_EXTENSION_TOKEN_TEMPLATE = "canvas_extension";
const EXTENSION_TOKEN_TEMPLATE =
  process.env.NEXT_PUBLIC_CLERK_EXTENSION_TOKEN_TEMPLATE?.trim() ||
  DEFAULT_EXTENSION_TOKEN_TEMPLATE;

async function getExtensionBridgeToken(
  getToken: ReturnType<typeof useAuth>["getToken"],
) {
  try {
    const templateToken = await getToken({
      template: EXTENSION_TOKEN_TEMPLATE,
      skipCache: true,
    });

    if (templateToken) {
      return templateToken;
    }

    throw new Error("Template token was empty");
  } catch (error) {
    console.error("Extension template token fetch failed", error);
    throw new Error(
      `Could not fetch template token \"${EXTENSION_TOKEN_TEMPLATE}\". Verify Clerk template and NEXT_PUBLIC_CLERK_EXTENSION_TOKEN_TEMPLATE.`,
    );
  }
}

export default function ExtensionLogin() {
  const { isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState("Loading authentication...");
  const [targetExtensionId, setTargetExtensionId] = useState<string | null>(
    EXTENSION_ID ?? null,
  );

  useEffect(() => {
    // Prefer an explicit extension ID passed by the popup for dev reliability.
    const fromQuery = new URLSearchParams(window.location.search).get(
      "extensionId",
    );
    if (fromQuery) {
      setTargetExtensionId(fromQuery);
    }
  }, []);

  useEffect(() => {
    if (!targetExtensionId) {
      setStatus(
        "Error: Extension ID is missing. Set NEXT_PUBLIC_EXTENSION_ID or open this page from the extension popup.",
      );
      return;
    }

    if (isSignedIn) {
      setStatus("Success! Sending token to extension...");

      const sendToken = async () => {
        try {
          // 1. Get auth token from Clerk (extension template preferred)
          const token = await getExtensionBridgeToken(getToken);

          if (!token) {
            setStatus("Error: Could not get auth token. Please sign in again.");
            return;
          }

          // 2. Send the token to the extension
          // We check if 'chrome.runtime' exists to prevent errors
          if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(
              targetExtensionId,
              { type: "AUTH_SUCCESS", token: token },
              (response) => {
                const runtimeError = chrome.runtime.lastError;

                if (runtimeError) {
                  // This happens if the extension isn't running or listening
                  console.error(
                    "Extension message error:",
                    runtimeError.message || runtimeError,
                  );
                  setStatus(
                    `Error: ${
                      runtimeError.message ||
                      "Could not connect to extension. Please make sure it's installed and enabled."
                    }`,
                  );
                } else if (!response?.success) {
                  setStatus(
                    `Error: ${
                      response?.error ||
                      "Extension rejected the login request from this origin."
                    }`,
                  );
                } else {
                  // 3. Success! Close this tab
                  setStatus("Token sent. You can close this tab.");
                  window.close();
                }
              },
            );
          } else {
            // This runs if the page is opened in a normal browser tab
            setStatus(
              "Error: Not in an extension context. Please open this from your Chrome extension.",
            );
          }
        } catch (error) {
          console.error("Error getting token", error);
          setStatus("Error: Could not get auth token.");
        }
      };

      sendToken();
    }
  }, [isSignedIn, getToken, targetExtensionId]);

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
            fallbackRedirectUrl="/extension-login"
            forceRedirectUrl="/extension-login"
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
