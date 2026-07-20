import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SERVER_REQUIRED = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "SESSION_SECRET",
  "FRONTEND_URL",
  "SENDER_EMAIL",
  "SENDER_PASSWORD",
  "ADMIN_EMAIL",
];

const CLIENT_REQUIRED = ["VITE_SERVER_URL"];

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return null;
  const vars = {};
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

function checkPlaceholders(vars, keys, { allowLocalhost = false } = {}) {
  const issues = [];
  for (const key of keys) {
    const value = vars[key];
    if (!value) {
      issues.push(`Missing ${key}`);
      continue;
    }
    if (
      /your_|example\.com|change_me|here$/i.test(value) ||
      (!allowLocalhost && /localhost/i.test(value))
    ) {
      issues.push(`${key} still looks like a placeholder: ${value}`);
    }
  }
  return issues;
}

export function runEnvCheck({ strict = false } = {}) {
  const messages = [];
  let ok = true;

  const serverExample = join(root, "server", ".env.example");
  const clientExample = join(root, "client", ".env.example");
  const serverEnv = join(root, "server", ".env");
  const clientEnv = join(root, "client", ".env");

  if (!existsSync(serverExample)) {
    messages.push("Missing server/.env.example");
    ok = false;
  }

  if (!existsSync(clientExample)) {
    messages.push("Missing client/.env.example");
    ok = false;
  }

  if (existsSync(serverEnv)) {
    const vars = parseEnvFile(serverEnv);
    const issues = checkPlaceholders(vars, SERVER_REQUIRED, {
      allowLocalhost: !strict,
    });
    if (issues.length) {
      messages.push(`server/.env issues:\n  - ${issues.join("\n  - ")}`);
      if (strict) ok = false;
    } else {
      messages.push(
        strict
          ? "server/.env: all required keys present"
          : "server/.env: all required keys present (development URLs allowed)"
      );
    }
  } else {
    messages.push("server/.env not found — copy from server/.env.example");
    if (strict) ok = false;
  }

  if (existsSync(clientEnv)) {
    const vars = parseEnvFile(clientEnv);
    const issues = checkPlaceholders(vars, CLIENT_REQUIRED, {
      allowLocalhost: !strict,
    });
    if (issues.length) {
      messages.push(`client/.env issues:\n  - ${issues.join("\n  - ")}`);
      if (strict) ok = false;
    } else {
      messages.push(
        strict
          ? "client/.env: all required keys present"
          : "client/.env: all required keys present (development URLs allowed)"
      );
    }
  } else {
    messages.push("client/.env not found — copy from client/.env.example");
    if (strict) ok = false;
  }

  // Cross-check deployment alignment hints
  const serverVars = parseEnvFile(serverEnv);
  const clientVars = parseEnvFile(clientEnv);
  if (serverVars?.FRONTEND_URL && clientVars?.VITE_SERVER_URL) {
    if (
      serverVars.FRONTEND_URL.includes("localhost") &&
      !clientVars.VITE_SERVER_URL.includes("localhost")
    ) {
      messages.push(
        "Deployment mismatch: server FRONTEND_URL is localhost but client API URL is remote"
      );
      if (strict) ok = false;
    }
  }

  return { ok, messages };
}

if (process.argv[1]?.endsWith("check-env.mjs")) {
  const strict = process.argv.includes("--strict");
  const result = runEnvCheck({ strict });
  console.log(result.messages.join("\n"));
  process.exit(result.ok ? 0 : 1);
}
