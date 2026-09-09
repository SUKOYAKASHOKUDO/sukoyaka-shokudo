import { NextRequest } from "next/server";
import {
  getInstagramProfile,
  refreshLongLivedToken,
} from "../../../../lib/instagram/api";
import {
  getExpectedInstagramUsername,
  getInstagramApiVersion,
} from "../../../../lib/instagram/config";
import {
  InstagramSetupError,
  toSafeInstagramError,
} from "../../../../lib/instagram/errors";
import {
  assertInstagramAdmin,
  privateJson,
} from "../../../../lib/instagram/http";
import {
  getServerAccessToken,
  sealInstagramCredential,
} from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertInstagramAdmin(request);
    const apiVersion = getInstagramApiVersion();
    const refreshed = await refreshLongLivedToken(getServerAccessToken());
    const profile = await getInstagramProfile(
      apiVersion,
      refreshed.accessToken,
    );

    if (
      profile.username.toLowerCase() !== getExpectedInstagramUsername()
    ) {
      throw new InstagramSetupError("unexpected_account", 403);
    }

    const expiresAt = new Date(
      Date.now() + refreshed.expiresIn * 1000,
    ).toISOString();
    const sealedCredential = sealInstagramCredential({
      accessToken: refreshed.accessToken,
      userId: profile.userId,
      username: profile.username,
      accountType: profile.accountType,
      expiresAt,
    });

    return privateJson(
      {
        ok: true,
        username: profile.username,
        expiresAt,
        environmentVariable: "INSTAGRAM_ACCESS_TOKEN_SEALED",
        encryptedConfigurationValue: sealedCredential,
      },
      200,
    );
  } catch (error) {
    const safe = toSafeInstagramError(error);
    return privateJson({ ok: false, error: safe.code }, safe.status);
  }
}
