import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(name: string) {
  const filePath = resolve(process.cwd(), name);
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.example");
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "test-only-auth-secret-not-for-production";
}
if (!process.env.APP_URL) {
  process.env.APP_URL = "http://localhost:3000";
}
