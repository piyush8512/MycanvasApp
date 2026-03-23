import { createApp } from "../src/app.js";


//for vercel deployment, the serverless function needs to export the app instance directly
const app = createApp({
  includeRootHealth: true,
  includeApiHealth: true,
  includeRequestTimingLogs: true,
  includeErrorHandler: true,
});

export default app;