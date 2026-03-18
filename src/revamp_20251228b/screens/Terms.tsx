import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dataLegalManifest from "@/assets/data/legal/index.json";
import termsManifest from "@/assets/legal/index.json";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { SectionCard } from "../components/SectionCard";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

const dataLegalHtmlFiles = import.meta.glob<string>("/src/assets/data/legal/*.html", {
  as: "raw",
});
const legalHtmlFiles = import.meta.glob<string>("/src/assets/legal/*.html", {
  as: "raw",
});

type LegalManifest = {
  defaultLocale?: string;
  version?: string;
  assets?: Record<string, string>;
  terms?: { file?: string | null } | null;
  privacy?: { file?: string | null } | null;
};

const MODES = ["onboarding", "viewOnly", "upgradeGate"] as const;

type TermsMode = (typeof MODES)[number];

type LoadedTerms = {
  html: string;
  version: string;
};

function normalizeMode(value: string | null): TermsMode {
  if (value === "onboarding" || value === "upgradeGate" || value === "viewOnly") {
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

async function loadFromManifest(
  manifest: LegalManifest,
  files: Record<string, () => Promise<string>>,
  basePath: string,
  locale: string,
): Promise<LoadedTerms | null> {
  const documentKey = "terms";
  const localeKey = resolveLocaleKey(manifest, locale);
  const explicitFile =
    documentKey === "privacy" ? manifest.privacy?.file : manifest.terms?.file;
  const assetFile =
    explicitFile ||
    manifest.assets?.[localeKey] ||
    manifest.assets?.[manifest.defaultLocale || "en"];

  if (!assetFile) {
    return null;
  }

  const loader = files[`${basePath}/${assetFile}`];
  if (!loader) {
    return null;
  }

  const html = await loader();
  return {
    html,
    version: manifest.version || "1.0",
  };
}

export function Terms() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = normalizeMode(params.get("mode"));
  const { locale, setTncAccepted } = usePreferences();
  const showAgree = mode !== "viewOnly";
  const [termsContent, setTermsContent] = React.useState<string>("");
  const [termsVersion, setTermsVersion] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAgreed, setIsAgreed] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const loadTerms = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadedFromData = await loadFromManifest(
          dataLegalManifest,
          dataLegalHtmlFiles,
          "/src/assets/data/legal",
          locale,
        );
        const loadedFromLegal = loadedFromData
          ? null
          : await loadFromManifest(
              termsManifest,
              legalHtmlFiles,
              "/src/assets/legal",
              locale,
            );
        const result = loadedFromData || loadedFromLegal;

        if (mounted && result) {
          setTermsContent(result.html);
          setTermsVersion(result.version);
          return;
        }

        if (mounted) {
          setError(t("terms.body"));
        }
      } catch (err) {
        console.warn("Failed to load local terms", err);
        if (mounted) {
          setError(t("common.errorUnknownDetail"));
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
    if (mode === "upgradeGate") {
      navigate("/purchase", { replace: true });
      return;
    }
    navigate("/register", { replace: true });
  }

  function handleClose() {
    navigate(-1);
  }

  return (
    <Page>
      <PageCard className="revamp-container--full">
        <PageContent className="revamp-content--full">
          <Stack gap="md">
            <h1 className="title">{t("terms.title")}</h1>
            <PageSection>
              <SectionCard className="revamp-termsCard">
                {loading ? (
                  <Text muted>{t("common.loading")}</Text>
                ) : termsContent ? (
                  <div
                    className="revamp-termsBody"
                    dangerouslySetInnerHTML={{ __html: termsContent }}
                  />
                ) : (
                  <Text muted>{error ?? t("terms.body")}</Text>
                )}
              </SectionCard>
            </PageSection>
            <PageSection>
              <SectionCard>
                <Stack gap="sm" align="start">
                  {termsVersion ? (
                    <Text muted>
                      {t("terms.version", { version: termsVersion })}
                    </Text>
                  ) : null}
                  {showAgree ? (
                    <label className="revamp-termsAgreement">
                      <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(event) => setIsAgreed(event.target.checked)}
                      />
                      <span>
                        {t("terms.agreeLabel", { version: termsVersion || "" })}
                      </span>
                    </label>
                  ) : null}
                  <div className="revamp-termsActions">
                    {showAgree ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleAgree}
                        disabled={!isAgreed}
                      >
                        {t("terms.agree")}
                      </Button>
                    ) : null}
                    <Button variant="ghost" onClick={handleClose}>
                      {t("terms.close")}
                    </Button>
                  </div>
                </Stack>
              </SectionCard>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
