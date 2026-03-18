import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS (Strictly matched to folder structure) ---
import backgroundImage from "@/assets/images/ui/background_002.png";
import logoImage from "@/assets/images/ui/logo.png";
import quoteImage from "@/assets/images/ui/splash.png";

import BackgroundScreen from "@/components/BackgroundScreen";
import { resolvePreferredLanguage } from "@/utils/userPreferences";

// --- SERVICES ---
import { startGoogleSignIn } from "@services/auth";
import { exchangeGoogleToken } from "@services/endpoints/userAuth";
import { setSession } from "@services/sessionStore"; // Assuming this exists based on your provided code

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const preferredLanguage = useMemo(() => resolvePreferredLanguage(), []);
  const loginCopy = useMemo(() => getLoginCopy(preferredLanguage), [preferredLanguage]);
  const shouldBypassGoogle =
    import.meta.env.DEV ||
    import.meta.env.VITE_BYPASS_GOOGLE_AUTH === "true" ||
    import.meta.env.VITE_USE_MOCKS === "true";

  // --- API HANDLER ---
  async function handleLogin() {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!shouldBypassGoogle) {
        const authUrl = await startGoogleSignIn();
        window.location.assign(authUrl);
        return;
      }

      // 1. Simulate getting the Google Token (Replace with actual Google Auth logic later)
      const mockGoogleToken = "demo-token-123";

      // 2. Call the Backend Gateway
      const response = await exchangeGoogleToken(mockGoogleToken);

      // 3. Handle Network/Server Errors
      if (!response.ok || !response.data) {
        throw new Error(response.error?.message || "Login failed. Please try again.");
      }

      const forcedNewUser = shouldBypassGoogle ? true : response.data.isNewUser;
      const { userKey, isPremium, name } = response.data;
      const isNewUser = forcedNewUser ?? true;

      // 4. Save Session (Local State)
      setSession({
        userKey,
        isPremium,
        name: name || "User",
        isNewUser,
        // If new user, they need to do profile setup logic
        requiresProfile: isNewUser,
        requiresTimeSelection: isNewUser,
      });

      // 5. Conditional Navigation
      if (isNewUser) {
        // New User -> Terms Acceptance
        navigate("/terms", { replace: true, state: { mode: "accept", userKey } });
      } else {
        // Returning User -> Dashboard
        navigate("/dashboard", { replace: true });
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      setErrorMessage(err.message || "Unable to connect to login server.");
      setIsLoading(false);
    }
  }

  return (
    <BackgroundScreen
      backgroundImage={backgroundImage}
      className="login-screen"
      contentClassName="login-content"
    >
      <style>{`
        .login-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .login-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          text-align: center;
          padding: 32px 20px;
          width: 100%;
          max-width: 360px;
          min-height: 100vh;
        }

        .login-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        /* LOGO */
        .logo {
          width: clamp(150px, 38vw, 200px);
          height: auto;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
          transition: transform 0.3s ease;
        }
        
        .logo.spinning {
          animation: spin 2s linear infinite;
        }

        /* MOTTO */
        .motto {
          width: clamp(180px, 42vw, 260px);
          height: auto;
          opacity: 0.9;
        }

        /* LOGIN BUTTON */
        .login-btn {
          width: 100%;
          max-width: 260px;
          padding: 14px 24px;
          border-radius: 30px;
          border: none;
          background: #F4D73E; /* Gold/Yellow from spec */
          color: #0B0C2A;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(244, 215, 62, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-btn:active {
          transform: scale(0.98);
        }

        /* LOADING INDICATOR */
        .loading-text {
          color: #F4D73E;
          font-size: 16px;
          letter-spacing: 1px;
          font-weight: 600;
          animation: pulse 1.5s infinite;
        }

        /* ERROR MESSAGE */
        .error-msg {
          color: #ff6b6b;
          font-size: 14px;
          background: rgba(0,0,0,0.4);
          padding: 8px 12px;
          border-radius: 8px;
          margin-top: 8px;
        }

        /* FOOTER LINKS */
        .footer {
          display: flex;
          gap: 16px;
          z-index: 2;
          padding-bottom: 12px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 50% { opacity: 0.6; } }
      `}</style>

      <div className="login-main">
        {/* Main Content */}
        <img 
          src={logoImage} 
          alt="8Fate Logo" 
          className={`logo ${isLoading ? "spinning" : ""}`} 
        />

        {/* Action Area: Button OR Loading Text */}
        {!isLoading ? (
          <button onClick={handleLogin} className="login-btn">
            {loginCopy.cta}
          </button>
        ) : (
          <div className="loading-text">{loginCopy.loading}</div>
        )}

        <img src={quoteImage} alt="Motto" className="motto" />

        {/* Error Display */}
        {errorMessage && <div className="error-msg">{errorMessage}</div>}
      </div>

      {/* Footer */}
      <div className="footer">
        <button
          className="footer-link"
          onClick={() => navigate("/terms", { state: { mode: "read-only" } })}
        >
          {loginCopy.terms}
        </button>
      </div>
    </BackgroundScreen>
  );
}

function getLoginCopy(language: string) {
  if (language.toLowerCase().startsWith("zh")) {
    return {
      cta: "登入",
      loading: "正在登入…",
      terms: "條款與隱私",
    };
  }
  return {
    cta: "Login",
    loading: "Loading…",
    terms: "Terms & Privacy",
  };
}
