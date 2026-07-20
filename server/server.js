import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertEnvOrExit } from "./config/validateEnv.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Validate production configuration before loading the app, which opens the
// database connection during startup.
assertEnvOrExit();

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const shutdown = (signal) => {
  console.log(`${signal} received; closing HTTP server.`);
  server.close(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.connection.close();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
