// const normal = {
//   primary: "#4F46E5",
//   secondary: "#6B7280",
//   background: "#FFFFFF",
//   textLight: "#F9FAFB",
//   expense: "#EF4444",
// };

// const authDark = {
//   primary: "#FF6B35",
//   background: "#000000",
//   card: "#262626",
//   text: "#ffffff",
//   textLight: "#9ca3af",
//   border: "#404040",
//   error: "#ef4444",
//   success: "#10b981",

// };

// // --- This is the export ---
// const COLORS = {
//   ...normal,
//   ...authDark,
// };

// export default COLORS;


const normal = {
  primary: "#4F46E5",
  secondary: "#6B7280",
  background: "#FFFFFF",
  textLight: "#F9FAFB",
  expense: "#EF4444",
};

const darkTheme = {
  primary: "#FF6B35",
  background: "#121212",
  card: "#1C1C1C",
  text: "#FFFFFF",
  textLight: "#A0A0A0",
  border: "#2C2C2C",
  error: "#ef4444",
  success: "#10b981",

  // --- THIS IS THE FIX ---
  // Add "as const" to tell TypeScript this is a readonly tuple
  gradient: ['#ff6b3d', '#ff8c5a'] as const,
  // --- END FIX ---
  
  gradientText: '#FFFFFF',
};

const COLORS = {
  ...normal,
  ...darkTheme,
};

export default COLORS;