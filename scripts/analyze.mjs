#!/usr/bin/env node
/**
 * MindSettler unified code analysis runner.
 * Usage: npm run analyze
 *        npm run analyze -- --json
 *        npm run analyze -- --fix
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runSecurityAudit } from "./security-audit.mjs";
import { runEnvCheck } from "./check-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const autoFix = args.includes("--fix");

const results = [];

function runStep(name, command, commandArgs, options = {}) {
  const started = Date.now();
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd || root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  const entry = {
    name,
    ok: result.status === 0,
    durationMs: Date.now() - started,
    output: output.slice(0, 12000),
  };

  results.push(entry);
  return entry;
}

console.log("\n🔍 MindSettler Code Analysis\n" + "=".repeat(40));

// 1. Environment validation
const envResult = runEnvCheck({ strict: false });
results.push({
  name: "Environment files",
  ok: envResult.ok,
  durationMs: 0,
  output: envResult.messages.join("\n"),
});
console.log(envResult.ok ? "✅ Environment files" : "⚠️  Environment files");

// 2. Security audit
const securityResult = runSecurityAudit(root);
results.push({
  name: "Security audit",
  ok: securityResult.ok,
  durationMs: 0,
  output: securityResult.report,
});
console.log(securityResult.ok ? "✅ Security audit" : "❌ Security audit");

// 3. Client lint
const clientLint = runStep(
  "Client ESLint",
  "npm",
  ["run", autoFix ? "lint:fix" : "lint", "--prefix", "client"],
  { cwd: root }
);
console.log(clientLint.ok ? "✅ Client ESLint" : "❌ Client ESLint");

// 4. Server lint
const serverLint = runStep(
  "Server ESLint",
  "npm",
  ["run", autoFix ? "lint:fix" : "lint", "--prefix", "server"],
  { cwd: root }
);
console.log(serverLint.ok ? "✅ Server ESLint" : "❌ Server ESLint");

// 5. Client production build
const clientBuild = runStep(
  "Client build",
  "npm",
  ["run", "build", "--prefix", "client"],
  { cwd: root }
);
console.log(clientBuild.ok ? "✅ Client build" : "❌ Client build");

// 6. Dependency audit
const clientAudit = runStep(
  "Client npm audit",
  "npm",
  ["audit", "--audit-level=high", "--prefix", "client"],
  { cwd: root }
);
console.log(clientAudit.ok ? "✅ Client npm audit" : "⚠️  Client npm audit");

const serverAudit = runStep(
  "Server npm audit",
  "npm",
  ["audit", "--audit-level=high", "--prefix", "server"],
  { cwd: root }
);
console.log(serverAudit.ok ? "✅ Server npm audit" : "⚠️  Server npm audit");

const failed = results.filter((r) => !r.ok);
const summary = {
  passed: results.filter((r) => r.ok).length,
  failed: failed.length,
  total: results.length,
  timestamp: new Date().toISOString(),
  results,
};

console.log("\n" + "=".repeat(40));
console.log(`Summary: ${summary.passed}/${summary.total} checks passed`);

if (failed.length) {
  console.log("\nFailed checks:");
  for (const item of failed) {
    console.log(`  • ${item.name}`);
  }
  console.log("\nRun with --fix to auto-fix lint issues where possible.");
  console.log("Full report: reports/analysis-report.txt\n");
}

const reportsDir = join(root, "reports");
mkdirSync(reportsDir, { recursive: true });

const reportText = results
  .map(
    (r) =>
      `[${r.ok ? "PASS" : "FAIL"}] ${r.name} (${r.durationMs}ms)\n${r.output || "(no output)"}\n`
  )
  .join("\n" + "-".repeat(60) + "\n");

writeFileSync(join(reportsDir, "analysis-report.txt"), reportText);

if (jsonOutput) {
  writeFileSync(
    join(reportsDir, "analysis-report.json"),
    JSON.stringify(summary, null, 2)
  );
}

process.exit(failed.length ? 1 : 0);
