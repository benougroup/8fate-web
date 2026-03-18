import * as React from "react";
import { getBrandSrc } from "../assets/assetMap";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { usePreferences } from "../stores/preferencesStore";

export function SplashPreview() {
  const { theme } = usePreferences();
  const logoSrc = getBrandSrc(theme, "geon_logo");

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="md" align="center">
            <Stack gap="sm" align="center">
              <img
                src={logoSrc}
                alt="Geon logo"
                className="revamp-splashPreviewLogo"
              />
              <Text muted>Checking server status…</Text>
            </Stack>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
