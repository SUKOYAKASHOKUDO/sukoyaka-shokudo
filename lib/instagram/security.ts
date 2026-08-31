import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { InstagramSetupError } from "./errors";

const CIPHER = "aes-256-gcm";
const FORMAT_VERSION = "v1";
const AUTHENTICATED_CONTEXT = Buffer.from("sukoyaka-instagram-oauth-v1");

export type InstagramCredential = {
  accessToken: string;
  userId: string;
  username: string;
  accountType: string;
  expiresAt: string;
};

function getEncryptionKey() {
  const encoded = process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY?.trim();
  if (!encoded) {
    throw new InstagramSetupError("token_storage_unavailable", 503);
  }

  try {
    const key = Buffer.from(encoded, "base64url");
    if (key.length !== 32) throw new Error("invalid key length");
    return key;
  } catch {
    throw new InstagramSetupError("token_storage_unavailable", 503);
  }
}
export function randomOAuthState() {
  return randomBytes(32).toString("base64url");
}

export function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function sealInstagramCredential(credential: InstagramCredential) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(CIPHER, getEncryptionKey(), iv);
  cipher.setAAD(AUTHENTICATED_CONTEXT);

  const plaintext = Buffer.from(JSON.stringify(credential), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    FORMAT_VERSION,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function openInstagramCredential(value: string) {
  try {
    const [version, ivValue, tagValue, ciphertextValue, extra] =
      value.split(".");
    if (
      version !== FORMAT_VERSION ||
      !ivValue ||
      !tagValue ||
      !ciphertextValue ||
      extra
    ) {
      throw new Error("invalid sealed credential");
    }

    const decipher = createDecipheriv(
      CIPHER,
      getEncryptionKey(),
      Buffer.from(ivValue, "base64url"),
    );
    decipher.setAAD(AUTHENTICATED_CONTEXT);
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));

    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(plaintext) as Partial<InstagramCredential>;

    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.userId !== "string" ||
      typeof parsed.username !== "string" ||
      typeof parsed.accountType !== "string" ||
      typeof parsed.expiresAt !== "string"
    ) {
      throw new Error("invalid credential payload");
    }

    if (Date.parse(parsed.expiresAt) <= Date.now()) {
      throw new InstagramSetupError("access_token_expired", 401);
    }

    return parsed as InstagramCredential;
  } catch (error) {
    if (error instanceof InstagramSetupError) throw error;
    throw new InstagramSetupError("token_storage_unavailable", 503);
  }
}

export function getServerAccessToken() {
  const sealed = process.env.INSTAGRAM_ACCESS_TOKEN_SEALED?.trim();
  if (sealed) return openInstagramCredential(sealed).accessToken;

  const plain = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (plain) return plain;

  throw new InstagramSetupError("configuration_error", 503);
}
