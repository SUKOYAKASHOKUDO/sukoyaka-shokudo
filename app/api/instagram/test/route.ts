import { NextRequest, NextResponse } from "next/server";
import {
  getInstagramMedia,
  getInstagramProfile,
} from "../../../../lib/instagram/api";
import {
  getConfiguredInstagramUserId,
  getExpectedInstagramUsername,
  getInstagramApiVersion,
  getInstagramTestSecret,
} from "../../../../lib/instagram/config";
import {
  InstagramSetupError,
  toSafeInstagramError,
} from "../../../../lib/instagram/errors";
import {
  getServerAccessToken,
  safeEqual,
} from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

function noStoreJson(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      Expires: "0",
      Pragma: "no-cache",
      "Referrer-Policy": "no-referrer",
      ...(status === 401 ? { "WWW-Authenticate": "Bearer" } : {}),
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const expectedSecret = getInstagramTestSecret();
    const authorization = request.headers.get("authorization") ?? "";
    const suppliedSecret = authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : "";

    if (!suppliedSecret || !safeEqual(suppliedSecret, expectedSecret)) {
      throw new InstagramSetupError("unauthorized", 401);
    }

    const apiVersion = getInstagramApiVersion();
    const expectedUsername = getExpectedInstagramUsername();
    const expectedUserId = getConfiguredInstagramUserId();
    const accessToken = getServerAccessToken();
    const profile = await getInstagramProfile(apiVersion, accessToken);

    if (
      profile.username.toLowerCase() !== expectedUsername ||
      profile.userId !== expectedUserId
    ) {
      throw new InstagramSetupError("unexpected_account", 403);
    }

    const media = await getInstagramMedia(
      apiVersion,
      profile.userId,
      accessToken,
      3,
    );

    return noStoreJson(
      {
        ok: true,
        account: {
          userId: profile.userId,
          username: profile.username,
          accountType: profile.accountType,
        },
        media: media.map((item) => ({
          id: item.id,
          mediaType: item.media_type,
          permalink: item.permalink,
          timestamp: item.timestamp,
        })),
      },
      200,
    );
  } catch (error) {
    const safe = toSafeInstagramError(error);
    return noStoreJson({ ok: false, error: safe.code }, safe.status);
  }
}
