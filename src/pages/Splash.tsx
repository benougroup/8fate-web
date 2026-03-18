import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import appConfig from "@/assets/data/app_config.json";
import backgroundImage from "@/assets/images/ui/background_001.png";
import logoImage from "@/assets/images/ui/logo.png";
import quoteImage from "@/assets/images/ui/splash.png";
import warningIcon from "@/assets/images/general icons/exclamation_mark_icon.png";
import BackgroundScreen from "@/components/BackgroundScreen";
import Button from "@/components/Button";
import ErrorBox from "@/components/ErrorBox";
import { bootServices } from "@services";
import { checkAppStatus } from "@services/endpoints/system";
import { mapError, type UiError } from "@services/errorMap";
import { resolvePreferredLanguage } from "@/utils/userPreferences";

const MIN_DISPLAY_MS = 2200;
const DEV_SPLASH_WAIT_MS = 3000;

const ERROR_COPY_OVERRIDES: Partial<Record<string, Partial<UiError>>> = {
  APP_OUTDATED: {
    message: "Please visit App Store to download latest version.",
  },
};

export default function Splash() {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const [errorInfo, setErrorInfo] = useState<UiError | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const baseUrl = useMemo(
    () => (import.meta as any).env?.VITE_API_BASE_URL || "https://api.example.com",
    [],
  );

  const redirectUri = useMemo(
    () =>
      (import.meta as any).env?.VITE_AUTH_REDIRECT_URI ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "https://app.example.com/auth/callback"),
    [],
  );

  const chatPath = useMemo(() => (import.meta as any).env?.VITE_CHAT_PATH, []);

  const preferredLanguage = useMemo(() => resolvePreferredLanguage(), []);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleExit() {
    setErrorInfo(null);
    if (typeof window !== "undefined") {
      (window.navigator as any)?.app?.exitApp?.();
      window.close();
      // As a last resort, move away from the app UI so the user isn't stuck on an error screen
      window.location.href = "about:blank";
    }
  }

  async function runServerCheck(cancelledRef: { current: boolean }) {
    setErrorInfo(null);
    setIsChecking(true);

    const started = performance.now();

    if (import.meta.env.DEV) {
      timerRef.current = window.setTimeout(() => {
        if (!cancelledRef.current) navigate("/login", { replace: true });
      }, DEV_SPLASH_WAIT_MS);
      setIsChecking(false);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setErrorInfo(mapError({ code: "NETWORK_ERROR" }, ERROR_COPY_OVERRIDES));
      setIsChecking(false);
      return;
    }

    try {
      bootServices({
        baseUrl,
        auth: { redirectUri },
        apiClient: { chatPath },
      });

      const appVersion = (import.meta as any).env?.VITE_APP_VERSION || "2.1.0";
      const buildNumber = Number((import.meta as any).env?.VITE_APP_BUILD || 123);
      const platform = (appConfig as any)?.platform ?? "iOS";

      const response = await checkAppStatus({
        appVersion,
        platform,
        build: buildNumber,
        language: preferredLanguage,
      });

      if (cancelledRef.current) return;

      if (!response.ok || !response.data) {
        const mapped = mapError(response.error ?? { code: "SERVER_ERROR" }, ERROR_COPY_OVERRIDES);
        setErrorInfo(mapped);
        setIsChecking(false);
        return;
      }

      const status = response.data;

      if (!status.serverOk) {
        setErrorInfo(mapError({ code: "SERVER_DOWN" }, ERROR_COPY_OVERRIDES));
        setIsChecking(false);
        return;
      }

      const isOutdated = compareVersions(appVersion, status.minSupportedVersion) < 0 || status.forceUpdate;
      if (isOutdated) {
        setErrorInfo(mapError({ code: "APP_OUTDATED" }, ERROR_COPY_OVERRIDES));
        setIsChecking(false);
        return;
      }

      const elapsed = performance.now() - started;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      timerRef.current = window.setTimeout(() => {
        if (!cancelledRef.current) navigate("/login", { replace: true });
      }, remaining);
      setIsChecking(false);
    } catch (err) {
      console.error("Splash check failed", err);
      if (!cancelledRef.current) {
        const offline = typeof navigator !== "undefined" && navigator.onLine === false;
        setErrorInfo(mapError({ code: offline ? "NETWORK_ERROR" : "SERVER_ERROR" }, ERROR_COPY_OVERRIDES));
        setIsChecking(false);
      }
    }
  }

  useEffect(() => {
    const cancelled = { current: false };
    runServerCheck(cancelled);
    return () => {
      cancelled.current = true;
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BackgroundScreen
      backgroundImage={backgroundImage}
      className="splash-screen"
      contentClassName="splash-content"
    >
      <style>{`
        .splash-screen {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          text-align: center;
          padding: 32px;
        }

        .logo-spin {
          width: clamp(140px, 32vw, 220px);
          height: clamp(140px, 32vw, 220px);
          animation: splashSpin 2.6s linear infinite;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
        }

        .quote-breathe {
          width: clamp(180px, 38vw, 280px);
          height: auto;
          animation: splashBreathe 2.8s ease-in-out infinite;
          opacity: 0.92;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3fe2c5;
          box-shadow: 0 0 12px rgba(63, 226, 197, 0.6);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e6ecf5;
          font-size: 14px;
          letter-spacing: 0.3px;
          opacity: 0.82;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(11, 12, 42, 0.71);
          display: grid;
          place-items: center;
          z-index: 4;
        }

        .modal-box {
          width: min(92vw, 380px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35));
        }

        .modal-message {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: inherit;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          color: inherit;
        }

        .modal-body {
          font-size: 14px;
          line-height: 1.5;
          color: inherit;
          opacity: 0.9;
        }

        @keyframes splashSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes splashBreathe {
          0%, 100% { opacity: 0.82; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>

      <img src={logoImage} alt="8Fate logo" className="logo-spin" aria-hidden={!isChecking} />
      <img src={quoteImage} alt="我命由我不由天" className="quote-breathe" />

      <div className="status-row" aria-live="polite">
        <span className="status-dot" />
        <span>{isChecking ? "Checking server status…" : "Preparing login…"}</span>
      </div>

      {errorInfo ? (
        <div className="modal-backdrop">
          <div className="modal-box" role="alertdialog" aria-modal="true">
            <img src={warningIcon} alt="Warning" className="modal-icon" />
            <ErrorBox
              tone={errorInfo.severity === "error" ? "error" : "warning"}
              message={
                <div className="modal-message">
                  <span className="modal-title">{errorInfo.title}</span>
                  <span className="modal-body">{errorInfo.message}</span>
                </div>
              }
              style={{ margin: 0, width: "100%" }}
            />
            <Button type="button" variant="secondary" onClick={handleExit}>
              OK
            </Button>
          </div>
        </div>
          ) : null}
    </BackgroundScreen>
  );
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map((n) => parseInt(n, 10) || 0);
  const partsB = b.split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}
