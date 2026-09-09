import { NextRequest } from "next/server";
import {
  getInstagramMedia,
  getInstagramProfile,
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
import { getServerAccessToken } from "../../../../lib/instagram/security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    assertInstagramAdmin(request);
    const apiVersion = getInstagramApiVersion();
    const accessToken = getServerAccessToken();
    const profile = await getInstagramProfile(apiVersion, accessToken);

    if (
      profile.username.toLowerCase() !== getExpectedInstagramUsername()
    ) {
      throw new InstagramSetupError("unexpected_account", 403);
    }

    const media = await getInstagramMedia(
      apiVersion,
      profile.userId,
      accessToken,
      6,
    );

    return privateJson(
      {
        success: true,
        username: profile.username,
        media: media.map((item) => ({
          id: item.id,
          caption: item.caption,
          media_type: item.media_type,
          media_url: item.media_url,
          thumbnail_url: item.thumbnail_url,
          permalink: item.permalink,
          timestamp: item.timestamp,
        })),
      },
      200,
    );
  } catch (error) {
    const safe = toSafeInstagramError(error);
    return privateJson({ success: false, error: safe.code }, safe.status);
  }
}
