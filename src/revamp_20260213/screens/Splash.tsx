import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getBrandSrc } from "../assets/assetMap";
import { Page } from "../components/Page";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

const MIN_DISPLAY_MS = 2200;
const DEV_SPLASH_WAIT_MS = 3000;

type ErrorType = "network" | "outdated" | "server_down" | null;

export function Splash() {
  const navigate = useNavigate();
  const { theme, hasAcceptedTnc, userId, isReady } = usePreferences();
  const logoSrc = getBrandSrc(theme, "geon_logo");
  const quoteSrc = getBrandSrc(theme, "geon_quote");

  const [error, setError] = React.useState<ErrorType>(null);
  const [isChecking, setIsChecking] = React.useState(true);
  const timerRef = React.useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const runCheck = React.useCallback(async () => {
    const started = performance.now();

    if (import.meta.env.DEV) {
      timerRef.current = window.setTimeout(() => {
        if (!userId) navigate("/login", { replace: true });
        else if (!hasAcceptedTnc) navigate("/terms?mode=onboarding", { replace: true });
        else navigate("/daily", { replace: true });
      }, DEV_SPLASH_WAIT_MS);
      setIsChecking(false);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setError("network");
      setIsChecking(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const elapsed = performance.now() - started;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      timerRef.current = window.setTimeout(() => {
        if (!userId) navigate("/login", { replace: true });
        else if (!hasAcceptedTnc) navigate("/terms?mode=onboarding", { replace: true });
        else navigate("/daily", { replace: true });
      }, remaining);
      setIsChecking(false);
    } catch {
      setError("server_down");
      setIsChecking(false);
    }
  }, [userId, hasAcceptedTnc, navigate]);

  React.useEffect(() => {
    if (!isReady) return;
    void runCheck();
    return () => clearTimer();
  }, [isReady, runCheck]);

  const isDark = theme === "yin";

  return (
    <Page>
      {/* Full-screen splash — NO glass card, content floats directly on background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(28px, 7vw, 56px)",
          padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
        }}
      >
        {/* Logo — large, centered, with subtle glow */}
        <img
          src={logoSrc}
          alt={t("brand.geonLogoAlt")}
          style={{
            width: "min(56vw, 240px)",
            height: "auto",
            filter: isDark
              ? "drop-shadow(0 0 40px rgba(244,215,62,0.3)) drop-shadow(0 12px 32px rgba(0,0,0,0.5))"
              : "drop-shadow(0 0 30px rgba(0,0,0,0.2)) drop-shadow(0 12px 32px rgba(0,0,0,0.25))",
            animation: "revampLogoPulse 2.6s ease-in-out infinite",
          }}
        />

        {/* Quote — only when no error */}
        {!error && quoteSrc && (
          <img
            src={quoteSrc}
            alt="我命由我不由天"
            style={{
              width: "clamp(150px, 38vw, 220px)",
              height: "auto",
              opacity: 0.88,
            }}
          />
        )}

        {/* Error state — minimal frosted pill */}
        {error ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              padding: "20px 28px",
              borderRadius: "20px",
              background: isDark
                ? "rgba(0,0,0,0.5)"
                : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              maxWidth: "min(88vw, 300px)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#ff6b6b",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: 1.5,
              }}
            >
              {t(`splash.error.${error === "server_down" ? "serverDown" : error}`)}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsChecking(true);
                void runCheck();
              }}
              style={{
                minHeight: "44px",
                padding: "0 32px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #F4D73E 0%, #e6c52a 100%)",
                color: "#0b0c2a",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(244,215,62,0.35)",
              }}
            >
              {t("common.retry")}
            </button>
          </div>
        ) : (
          /* Animated loading dots — subtle, no card */
          <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: isDark
                    ? "rgba(244,215,62,0.7)"
                    : "rgba(0,0,0,0.3)",
                  display: "inline-block",
                  animation: `splashDotPulse 1.3s ease-in-out ${i * 0.22}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes splashDotPulse {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Page>
  );
}
