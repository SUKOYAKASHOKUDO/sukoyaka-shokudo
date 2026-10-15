import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
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

test("the HTTP diagnostic saves a wrong 200 response and stops after the first failure", { timeout: 15000 }, async () => {
  const output = await mkdtemp(path.join(tmpdir(), "sukoyaka-image-check-"));
  const wrongPhoto = await readFile(path.join(projectRoot, "public/images/news/sapporo-kaisei-interview.jpg"));
  let requests = 0;
  const server = createServer((request, response) => {
    requests++;
    response.writeHead(200, { "Content-Type": "image/jpeg", "Content-Length": wrongPhoto.length });
    response.end(wrongPhoto);
  });
  try {
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const child = spawn(process.execPath, [
      "scripts/diagnose-news-images.mjs", `--base-url=http://127.0.0.1:${server.address().port}`,
      "--rounds=30", "--profiles=normal", `--output-dir=${output}`,
    ], { cwd: projectRoot, stdio: "ignore" });
    const [code] = await once(child, "close");
    assert.equal(code, 1);
    assert.equal(requests, 1);
    const report = JSON.parse(await readFile(path.join(output, "http-report.json"), "utf8"));
    assert.equal(report.records.length, 1);
    const record = report.records[0];
    assert.equal(record.status, 200);
    assert.equal(record.ok, false);
    assert.equal(record.sha256, sha256(wrongPhoto));
    assert.deepEqual(await readFile(path.join(output, record.responseBodyFile)), wrongPhoto);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    const relative = path.relative(tmpdir(), output);
    assert.ok(relative.startsWith("sukoyaka-image-check-") && !relative.includes(path.sep) && !path.isAbsolute(relative));
    await rm(output, { recursive: true, force: true });
  }
});
