import * as React from "react";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { InnerTopBar } from "../components/InnerTopBar";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { PageSection } from "../components/PageSection";
import { SectionTitle } from "../components/SectionTitle";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";

const SUPPORT_EMAIL = "support@8fate.ai";
const SUPPORT_URL = "https://8fate.ai/support";

export function FaqPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <PageCard>
        <InnerTopBar title={t("faq.title")} subtitle={t("faq.subtitle")} backTo={-1} />
        <PageContent>
          <Stack gap="lg">
            <PageSection>
              <Stack gap="sm" align="start">
                <SectionTitle>{t("faq.sections.gettingStarted.title")}</SectionTitle>
                <Text>{t("faq.sections.gettingStarted.body")}</Text>
              </Stack>
            </PageSection>
            <PageSection>
              <Stack gap="sm" align="start">
                <SectionTitle>{t("faq.sections.notifications.title")}</SectionTitle>
                <Text>{t("faq.sections.notifications.body")}</Text>
              </Stack>
            </PageSection>
            <PageSection>
              <Stack gap="sm" align="start">
                <SectionTitle>{t("faq.sections.privacy.title")}</SectionTitle>
                <Text>{t("faq.sections.privacy.body")}</Text>
              </Stack>
            </PageSection>
            <PageSection>
              <Stack gap="sm" align="start">
                <SectionTitle>{t("faq.sections.contact.title")}</SectionTitle>
                <Text>{t("faq.sections.contact.body")}</Text>
                <div className="revamp-faqContact">
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                  <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
                    {SUPPORT_URL}
                  </a>
                </div>
              </Stack>
            </PageSection>
            <div className="revamp-faqActions">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                {t("faq.back")}
              </Button>
            </div>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
