import { NextResponse } from "next/server";
import { getInstagramOAuthConfig } from "../../../../lib/instagram/config";
import { toSafeInstagramError } from "../../../../lib/instagram/errors";
import { randomOAuthState } from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "sukoyaka_instagram_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;

export async function GET() {
  try {
    const config = getInstagramOAuthConfig();
    if (!config.enabled) {
      return NextResponse.json(
        { ok: false, error: "oauth_disabled" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
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

    const response = NextResponse.redirect(authorizationUrl);
    response.headers.set("Cache-Control", "no-store");
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
      { status: safe.status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
