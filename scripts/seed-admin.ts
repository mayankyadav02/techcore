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

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "TechCore Admin";

  if (!email || !password) {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local (password at least 12 characters). Do not commit those values.",
    );
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters.");
    process.exitCode = 1;
    return;
  }

  const { connectMongo, disconnectMongo } = await import("@/lib/db");
  const { User } = await import("@/modules/identity/user.model");
  const { hashPassword } = await import("@/modules/identity/password");
  const { userRoles } = await import("@/modules/shared/enums");

  const roleEnv = process.env.ADMIN_ROLE?.trim();
  const role = userRoles.includes(roleEnv as (typeof userRoles)[number])
    ? (roleEnv as (typeof userRoles)[number])
    : "super_admin";

  await connectMongo();
  try {
    const passwordHash = await hashPassword(password);
    const existing = await User.findOne({ email }).select("+passwordHash");
    if (existing) {
      existing.name = name;
      existing.passwordHash = passwordHash;
      existing.role = role;
      existing.status = "active";
      existing.passwordChangedAt = new Date();
      await existing.save();
      console.log(`Updated admin user for ${email} (${role}).`);
    } else {
      await User.create({
        email,
        name,
        passwordHash,
        role,
        status: "active",
      });
      console.log(`Created admin user for ${email} (${role}).`);
    }
  } finally {
    await disconnectMongo();
  }
}

seedAdmin().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
