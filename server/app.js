import {initializeModels, initializeDatabase, app} from "./core/server.js";

// Load environment variable configurations, set server protocol, host, port
const PROTOCOL = process.env.PROTOCOL || "http";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8000;

// start the server
async function startServer() {
  initializeModels();
  await initializeDatabase();
  try {
    app.listen(PORT, () => {
    console.log(`server running successfully at ${PROTOCOL}://${HOST}:${PORT}`);
  });
  } catch (error) {
    console.error("failed to start", error);
  }  
}

startServer();