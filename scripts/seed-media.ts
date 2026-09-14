import { connectMongo } from "@/lib/db";
import { Media } from "@/modules/media/media.model";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function loadEnvFile(name: string) {
  const filePath = join(process.cwd(), name);
  if (!existsSync(filePath)) return;

  const fs = require("node:fs");
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.example");

const IMAGE_EXT = /\.(avif|jpe?g|png|webp)$/i;

function getMimeType(filename: string) {
  if (/\.avif$/i.test(filename)) return "image/avif";
  if (/\.webp$/i.test(filename)) return "image/webp";
  if (/\.png$/i.test(filename)) return "image/png";
  if (/\.jpe?g$/i.test(filename)) return "image/jpeg";
  return "application/octet-stream";
}

function formatAltText(filename: string) {
  const name = filename.replace(/\.[^.]+$/, "");
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function scanDir(dir: string, baseDir: string, results: { url: string; filename: string; mimeType: string; sizeBytes: number }[] = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, baseDir, results);
    } else if (IMAGE_EXT.test(file)) {
      const url = "/" + fullPath.replace(baseDir, "").replace(/^[/\\]+/, "").replaceAll("\\", "/");
      results.push({
        url,
        filename: file,
        mimeType: getMimeType(file),
        sizeBytes: stat.size,
      });
    }
  }
  return results;
}

async function seedMedia() {
  await connectMongo();
  const publicImagesDir = join(process.cwd(), "public", "images");
  if (!existsSync(publicImagesDir)) {
    console.log("No public/images directory found.");
    process.exit(0);
  }

  const assets = scanDir(publicImagesDir, join(process.cwd(), "public"));
  
  // Explicitly add logos from public root
  const rootLogos = ["logo.dark.png", "logo.light.png"];
  for (const logo of rootLogos) {
    const fullPath = join(process.cwd(), "public", logo);
    if (existsSync(fullPath)) {
      const stat = statSync(fullPath);
      assets.push({
        url: "/" + logo,
        filename: logo,
        mimeType: getMimeType(logo),
        sizeBytes: stat.size,
      });
    }
  }

  console.log(`Found ${assets.length} image assets in public/`);

  let count = 0;
  for (const asset of assets) {
    const altText = formatAltText(asset.filename);
    await Media.updateOne(
      { url: asset.url },
      {
        $setOnInsert: {
          filename: asset.filename,
          url: asset.url,
          mimeType: asset.mimeType,
          sizeBytes: asset.sizeBytes,
          altText,
        },
      },
      { upsert: true }
    );
    count++;
  }

  console.log(`Successfully seeded ${count} media assets.`);
  process.exit(0);
}

seedMedia().catch((err) => {
  console.error(err);
  process.exit(1);
});
