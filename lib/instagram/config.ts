import "server-only";

import { InstagramSetupError } from "./errors";

const API_VERSION_PATTERN = /^v\d+\.\d+$/;
const NUMERIC_ID_PATTERN = /^\d+$/;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new InstagramSetupError("configuration_error", 503);
  return value;
}
function normalizeUsername(value: string) {
  return value.replace(/^@/, "").trim().toLowerCase();
}

function validateRedirectUri(value: string) {
  try {
    const url = new URL(value);
    const localDevelopment =
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");

    if (url.protocol !== "https:" && !localDevelopment) {
      throw new Error("redirect protocol");
    }

    if (url.username || url.password || url.hash) {
      throw new Error("redirect credentials");
    }

    return url.toString();
  } catch {
    throw new InstagramSetupError("configuration_error", 503);
  }
}

export function getInstagramApiVersion() {
  const value = required("INSTAGRAM_API_VERSION");
  if (!API_VERSION_PATTERN.test(value)) {
    throw new InstagramSetupError("configuration_error", 503);
  }
  return value;
}

export function getExpectedInstagramUsername() {
  const value = normalizeUsername(required("INSTAGRAM_EXPECTED_USERNAME"));
  if (!/^[a-z0-9._]+$/.test(value)) {
    throw new InstagramSetupError("configuration_error", 503);
  }
  return value;
}

export function getInstagramOAuthConfig() {
  const appId = required("INSTAGRAM_APP_ID");
  const appSecret = required("INSTAGRAM_APP_SECRET");
  const redirectUri = validateRedirectUri(required("INSTAGRAM_REDIRECT_URI"));

  if (!NUMERIC_ID_PATTERN.test(appId)) {
    throw new InstagramSetupError("configuration_error", 503);
  }

  return {
    appId,
    appSecret,
    redirectUri,
    apiVersion: getInstagramApiVersion(),
    expectedUsername: getExpectedInstagramUsername(),
    enabled: process.env.INSTAGRAM_OAUTH_ENABLED === "true",
  };
}

export function getConfiguredInstagramUserId() {
  const value = required("INSTAGRAM_USER_ID");
  if (!NUMERIC_ID_PATTERN.test(value)) {
    throw new InstagramSetupError("configuration_error", 503);
  }
  return value;
}

export function getInstagramTestSecret() {
  const value = required("INSTAGRAM_TEST_SECRET");
  if (value.length < 32) {
    throw new InstagramSetupError("configuration_error", 503);
  }
  return value;
}

export function getInstagramOAuthSetupSecret() {
  const value = required("INSTAGRAM_OAUTH_SETUP_SECRET");
  if (value.length < 32) {
    throw new InstagramSetupError("configuration_error", 503);
  }
  return value;
}
