import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
// Make sure to add these to your backend .env file!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL or Service Key is missing. Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in your .env file."
  );
  throw new Error("Supabase configuration error.");
}

// Create and export the Supabase admin client
// This uses the SERVICE_KEY for admin-level access
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

