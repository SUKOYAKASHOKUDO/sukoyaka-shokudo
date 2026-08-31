import { NextRequest, NextResponse } from "next/server";
import {
  getInstagramOAuthConfig,
  getInstagramOAuthSetupSecret,
} from "../../../../lib/instagram/config";
import { toSafeInstagramError } from "../../../../lib/instagram/errors";
import {
  randomOAuthState,
  safeEqual,
} from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "sukoyaka_instagram_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;

function privateHeaders() {
  return {
    "Cache-Control": "no-store",
    Expires: "0",
    Pragma: "no-cache",
    "Referrer-Policy": "no-referrer",
  };
}

function hasValidSetupAuthorization(request: NextRequest, secret: string) {
  const supplied = request.headers.get("authorization") ?? "";
  const expected = `Basic ${Buffer.from(`instagram:${secret}`, "utf8").toString("base64")}`;
  return supplied.length > 0 && safeEqual(supplied, expected);
}

export async function GET(request: NextRequest) {
  try {
    const config = getInstagramOAuthConfig();
    if (!config.enabled) {
      return NextResponse.json(
        { ok: false, error: "oauth_disabled" },
        { status: 503, headers: privateHeaders() },
      );
    }

    const setupSecret = getInstagramOAuthSetupSecret();
    if (!hasValidSetupAuthorization(request, setupSecret)) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        {
          status: 401,
          headers: {
            ...privateHeaders(),
            "WWW-Authenticate":
              'Basic realm="Instagram OAuth Setup", charset="UTF-8"',
          },
        },
      );
    }

    const state = randomOAuthState();
    const authorizationUrl = new URL(
      "https://www.instagram.com/oauth/authorize",
    );
    authorizationUrl.searchParams.set("client_id", config.appId);
    authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "instagram_business_basic");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("enable_fb_login", "false");
    authorizationUrl.searchParams.set("force_reauth", "true");

    const response = NextResponse.redirect(authorizationUrl);
    for (const [name, value] of Object.entries(privateHeaders())) {
      response.headers.set(name, value);
    }
    response.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/instagram/callback",
      maxAge: STATE_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    const safe = toSafeInstagramError(error);
    return NextResponse.json(
      { ok: false, error: safe.code },
      { status: safe.status, headers: privateHeaders() },
    );
  }
}
