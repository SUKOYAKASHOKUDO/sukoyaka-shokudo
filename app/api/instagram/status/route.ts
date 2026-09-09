import { NextRequest } from "next/server";
import { getInstagramProfile } from "../../../../lib/instagram/api";
import {
  getExpectedInstagramUsername,
  getInstagramApiVersion,
} from "../../../../lib/instagram/config";
import { toSafeInstagramError } from "../../../../lib/instagram/errors";
import {
  assertInstagramAdmin,
  privateJson,
} from "../../../../lib/instagram/http";
import { getServerAccessToken } from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    assertInstagramAdmin(request);
    const expectedUsername = getExpectedInstagramUsername();
    const apiVersion = getInstagramApiVersion();

    try {
      const profile = await getInstagramProfile(
        apiVersion,
        getServerAccessToken(),
      );

      if (profile.username.toLowerCase() !== expectedUsername) {
        return privateJson(
          {
            connected: false,
            username: profile.username,
            tokenStatus: "wrong_account",
          },
          403,
        );
      }

      return privateJson(
        {
          connected: true,
          username: profile.username,
          userId: profile.userId,
          accountType: profile.accountType,
          tokenStatus: "valid",
        },
        200,
      );
    } catch (error) {
      const safe = toSafeInstagramError(error);
      if (safe.code === "configuration_error") {
        return privateJson(
          {
            connected: false,
            username: expectedUsername,
            tokenStatus: "missing",
          },
          200,
        );
      }
      if (safe.code === "access_token_expired") {
        return privateJson(
          {
            connected: false,
            username: expectedUsername,
            tokenStatus: "expired",
          },
          200,
        );
      }
      throw error;
    }
  } catch (error) {
    const safe = toSafeInstagramError(error);
    return privateJson({ ok: false, error: safe.code }, safe.status);
  }
}
