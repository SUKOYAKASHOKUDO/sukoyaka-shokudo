import "server-only";

export type InstagramErrorCode =
  | "configuration_error"
  | "oauth_disabled"
  | "oauth_cancelled"
  | "state_mismatch"
  | "authorization_code_missing"
  | "token_exchange_failed"
  | "token_refresh_failed"
  | "permission_missing"
  | "profile_fetch_failed"
  | "professional_account_required"
  | "unexpected_account"
  | "media_fetch_failed"
  | "access_token_expired"
  | "token_storage_unavailable"
  | "unauthorized"
  | "network_error";

export class InstagramSetupError extends Error {
  constructor(
    public readonly code: InstagramErrorCode,
    public readonly status: number,
  ) {
    super(code);
    this.name = "InstagramSetupError";
  }
}
export function toSafeInstagramError(error: unknown) {
  if (error instanceof InstagramSetupError) return error;
  return new InstagramSetupError("network_error", 502);
}
