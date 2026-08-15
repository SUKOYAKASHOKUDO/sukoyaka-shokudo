import { site } from "../content/siteContent";

export type InstagramCalendarData = {
  imageUrl: string | null;
  postUrl: string;
  alt: string;
  updatedAt: string | null;
  status: "ready" | "waiting";
};

function getHttpsUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Public calendar contract used by the page and API route.
 * Replace the environment-backed values here with the Instagram Graph API
 * response when credentials and post-selection rules are available.
 */
export async function getInstagramCalendarData(): Promise<InstagramCalendarData> {
  const imageUrl = getHttpsUrl(process.env.INSTAGRAM_CALENDAR_IMAGE_URL);
  const postUrl =
    getHttpsUrl(process.env.INSTAGRAM_CALENDAR_POST_URL) ?? site.instagram;

  return {
    imageUrl,
    postUrl,
    alt:
      process.env.INSTAGRAM_CALENDAR_IMAGE_ALT?.trim() ||
      "すこやか食堂の開催カレンダー",
    updatedAt: process.env.INSTAGRAM_CALENDAR_UPDATED_AT?.trim() || null,
    status: imageUrl ? "ready" : "waiting",
  };
}
