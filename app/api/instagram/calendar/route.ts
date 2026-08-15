import { NextResponse } from "next/server";
import { getInstagramCalendarData } from "../../../../lib/instagramCalendar";

export const dynamic = "force-dynamic";

export async function GET() {
  const calendar = await getInstagramCalendarData();

  return NextResponse.json(calendar, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
