import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const SECURITY_PATTERNS = [
  {
    id: "admin-bypass",
    severity: "critical",
    pattern: /BYPASS START|return next\(\);\s*\/\/\s*BYPASS/i,
    message: "Admin or auth bypass detected in middleware",
  },
  {
    id: "hardcoded-secret",
    severity: "high",
    pattern: /(JWT_SECRET|SESSION_SECRET|MONGO_URI)\s*=\s*['"][^'"]+['"]/,
    message: "Hardcoded secret in source code",
    ignoreExtensions: [".example", ".md", ".mjs"],
  },
  {
    id: "eval-usage",
    severity: "critical",
    pattern: /\beval\s*\(/,
    message: "eval() usage is a security risk",
  },
  {
    id: "default-session-secret",
    severity: "high",
    pattern: /SESSION_SECRET\s*\|\|\s*["']mindsettler_secret_key["']/,
    message: "Fallback session secret in production code",
  },
];

const IGNORE_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "reports",
  "coverage",
]);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function isGitIgnored(rootDir, file) {
  const gitCheck = spawnSync("git", ["check-ignore", "-q", file], {
    cwd: rootDir,
    shell: process.platform === "win32",
  });
  return gitCheck.status === 0;
}

export function runSecurityAudit(rootDir) {
  const findings = [];
  const scanRoots = [
    join(rootDir, "server"),
    join(rootDir, "client", "src"),
  ];

  for (const scanRoot of scanRoots) {
    for (const filePath of walk(scanRoot)) {
      const content = readFileSync(filePath, "utf8");
      const relPath = relative(rootDir, filePath);

      for (const rule of SECURITY_PATTERNS) {
        if (rule.ignoreExtensions?.some((ext) => relPath.endsWith(ext))) continue;
        if (rule.pattern.test(content)) {
          findings.push({
            severity: rule.severity,
            rule: rule.id,
            file: relPath,
            message: rule.message,
          });
        }
      }
    }
  }

  // Deployment checks
  if (!existsSync(join(rootDir, "render.yaml"))) {
    findings.push({
      severity: "medium",
      rule: "missing-render-config",
      file: "render.yaml",
      message: "Backend deployment config (render.yaml) is missing",
    });
  }

  if (existsSync(join(rootDir, "server", ".env"))) {
    let isTracked = false;
    try {
      const gitCheck = spawnSync("git", ["ls-files", "--error-unmatch", "server/.env"], {
        cwd: rootDir,
        shell: process.platform === "win32",
      });
      if (gitCheck.status === 0) {
        isTracked = true;
      }
    } catch {
      // ignore
    }

    if (isTracked) {
      findings.push({
        severity: "critical",
        rule: "env-tracked-in-repo",
        file: "server/.env",
        message: "server/.env is tracked/committed in git! Remove it from git history immediately.",
      });
    } else if (!isGitIgnored(rootDir, "server/.env")) {
      findings.push({
        severity: "medium",
        rule: "env-in-repo",
        file: "server/.env",
        message: "server/.env exists locally but is not gitignored",
      });
    }
  }

  if (
    existsSync(join(rootDir, "client", ".env")) &&
    !isGitIgnored(rootDir, "client/.env")
  ) {
    findings.push({
      severity: "medium",
      rule: "client-env-local",
      file: "client/.env",
      message: "client/.env exists locally but is not gitignored",
    });
  }

  const critical = findings.filter((f) => f.severity === "critical");
  const high = findings.filter((f) => f.severity === "high");

  const lines = [];
  if (findings.length === 0) {
    lines.push("No security issues detected.");
  } else {
    for (const finding of findings) {
      lines.push(
        `[${finding.severity.toUpperCase()}] ${finding.rule}: ${finding.message} (${finding.file})`
      );
    }
  }

  return {
    ok: critical.length === 0 && high.length === 0,
    findings,
    report: lines.join("\n"),
  };
}
