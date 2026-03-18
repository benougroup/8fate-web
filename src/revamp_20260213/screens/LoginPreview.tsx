import * as React from "react";
import { getBrandSrc } from "../assets/assetMap";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PillButton, PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { usePreferences } from "../stores/preferencesStore";

export function LoginPreview() {
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
              <PillButton className="revamp-loginPreviewButton">
                Continue with Google
              </PillButton>
              <Text className="revamp-loginLegal">
                By continuing, you agree to the{" "}
                <PillLink to="/__preview/terms">Terms &amp; Privacy</PillLink>.
              </Text>
            </Stack>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
