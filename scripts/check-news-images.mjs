import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
export const sha256 = (data) => createHash("sha256").update(data).digest("hex");
export const readManifest = async () => JSON.parse(await readFile(new URL("../config/news-image-integrity.json", import.meta.url), "utf8"));

export async function validateImage(data, expected, contentType) {
  assert.equal(data.length, expected.bytes, `${expected.path}: byte length mismatch`);
  assert.equal(sha256(data), expected.sha256, `${expected.path}: SHA-256 mismatch`);
  if (contentType !== undefined) {
    assert.equal(contentType?.split(";")[0].trim().toLowerCase(), `image/${expected.format}`, `${expected.path}: MIME mismatch`);
  }
  const jpeg = data[0] === 0xff && data[1] === 0xd8;
  const png = data.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  assert.ok(expected.format === "jpeg" ? jpeg : expected.format === "png" && png, `${expected.path}: file signature mismatch`);
  const metadata = await sharp(data, { failOn: "warning" }).metadata();
  assert.equal(metadata.format, expected.format, `${expected.path}: decoded format mismatch`);
  assert.equal(metadata.width, expected.width, `${expected.path}: width mismatch`);
  assert.equal(metadata.height, expected.height, `${expected.path}: height mismatch`);
  // metadata() alone does not decode every scanline. Force a complete decode.
  const { data: pixels, info } = await sharp(data, { failOn: "warning" }).raw().toBuffer({ resolveWithObject: true });
  return { bytes: data.length, sha256: sha256(data), pixelSha256: sha256(pixels), width: info.width, height: info.height, channels: info.channels };
}

export async function checkLocalImages() {
  const manifest = await readManifest();
  assert.equal(manifest.version, 1, "unsupported image manifest version");
  const names = await readdir(path.join(projectRoot, "public/images/news"));
  const actual = names.filter((name) => /\.(?:jpe?g|png|webp|avif)$/i.test(name)).map((name) => `/images/news/${name}`).sort();
  assert.deepEqual(manifest.images.map((entry) => entry.path).sort(), actual, "news images and integrity manifest differ; verify the original before recording a new hash");
  const verified = [];
  for (const entry of manifest.images) {
    const data = await readFile(path.join(projectRoot, "public", entry.path));
    verified.push({ path: entry.path, ...await validateImage(data, entry) });
  }
  return verified;
}

async function builtHtmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await builtHtmlFiles(fullPath));
    else if (entry.name.endsWith(".html")) result.push(fullPath);
  }
  return result;
}

export async function checkBuiltReferences() {
  const manifest = await readManifest();
  const known = new Set(manifest.images.map((entry) => entry.path));
  const referenced = new Set();
  const files = await builtHtmlFiles(path.join(projectRoot, ".next/server/app"));
  for (const file of files) {
    const html = await readFile(file, "utf8");
    assert.ok(!/_next\/image\?[^"<>]*url=%2Fimages%2Fnews%2F/i.test(html), `${file}: news image unexpectedly uses the optimizer`);
    for (const match of html.matchAll(/\/images\/news\/[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp|avif)/g)) {
      assert.ok(known.has(match[0]), `${file}: unknown news image ${match[0]}`);
      referenced.add(match[0]);
    }
  }
  assert.ok(files.length > 0, "no built HTML pages found");
  return { htmlFiles: files.length, referencedImages: [...referenced].sort() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const images = await checkLocalImages();
    const built = process.argv.includes("--built") ? await checkBuiltReferences() : undefined;
    process.stdout.write(JSON.stringify({ ok: true, images, built }, null, 2) + "\n");
  } catch (error) {
    console.error(`News image integrity check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
