import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { getInstagramTestSecret } from "./config";
import { InstagramSetupError } from "./errors";
import { safeEqual } from "./security";

export const INSTAGRAM_PRIVATE_HEADERS = {
  "Cache-Control": "no-store",
  Expires: "0",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export function privateJson(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...INSTAGRAM_PRIVATE_HEADERS,
      ...(status === 401 ? { "WWW-Authenticate": "Bearer" } : {}),
    },
  });
}

export function assertInstagramAdmin(request: NextRequest) {
  const expectedSecret = getInstagramTestSecret();
  const authorization = request.headers.get("authorization") ?? "";
  const suppliedSecret = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!suppliedSecret || !safeEqual(suppliedSecret, expectedSecret)) {
    throw new InstagramSetupError("unauthorized", 401);
  }
}
