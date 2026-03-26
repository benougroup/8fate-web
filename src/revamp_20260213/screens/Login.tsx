/**
 * Login.tsx
 *
 * Authentication entry point.
 *
 * DEV shortcuts are always visible so testers can bypass Google OAuth.
 * Google Sign-In button is shown below for production use.
 */
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

  /** Mock existing user — goes straight to /daily */
  async function handleExistingUser() {
    if (loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setAuthUser({ userId: "mock-user-123", userEmail: "user@example.com" });
    setTncAccepted(true);
    navigate("/daily", { replace: true });
  }

  /** Mock new user — goes to T&C → Register */
  async function handleNewUser() {
    if (loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setAuthUser({ userId: "mock-new-456", userEmail: "newuser@example.com" });
    setTncAccepted(false);
    navigate("/terms?mode=onboarding", { replace: true });
  }

  return (
    <Page>
      <div className="revamp-loginScreen">
        {/* Brand section */}
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
          {/* DEV shortcuts — always visible for testing */}
          <p className="revamp-loginDevBadge">⚙ DEV MODE — mock auth</p>
          <button
            type="button"
            className="revamp-devButton revamp-devButtonPrimary"
            onClick={handleExistingUser}
            disabled={loading}
          >
            Existing User → Daily
          </button>
          <button
            type="button"
            className="revamp-devButton"
            onClick={handleNewUser}
            disabled={loading}
          >
            New User → T&amp;C
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
