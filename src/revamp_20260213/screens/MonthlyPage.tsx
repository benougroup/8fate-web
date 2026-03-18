import * as React from "react";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";

export function MonthlyPage() {
  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="md">
            <PageHeader title={t("placeholder.monthly.title")} />
            <PageSection>
              <div className="revamp-placeholderCard glass-card" />
            </PageSection>
            <PageSection>
              <Stack gap="sm" align="start">
                <Text>{t("placeholder.monthly.body")}</Text>
                <PillLink to="/daily">{t("placeholder.cta.backToHome")}</PillLink>
              </Stack>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
