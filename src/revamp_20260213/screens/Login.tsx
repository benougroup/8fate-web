/**
 * Login.tsx
 *
 * Authentication entry point.
 *
 * Flow:
 *  1. User taps "Continue with Google"
 *  2. DEV  → mock delay, uses mock credentials
 *     PROD → real Google OAuth (implement productionGoogleAuth below)
 *  3. After auth, calls backend POST /api/auth/google { idToken }
 *     Response: { userId, email, isNewUser: boolean }
 *  4. Routing:
 *       isNewUser === true  → /terms?mode=onboarding  (new account: T&C then Register)
 *       isNewUser === false → /daily                   (existing account: go home)
 *
 * NOTE: Mock data (localStorage) is only written in development mode (ENV.useMock).
 */
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getBrandSrc } from "../assets/assetMap";
import { ENV } from "../config/env";
import { Page } from "../components/Page";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

type AuthResult = { userId: string; email: string; isNewUser: boolean };

/** DEV-only mock — returns a fake existing account. Set isNewUser:true to test onboarding. */
async function mockGoogleAuth(): Promise<AuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { userId: "mock-user-123", email: "user@example.com", isNewUser: false };
}

/**
 * PRODUCTION Google auth.
 * Replace this body with your real Google Identity / Firebase OAuth flow.
 * Must return AuthResult or throw on failure.
 */
async function productionGoogleAuth(): Promise<AuthResult> {
  // TODO: implement real Google OAuth
  // Example:
  //   const idToken = await signInWithGoogleGIS();
  //   const res = await fetch("/api/auth/google", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ idToken }),
  //   });
  //   if (!res.ok) throw new Error("Auth failed");
  //   return res.json();
  throw new Error("Google Sign-In is not yet configured for production.");
}

export function Login() {
  const navigate = useNavigate();
  const { theme, setAuthUser, setTncAccepted } = usePreferences();
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const logoSrc = getBrandSrc(theme, "geon_logo");
  const quoteSrc = getBrandSrc(theme, "geon_quote");

  async function handleGoogleLogin() {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const result: AuthResult = ENV.useMock
        ? await mockGoogleAuth()
        : await productionGoogleAuth();

      setAuthUser({ userId: result.userId, userEmail: result.email });

      if (result.isNewUser) {
        // New account → T&C agreement then registration
        setTncAccepted(false);
        navigate("/terms?mode=onboarding", { replace: true });
      } else {
        // Existing account → go straight to daily home
        setTncAccepted(true);
        navigate("/daily", { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t("common.errorUnknownDetail");
      setErrorMsg(message);
      setLoading(false);
    }
  }

  return (
    <Page>
      <div className="revamp-loginScreen">
        {/* Brand section — floats freely on background */}
        <div className="revamp-loginBrand">
          <img
            src={logoSrc}
            alt={t("brand.geonLogoAlt")}
            className="revamp-loginLogo"
          />
          {quoteSrc && (
            <img
              src={quoteSrc}
              alt="我命由我不由天"
              className="revamp-loginQuote"
            />
          )}
        </div>

        {/* Action section — pinned to bottom */}
        <div className="revamp-loginActions">
          {errorMsg && (
            <p className="revamp-loginError" role="alert">{errorMsg}</p>
          )}
          {ENV.useMock && (
            <p className="revamp-loginDevBadge">Dev mode — mock auth active</p>
          )}
          <button
            type="button"
            className="revamp-googleButton"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
              </svg>
            )}
            <span>{loading ? t("login.signingIn") : t("login.googleSignIn")}</span>
          </button>

          <div className="revamp-loginLegalLinks">
            <button type="button" onClick={() => navigate("/terms?mode=viewOnly")}>
              {t("login.terms")}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => navigate("/terms?mode=viewOnly")}>
              {t("login.privacy")}
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}
