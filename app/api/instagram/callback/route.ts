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
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    "Content-Type": "text/html; charset=utf-8",
    Expires: "0",
    Pragma: "no-cache",
    "Referrer-Policy": "no-referrer",
  };
}

function privateResponse(body: string, status: number, clearState: boolean) {
  const response = new NextResponse(body, {
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

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function htmlPage(title: string, content: string) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>${escapeHtml(title)}</title>
  <style>
    :root{color-scheme:light;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f7f5ef;color:#253128}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box}
    main{width:min(680px,100%);background:#fff;border:1px solid #dfe5dd;border-radius:20px;padding:32px;box-shadow:0 18px 50px rgba(31,54,39,.10)}
    h1{font-size:clamp(24px,5vw,34px);margin:0 0 16px;color:#183c2b}p{line-height:1.8;margin:10px 0}.account{font-weight:700}
    details{margin-top:24px;padding:16px;border-radius:12px;background:#f2f6f1}summary{cursor:pointer;font-weight:700}
    textarea{box-sizing:border-box;width:100%;min-height:150px;margin-top:12px;padding:12px;border:1px solid #bbc8bd;border-radius:8px;word-break:break-all}
    .note{font-size:14px;color:#536159}.error{color:#8a2f2f}.code{font-family:ui-monospace,monospace}
  </style>
</head>
<body><main>${content}</main></body>
</html>`;
}

function successPage(input: {
  username: string;
  expiresAt: string;
  sealedCredential: string;
  mediaCount: number;
}) {
  return htmlPage(
    "Instagramとの接続が完了しました",
    `<h1>Instagramとの接続が完了しました。</h1>
<p>この画面を閉じて構いません。</p>
<p class="account">接続アカウント: @${escapeHtml(input.username)}</p>
<p>APIによる投稿取得確認: ${input.mediaCount}件</p>
<p class="note">長期アクセストークン有効期限: ${escapeHtml(input.expiresAt)}</p>
<details>
  <summary>サイト管理者向けの暗号化設定値</summary>
  <p class="note">この値はアクセストークンそのものではなく、サーバー側の鍵で暗号化されています。サイト管理者へ安全な方法で渡し、Vercelの <span class="code">INSTAGRAM_ACCESS_TOKEN_SEALED</span> に登録してください。</p>
  <textarea readonly aria-label="暗号化設定値">${escapeHtml(input.sealedCredential)}</textarea>
</details>`,
  );
}

function errorPage(code: string) {
  return htmlPage(
    "Instagramとの接続に失敗しました",
    `<h1 class="error">Instagramとの接続に失敗しました。</h1>
<p>サイト管理者へ次のエラーコードをお知らせください。</p>
<p class="code">${escapeHtml(code)}</p>`,
  );
}

function safeLogValue(value: string | null) {
  return value?.replace(/[\r\n\t]/g, " ").slice(0, 300) || undefined;
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

    console.info("[instagram-oauth] connected", {
      username: profile.username,
      mediaCount: media.length,
    });

    return privateResponse(
      successPage({
        username: profile.username,
        expiresAt,
        sealedCredential,
        mediaCount: media.length,
      }),
      200,
      true,
    );
  } catch (error) {
    const safe = toSafeInstagramError(error);
    console.error("[instagram-oauth] callback_failed", {
      code: safe.code,
      status: safe.status,
      oauthError: safeLogValue(request.nextUrl.searchParams.get("error")),
      oauthReason: safeLogValue(
        request.nextUrl.searchParams.get("error_reason"),
      ),
      oauthDescription: safeLogValue(
        request.nextUrl.searchParams.get("error_description"),
      ),
    });
    return privateResponse(
      errorPage(safe.code),
      safe.status,
      stateValidated,
    );
  }
}
