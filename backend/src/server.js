import { createApp } from "./app.js";
const PORT = process.env.PORT || 4000;

const app = createApp({
  includeLayoutRoutes: true,
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Clerk authentication enabled`);
  console.log(`📘 API docs available at http://localhost:${PORT}/api-docs`);
});
