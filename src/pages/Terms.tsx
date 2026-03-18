import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_002.png";
import dataLegalManifest from "@/assets/data/legal/index.json";
import termsManifest from "@/assets/legal/index.json";
import BackgroundScreen from "@/components/BackgroundScreen";
import Card from "@/components/Card";

// --- SERVICES ---
import { acceptTerms, fetchTerms as fetchTermsApi } from "@services/endpoints/legal";
import { getSession, setSession } from "@services/sessionStore";

const dataLegalHtmlFiles = import.meta.glob<string>("/src/assets/data/legal/*.html", { as: "raw" });
const legalHtmlFiles = import.meta.glob<string>("/src/assets/legal/*.html", { as: "raw" });

interface TermsLocationState {
  mode?: "accept" | "read-only";
  document?: "terms" | "privacy";
  userKey?: string;
}

type LegalManifest = {
  defaultLocale?: string;
  version?: string;
  assets?: Record<string, string>;
  terms?: { file?: string | null } | null;
  privacy?: { file?: string | null } | null;
};

export default function Terms() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const state = (location.state || {}) as TermsLocationState;

  const isAcceptanceMode = state.mode !== "read-only";
  const userKey = state.userKey || getSession()?.userKey;
  const pageTitle = state.document === "privacy" ? "Privacy Policy" : "Terms & Conditions";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [termsContent, setTermsContent] = useState<string>("Loading terms...");
  const [termsVersion, setTermsVersion] = useState<string>("1.0");
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTerms() {
      const localLoaded = await loadLocalTerms();
      if (localLoaded && mounted) {
        setLoading(false);
      }
      await fetchTermsFromApi(localLoaded);
    }

    loadTerms();

    return () => {
      mounted = false;
    };
  }, []);

  async function loadLocalTerms() {
    try {
      const loadFromManifest = async (
        manifest: LegalManifest,
        files: Record<string, () => Promise<string>>,
        basePath: string,
      ) => {
        const locale = manifest.defaultLocale || "en";
        const document = state.document || "terms";
        const explicitFile =
          document === "privacy" ? manifest.privacy?.file : manifest.terms?.file;
        const assetFile = explicitFile || manifest.assets?.[locale];

        if (!assetFile) return false;

        const loader = files[`${basePath}/${assetFile}`];
        if (!loader) return false;

        const html = await loader();
        setTermsContent(html);
        setTermsVersion(manifest.version || "1.0");
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
        return true;
      };

      const loadedFromData = await loadFromManifest(
        dataLegalManifest,
        dataLegalHtmlFiles,
        "/src/assets/data/legal",
      );
      if (loadedFromData) return true;

      return await loadFromManifest(termsManifest, legalHtmlFiles, "/src/assets/legal");
    } catch (err) {
      console.warn("Local terms not found, relying on API.");
      return false;
    }
  }

  async function fetchTermsFromApi(hasLocalTerms: boolean) {
    setError(null);
    try {
      const res = await fetchTermsApi("en");

      if (res.ok && res.data) {
        setTermsContent(res.data.html || "No content available.");
        setTermsVersion(res.data.version || "1.0");
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      } else if (!hasLocalTerms) {
        setError("Failed to load terms. Please check your connection.");
      }
    } catch (err) {
      console.error("Terms fetch error:", err);
      if (!hasLocalTerms) {
        setError("Unable to load terms.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept() {
    if (!isAgreed || submitting) return;

    if (!userKey) {
      setError("Session expired. Please log in again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await acceptTerms(termsVersion);

      if (!res.ok) {
        throw new Error("Acceptance failed.");
      }

      const currentSession = getSession();
      if (currentSession) {
        const { loggedIn: _ignored, ...rest } = currentSession;
        setSession({ ...rest, isNewUser: false, termsAcceptedVersion: termsVersion });
      }
      navigate("/profile-setup", { replace: true });
    } catch (err) {
      console.error("Accept error:", err);
      setError("Failed to submit acceptance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    navigate("/login");
  }

  return (
    <BackgroundScreen
      backgroundImage={backgroundImage}
      className="terms-screen"
      contentClassName="terms-card"
    >
      <style>{`
        .terms-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .terms-card {
          width: min(92vw, 680px);
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
        }

        .terms-title {
          color: #F4D73E;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          text-align: left;
        }

        .terms-version {
          margin: 0;
          color: rgba(230, 236, 245, 0.75);
          font-size: 13px;
        }

        .terms-content-card {
          display: flex;
          flex-direction: column;
          max-height: 50vh;
        }

        .terms-scroll-area {
          flex: 1;
          overflow-y: auto;
          color: #e6ecf5;
          font-size: 14px;
          line-height: 1.55;
          white-space: normal;
          padding-right: 6px;
        }
        .terms-scroll-area h1,
        .terms-scroll-area h2,
        .terms-scroll-area h3 {
          margin: 8px 0 4px 0;
          line-height: 1.25;
          font-size: 15px;
        }
        .terms-scroll-area p {
          margin: 0 0 6px 0;
          line-height: 1.35;
        }
        .terms-scroll-area ul {
          margin: 0 0 6px 0;
          padding-left: 18px;
        }
        .terms-scroll-area li {
          margin: 0 0 4px 0;
        }

        .actions-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          color: #e6ecf5;
          font-size: 14px;
          user-select: none;
        }

        .checkbox-row input {
          margin-top: 2px;
          accent-color: #F4D73E;
          width: 18px;
          height: 18px;
        }

        .action-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          border-radius: 24px;
          border: none;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-primary {
          background: #F4D73E;
          color: #0B0C2A;
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #545b68;
          color: #888;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #466270;
          color: #e6ecf5;
        }

        .error-text {
          color: #ff6b6b;
          font-size: 13px;
          text-align: center;
        }
      `}</style>

      <h2 className="terms-title">{pageTitle}</h2>
      <p className="terms-version">Version {termsVersion}</p>

      <Card className="terms-content-card">
        <div className="terms-scroll-area" ref={scrollRef}>
          {loading ? "Loading latest terms..." : (
            <div className="markdown-content" dangerouslySetInnerHTML={{ __html: termsContent }} />
          )}
        </div>
      </Card>

      <div className="actions-area">
        {error && <span className="error-text">{error}</span>}

        {isAcceptanceMode ? (
          <>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={() => !submitting && setIsAgreed(!isAgreed)}
                disabled={submitting}
              />
              <span>I agree to the Terms &amp; Conditions (v{termsVersion}).</span>
            </label>

            <div className="action-row">
              <button className="action-btn btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button
                className="action-btn btn-primary"
                disabled={!isAgreed || submitting}
                onClick={handleAccept}
              >
                {submitting ? "Accepting..." : "Agree & Continue"}
              </button>
            </div>
          </>
        ) : (
          <button className="action-btn btn-secondary" onClick={handleBack}>
            Back
          </button>
        )}
      </div>
    </BackgroundScreen>
  );
}
