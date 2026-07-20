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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
