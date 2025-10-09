// load environment virables from .env file to process.env
import "dotenv/config";

import {
  initializeModels,
  defineModelRelations,
  initializeDatabase,
  app,
} from "./core/server.js";

// Load environment variable configurations, set server protocol, host, port
const PORT = Number(process.env.PORT || 8000);

// start the server
async function startServer() {
  initializeModels();
  defineModelRelations();
  await initializeDatabase();
  try {
    app.listen(PORT, () => {
      console.log(
        `server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("failed to start", error);
  }
}

startServer();
