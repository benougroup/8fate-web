import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";

export function PortfolioPage() {
  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="md">
            <PageHeader title={t("placeholder.portfolio.title")} />
            <PageSection>
              <div className="revamp-placeholderCard glass-card" />
            </PageSection>
            <PageSection>
              <Stack gap="sm" align="start">
                <Text>{t("placeholder.portfolio.body")}</Text>
                <PillLink to="/daily">{t("placeholder.cta.backToHome")}</PillLink>
              </Stack>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
