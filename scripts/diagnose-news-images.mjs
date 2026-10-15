import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { readManifest, projectRoot, sha256, validateImage } from "./check-news-images.mjs";

const values = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const at = arg.indexOf("=");
  assert.ok(arg.startsWith("--") && at > 2, "use --name=value arguments");
  return [arg.slice(2, at), arg.slice(at + 1)];
}));
const base = new URL(values["base-url"]);
assert.ok(["http:", "https:"].includes(base.protocol) && !base.username && !base.password, "invalid base URL");
const rounds = Number(values.rounds ?? 1);
assert.ok(Number.isInteger(rounds) && rounds >= 1 && rounds <= 30, "rounds must be 1..30");
assert.ok(values["output-dir"], "--output-dir is required to retain diagnostic evidence");
const output = path.resolve(values["output-dir"]);
const slowKbps = Number(values["slow-kbps"] ?? 0);
assert.ok(Number.isFinite(slowKbps) && slowKbps >= 0 && (!slowKbps || slowKbps >= 64), "slow-kbps must be zero or at least 64");
const profiles = {
  normal: {},
  revalidate: { "cache-control": "no-cache", pragma: "no-cache" },
  android: { "user-agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36", accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8" },
  ios: { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1", accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
};
const selected = (values.profiles ?? "normal,revalidate,android,ios").split(",");
assert.ok(selected.every((name) => Object.hasOwn(profiles, name)), "unknown HTTP profile");
const manifest = await readManifest();
const records = [];
const startedAt = new Date().toISOString();
await mkdir(output, { recursive: true });
const save = () => writeFile(path.join(output, "http-report.json"), JSON.stringify({ startedAt, updatedAt: new Date().toISOString(), base: base.href, rounds, slowKbps, note: "HTTP header profiles are not real Android/Safari browser tests; revalidate is a cache revalidation request, not a browser hard refresh.", records }, null, 2));

try {
  for (const entry of manifest.images) {
    const local = await readFile(path.join(projectRoot, "public", entry.path));
    const localDecoded = await validateImage(local, entry);
    for (const profile of selected) {
      for (let round = 1; round <= rounds; round++) {
        const url = new URL(entry.path, base);
        const headers = { "accept-encoding": "identity", ...profiles[profile] };
        const record = { url: url.href, profile, round, requestedAt: new Date().toISOString(), requestHeaders: headers };
        records.push(record);
        try {
          const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
          record.status = response.status;
          record.responseUrl = response.url;
          record.responseHeaders = Object.fromEntries(response.headers);
          const chunks = [];
          let received = 0;
          const bodyStarted = Date.now();
          for await (const chunk of response.body) {
            chunks.push(chunk);
            received += chunk.length;
            if (slowKbps) await delay(Math.max(0, received / (slowKbps * 1024) * 1000 - (Date.now() - bodyStarted)));
          }
          const data = Buffer.concat(chunks);
          record.receivedBytes = data.length;
          record.sha256 = sha256(data);
          assert.equal(response.status, 200, "unexpected HTTP status");
          const encoding = response.headers.get("content-encoding");
          const length = response.headers.get("content-length");
          if (length !== null && (!encoding || encoding === "identity")) assert.equal(data.length, Number(length), "Content-Length mismatch");
          record.decoded = await validateImage(data, entry, response.headers.get("content-type"));
          assert.equal(record.decoded.pixelSha256, localDecoded.pixelSha256, "decoded pixels differ from local original");
          record.ok = true;
        } catch (error) {
          record.ok = false;
          record.error = error.message;
          throw error; // Stop on the first failure, rather than repeatedly hammering a failing endpoint.
        } finally {
          await save();
        }
      }
      console.log(`${entry.path} ${profile}: ${rounds}/${rounds} verified`);
    }
  }
  console.log(`Verified ${records.length} responses. Evidence: ${path.join(output, "http-report.json")}`);
} catch (error) {
  console.error(`Image response verification failed: ${error.message}. Evidence saved in ${output}`);
  process.exitCode = 1;
}
