import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import termsManifest from "@/assets/legal/index.json";
import { getIconSrc } from "../assets/assetMap";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { fetchLatestTerms } from "../services/legalSync";

const legalHtmlFiles = import.meta.glob<string>("/src/assets/legal/*.html", {
  as: "raw",
});

type LegalManifest = {
  defaultLocale?: string;
  version?: string;
  assets?: Record<string, string>;
  terms?: { file?: string | null } | null;
};

const MODES = ["onboarding", "accept", "viewOnly"] as const;
type TermsMode = (typeof MODES)[number];

type LoadedTerms = {
  html: string;
  version: string;
  source: "local" | "api";
};

function normalizeMode(value: string | null): TermsMode {
  if (value === "onboarding" || value === "accept" || value === "viewOnly") {
    return value;
  }
  return "viewOnly";
}

function resolveLocaleKey(manifest: LegalManifest, locale: string) {
  if (manifest.assets?.[locale]) {
    return locale;
  }
  return manifest.defaultLocale || "en";
}

async function loadLocalTerms(locale: string): Promise<LoadedTerms | null> {
  const localeKey = resolveLocaleKey(termsManifest, locale);
  const assetFile =
    termsManifest.terms?.file ||
    termsManifest.assets?.[localeKey] ||
    termsManifest.assets?.[termsManifest.defaultLocale || "en"];

  if (!assetFile) {
    return null;
  }

  const loader = legalHtmlFiles[`/src/assets/legal/${assetFile}`];
  if (!loader) {
    return null;
  }

  const html = await loader();
  return {
    html,
    version: termsManifest.version || "1.0.0",
    source: "local",
  };
}

export function Terms() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = normalizeMode(params.get("mode"));
  const { locale, theme, setTncAccepted } = usePreferences();
  const showAgree = mode !== "viewOnly";
  const [termsContent, setTermsContent] = React.useState<string>("");
  const [termsVersion, setTermsVersion] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<"syncing" | "synced" | "local">("syncing");

  React.useEffect(() => {
    let mounted = true;

    const loadTerms = async () => {
      setLoading(true);
      setError(null);
      setSyncStatus("syncing");

      try {
        const localTerms = await loadLocalTerms(locale);
        const latest = await fetchLatestTerms(locale, localTerms);

        if (!mounted) {
          return;
        }

        if (latest) {
          setTermsContent(latest.html);
          setTermsVersion(latest.version);
          setSyncStatus(latest.source === "api" ? "synced" : "local");
          return;
        }

        setError(t("terms.errorLoading"));
      } catch (err) {
        console.warn("Failed to load terms", err);
        if (mounted) {
          setError(t("common.errorUnknownDetail"));
          setSyncStatus("local");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadTerms();

    return () => {
      mounted = false;
    };
  }, [locale]);

  function handleAgree() {
    if (!isAgreed) {
      return;
    }

    setTncAccepted(true);

    if (mode === "onboarding") {
      navigate("/register", { replace: true });
    } else if (mode === "accept") {
      navigate("/daily", { replace: true });
    }
  }

  function handleBack() {
    navigate(-1);
  }

  const textColor = theme === "yang" ? "#1a1a1a" : "#f7f4ee";
  const mutedColor = theme === "yang" ? "rgba(0, 0, 0, 0.65)" : "rgba(247, 244, 238, 0.78)";
  const checkIcon = getIconSrc(theme, "notification_unread");

  return (
    <Page>
      <section className="revamp-simpleScreen revamp-simpleScreen--terms">
        <div className="revamp-simpleScreenContent">
          <header className="revamp-simpleHeader">
            <button
              type="button"
              className="revamp-termsBackButton"
              onClick={handleBack}
              aria-label="Back"
            >
              ←
            </button>
            <h1 className="revamp-simpleTitle">{t("terms.title")}</h1>
            <p style={{ color: mutedColor, fontSize: "13px" }}>
              {termsVersion || "v1.0.0"} · {syncStatus === "synced" ? "Synced with latest legal API" : "Using local legal text"}
            </p>
          </header>

          <div className="revamp-legalBox" style={{ color: textColor }}>
            {loading ? (
              <p style={{ color: mutedColor }}>{t("common.loading")}</p>
            ) : termsContent ? (
              <div className="revamp-termsBody" dangerouslySetInnerHTML={{ __html: termsContent }} />
            ) : (
              <p style={{ color: "#ff6b6b" }}>{error ?? t("terms.errorLoading")}</p>
            )}
          </div>

          {showAgree ? (
            <div className="revamp-termsFooter">
              <label className="revamp-termsAcceptance" style={{ color: textColor }}>
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="revamp-termsCheckboxInput"
                />
                <img src={checkIcon} alt="" className="revamp-termsAcceptanceIcon" />
                <span>I agree to the Terms &amp; Conditions ({termsVersion || "v1.0.0"})</span>
              </label>
              <Button variant="primary" size="lg" onClick={handleAgree} disabled={!isAgreed} style={{ width: "100%" }}>
                {t("terms.agree")}
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="md" onClick={handleBack} style={{ width: "100%" }}>
              {t("common.close")}
            </Button>
          )}
        </div>
      </section>
    </Page>
  );
}
