import * as React from "react";
import { APP_LOGO_SRC } from "../assets/assetMap";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";

export function SplashPreview() {
  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="md" align="center">
            <Stack gap="sm" align="center">
              <img
                src={APP_LOGO_SRC}
                alt="8fate"
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
