import "server-only";

import { InstagramSetupError } from "./errors";

const REQUIRED_PERMISSION = "instagram_business_basic";

type OAuthConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
};

type ShortToken = {
  accessToken: string;
  userId: string;
  permissions: string[];
};

type LongToken = {
  accessToken: string;
  expiresIn: number;
};

export type InstagramProfile = {
  id: string;
  userId: string;
  username: string;
  accountType: string;
};

export type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  children?: { data?: unknown[] };
};

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function firstDataObject(value: unknown) {
  const object = asObject(value);
  if (!object) return null;
  if (Array.isArray(object.data)) return asObject(object.data[0]);
  return object;
}

async function safeJson(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function exchangeAuthorizationCode(
  config: OAuthConfig,
  code: string,
): Promise<ShortToken> {
  const form = new FormData();
  form.set("client_id", config.appId);
  form.set("client_secret", config.appSecret);
  form.set("grant_type", "authorization_code");
  form.set("redirect_uri", config.redirectUri);
  form.set("code", code);

  let response: Response;
  try {
    response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      body: form,
      cache: "no-store",
    });
  } catch {
    throw new InstagramSetupError("network_error", 502);
  }

  const payload = firstDataObject(await safeJson(response));
  if (!response.ok || !payload) {
    throw new InstagramSetupError("token_exchange_failed", 502);
  }

  const accessToken = payload.access_token;
  const userId = payload.user_id;
  const permissions =
    typeof payload.permissions === "string"
      ? payload.permissions.split(",").map((value) => value.trim())
      : Array.isArray(payload.permissions)
        ? payload.permissions.filter(
            (value): value is string => typeof value === "string",
          )
        : [];

  if (typeof accessToken !== "string" || !accessToken) {
    throw new InstagramSetupError("token_exchange_failed", 502);
  }

  if (typeof userId !== "string" && typeof userId !== "number") {
    throw new InstagramSetupError("token_exchange_failed", 502);
  }

  if (!permissions.includes(REQUIRED_PERMISSION)) {
    throw new InstagramSetupError("permission_missing", 403);
  }

  return { accessToken, userId: String(userId), permissions };
}

export async function exchangeLongLivedToken(
  config: Pick<OAuthConfig, "appSecret">,
  shortAccessToken: string,
): Promise<LongToken> {
  const endpoint = new URL("https://graph.instagram.com/access_token");
  endpoint.searchParams.set("grant_type", "ig_exchange_token");
  endpoint.searchParams.set("client_secret", config.appSecret);
  endpoint.searchParams.set("access_token", shortAccessToken);

  let response: Response;
  try {
    response = await fetch(endpoint, { cache: "no-store" });
  } catch {
    throw new InstagramSetupError("network_error", 502);
  }

  const payload = asObject(await safeJson(response));
  if (!response.ok || !payload) {
    throw new InstagramSetupError("token_refresh_failed", 502);
  }

  if (
    typeof payload.access_token !== "string" ||
    typeof payload.expires_in !== "number" ||
    payload.expires_in <= 0
  ) {
    throw new InstagramSetupError("token_refresh_failed", 502);
  }

  return {
    accessToken: payload.access_token,
    expiresIn: payload.expires_in,
  };
}

export async function refreshLongLivedToken(
  longLivedAccessToken: string,
): Promise<LongToken> {
  const endpoint = new URL("https://graph.instagram.com/refresh_access_token");
  endpoint.searchParams.set("grant_type", "ig_refresh_token");
  endpoint.searchParams.set("access_token", longLivedAccessToken);

  let response: Response;
  try {
    response = await fetch(endpoint, { cache: "no-store" });
  } catch {
    throw new InstagramSetupError("network_error", 502);
  }

  const payload = asObject(await safeJson(response));
  if (!response.ok || !payload) {
    throw new InstagramSetupError("token_refresh_failed", 502);
  }

  if (
    typeof payload.access_token !== "string" ||
    typeof payload.expires_in !== "number" ||
    payload.expires_in <= 0
  ) {
    throw new InstagramSetupError("token_refresh_failed", 502);
  }

  return {
    accessToken: payload.access_token,
    expiresIn: payload.expires_in,
  };
}

async function graphGet(
  endpoint: URL,
  accessToken: string,
  errorCode: "profile_fetch_failed" | "media_fetch_failed",
) {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
  } catch {
    throw new InstagramSetupError("network_error", 502);
  }

  const payload = await safeJson(response);
  if (!response.ok) {
    throw new InstagramSetupError(
      response.status === 401 ? "access_token_expired" : errorCode,
      response.status === 401 ? 401 : 502,
    );
  }
  return payload;
}

export async function getInstagramProfile(
  apiVersion: string,
  accessToken: string,
): Promise<InstagramProfile> {
  const endpoint = new URL(
    `https://graph.instagram.com/${apiVersion}/me`,
  );
  endpoint.searchParams.set("fields", "id,user_id,username,account_type");
  const payload = firstDataObject(
    await graphGet(endpoint, accessToken, "profile_fetch_failed"),
  );

  if (!payload) throw new InstagramSetupError("profile_fetch_failed", 502);
  const id = payload.id;
  const userId = payload.user_id;
  const username = payload.username;
  const accountType = payload.account_type;

  if (
    (typeof id !== "string" && typeof id !== "number") ||
    (typeof userId !== "string" && typeof userId !== "number") ||
    typeof username !== "string" ||
    typeof accountType !== "string"
  ) {
    throw new InstagramSetupError("profile_fetch_failed", 502);
  }

  return {
    id: String(id),
    userId: String(userId),
    username,
    accountType,
  };
}

export async function getInstagramMedia(
  apiVersion: string,
  userId: string,
  accessToken: string,
  limit = 3,
) {
  const endpoint = new URL(
    `https://graph.instagram.com/${apiVersion}/${userId}/media`,
  );
  endpoint.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}",
  );
  endpoint.searchParams.set("limit", String(Math.min(12, Math.max(1, limit))));

  const payload = asObject(
    await graphGet(endpoint, accessToken, "media_fetch_failed"),
  );
  const data = payload?.data;
  if (!Array.isArray(data)) {
    throw new InstagramSetupError("media_fetch_failed", 502);
  }

  return data.filter((value): value is InstagramMedia => {
    const media = asObject(value);
    return Boolean(
      media &&
        typeof media.id === "string" &&
        typeof media.media_type === "string" &&
        typeof media.permalink === "string" &&
        typeof media.timestamp === "string",
    );
  });
}
