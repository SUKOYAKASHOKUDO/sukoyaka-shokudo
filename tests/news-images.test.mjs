import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { checkLocalImages, projectRoot, readManifest, sha256, validateImage } from "../scripts/check-news-images.mjs";

test("all news images have verified bytes and fully decode", async () => {
  const images = await checkLocalImages();
  assert.equal(images.length, (await readManifest()).images.length);
});

test("a different valid JPEG returned with HTTP 200 cannot pass the integrity check", async () => {
  const { images } = await readManifest();
  const expected = images.find((image) => image.path.endsWith("sapporo-kaisei-interview.jpg"));
  const another = await readFile(path.join(projectRoot, "public/images/news/aka-to-ao-book.jpg"));
  // Match the length in this fixture so the test specifically exercises the digest check.
  await assert.rejects(validateImage(another, { ...expected, bytes: another.length }, "image/jpeg"), /SHA-256 mismatch/);
});

test("a truncated JPEG fails a full decode even if its recorded hash and length match", async () => {
  const expected = (await readManifest()).images[0];
  const original = await readFile(path.join(projectRoot, "public", expected.path));
  const truncated = original.subarray(0, Math.floor(original.length / 2));
  await assert.rejects(validateImage(truncated, { ...expected, bytes: truncated.length, sha256: sha256(truncated) }));
});

test("HTTP MIME type and decoded dimensions must match the verified image", async () => {
  const expected = (await readManifest()).images[0];
  const original = await readFile(path.join(projectRoot, "public", expected.path));
  await assert.rejects(validateImage(original, expected, "image/png"), /MIME mismatch/);
  await assert.rejects(validateImage(original, { ...expected, width: expected.width + 1 }), /width mismatch/);
});
