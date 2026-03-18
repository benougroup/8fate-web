import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getBrandSrc } from "../assets/assetMap";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { ENV } from "../config/env";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

export function Splash() {
  const navigate = useNavigate();
  const { theme, hasAcceptedTnc, userId, isReady } = usePreferences();
  const logoSrc = getBrandSrc(theme, "geon_logo");
  const [delayReady, setDelayReady] = React.useState(!ENV.useMock);

  React.useEffect(() => {
    if (!ENV.useMock) {
      return;
    }
    const timer = window.setTimeout(() => {
      setDelayReady(true);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!isReady || !delayReady) {
      return;
    }

    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    if (!hasAcceptedTnc) {
      navigate("/tnc?mode=onboarding", { replace: true });
      return;
    }

    navigate("/daily", { replace: true });
  }, [delayReady, hasAcceptedTnc, isReady, navigate, userId]);

  return (
    <Page>
      <PageCard className="revamp-authCard">
        <PageContent className="revamp-content--full">
          <Stack gap="md" align="center">
            <Stack gap="sm" align="center">
              <img
                src={logoSrc}
                alt={t("brand.geonLogoAlt")}
                className="revamp-splashPreviewLogo"
              />
              <Text muted>{t("splash.status")}</Text>
            </Stack>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
