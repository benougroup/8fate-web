import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getBrandSrc } from "../assets/assetMap";
import { Page } from "../components/Page";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

export function Login() {
  const navigate = useNavigate();
  const { theme, setAuthUser, setTncAccepted } = usePreferences();
  const [loading, setLoading] = React.useState(false);
  const logoSrc = getBrandSrc(theme, "geon_logo");
  const quoteSrc = getBrandSrc(theme, "geon_quote");

  async function handleGoogleLogin() {
    if (loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAuthUser({ userId: "mock-user-123", email: "user@example.com" });
      setTncAccepted(false);
      navigate("/terms?mode=onboarding", { replace: true });
    } catch {
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
