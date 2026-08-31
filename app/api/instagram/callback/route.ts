import { NextRequest, NextResponse } from "next/server";
import {
  exchangeAuthorizationCode,
  exchangeLongLivedToken,
  getInstagramMedia,
  getInstagramProfile,
} from "../../../../lib/instagram/api";
import { getInstagramOAuthConfig } from "../../../../lib/instagram/config";
import {
  InstagramSetupError,
  toSafeInstagramError,
} from "../../../../lib/instagram/errors";
import {
  safeEqual,
  sealInstagramCredential,
} from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "sukoyaka_instagram_oauth_state";

function privateHeaders() {
  return {
    "Cache-Control": "no-store",
    Expires: "0",
    Pragma: "no-cache",
    "Referrer-Policy": "no-referrer",
  };
}

function privateResponse(body: unknown, status: number, clearState: boolean) {
  const response = NextResponse.json(body, {
    status,
    headers: privateHeaders(),
  });
  if (clearState) {
    response.cookies.set(STATE_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/instagram/callback",
      maxAge: 0,
    });
  }
  return response;
}

function normalizeAccountType(value: string) {
  return value.replace(/[^a-z]/gi, "").toLowerCase();
}

export async function GET(request: NextRequest) {
  let stateValidated = false;
  try {
    const config = getInstagramOAuthConfig();
    if (!config.enabled) {
      throw new InstagramSetupError("oauth_disabled", 503);
    }

    const returnedState = request.nextUrl.searchParams.get("state") ?? "";
    const storedState = request.cookies.get(STATE_COOKIE)?.value ?? "";
    if (!returnedState || !storedState || !safeEqual(returnedState, storedState)) {
      throw new InstagramSetupError("state_mismatch", 400);
    }
    stateValidated = true;

    if (request.nextUrl.searchParams.get("error") === "access_denied") {
      throw new InstagramSetupError("oauth_cancelled", 400);
    }

    const code = request.nextUrl.searchParams.get("code")?.trim();
    if (!code || code.length > 4096) {
      throw new InstagramSetupError("authorization_code_missing", 400);
    }

    const shortToken = await exchangeAuthorizationCode(config, code);
    const longToken = await exchangeLongLivedToken(
      config,
      shortToken.accessToken,
    );
    const profile = await getInstagramProfile(
      config.apiVersion,
      longToken.accessToken,
    );

    const accountType = normalizeAccountType(profile.accountType);
    if (
      accountType !== "business" &&
      accountType !== "creator" &&
      accountType !== "mediacreator"
    ) {
      throw new InstagramSetupError("professional_account_required", 403);
    }

    if (profile.username.toLowerCase() !== config.expectedUsername) {
      throw new InstagramSetupError("unexpected_account", 403);
    }

    const media = await getInstagramMedia(
      config.apiVersion,
      profile.userId,
      longToken.accessToken,
      3,
    );
    const expiresAt = new Date(
      Date.now() + longToken.expiresIn * 1000,
    ).toISOString();
    const sealedCredential = sealInstagramCredential({
      accessToken: longToken.accessToken,
      userId: profile.userId,
      username: profile.username,
      accountType: profile.accountType,
      expiresAt,
    });

    return privateResponse(
      {
        ok: true,
        status: "connected",
        account: {
          userId: profile.userId,
          username: profile.username,
          accountType: profile.accountType,
        },
        token: {
          expiresAt,
          environmentVariable: "INSTAGRAM_ACCESS_TOKEN_SEALED",
          encryptedConfigurationValue: sealedCredential,
        },
        media: media.map((item) => ({
          id: item.id,
          mediaType: item.media_type,
          permalink: item.permalink,
          timestamp: item.timestamp,
        })),
      },
      200,
      true,
    );
  } catch (error) {
    const safe = toSafeInstagramError(error);
    return privateResponse(
      { ok: false, error: safe.code },
      safe.status,
      stateValidated,
    );
  }
}
