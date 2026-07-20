const REQUIRED_ALWAYS = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRE", "FRONTEND_URL"];

const REQUIRED_PRODUCTION = [
  "SESSION_SECRET",
  "SENDER_EMAIL",
  "SENDER_PASSWORD",
  "ADMIN_EMAIL",
];

const PLACEHOLDER_PATTERN = /your_|example\.com|change_me|replace_me/i;

export function validateEnv() {
  const errors = [];
  const warnings = [];

  for (const key of REQUIRED_ALWAYS) {
    if (!process.env[key]?.trim()) {
      errors.push(`${key} is required`);
    }
  }

  if (process.env.NODE_ENV === "production") {
    for (const key of REQUIRED_PRODUCTION) {
      if (!process.env[key]?.trim()) {
        errors.push(`${key} is required in production`);
      }
    }

    if (process.env.FRONTEND_URL?.includes("localhost")) {
      errors.push("FRONTEND_URL must not point to localhost in production");
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      errors.push("JWT_SECRET must be at least 32 characters in production");
    }

    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
      errors.push("SESSION_SECRET must be at least 32 characters in production");
    }
  }

  for (const key of [...REQUIRED_ALWAYS, ...REQUIRED_PRODUCTION]) {
    const value = process.env[key];
    if (value && PLACEHOLDER_PATTERN.test(value)) {
      warnings.push(`${key} appears to contain a placeholder value`);
    }
  }

  return { errors, warnings };
}

export function assertEnvOrExit() {
  const { errors, warnings } = validateEnv();

  for (const warning of warnings) {
    console.warn(`[env] Warning: ${warning}`);
  }

  if (errors.length) {
    console.error("[env] Missing required environment variables:");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }
}
