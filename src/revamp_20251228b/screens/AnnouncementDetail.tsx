import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { buildAnnouncementUrl, getAnnouncementById, resolveAnnouncementImage } from "../services/mock/announcements";
import { usePreferences } from "../stores/preferencesStore";

export function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const { locale } = usePreferences();
  const announcement = id ? getAnnouncementById(id) : undefined;

  if (!announcement) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <Stack gap="md">
              <PageHeader title={t("announcements.missingTitle")} />
              <Text>{t("announcements.missingBody")}</Text>
              <PillLink to="/daily">{t("announcements.backToHome")}</PillLink>
            </Stack>
          </PageContent>
        </PageCard>
      </Page>
    );
  }

  const learnMoreUrl = buildAnnouncementUrl(announcement.url, locale);

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            <PageHeader title={t("announcements.detailTitle")} />
            <PageSection>
              <Stack gap="sm" align="start">
                <img
                  className="revamp-announcementDetailImage"
                  src={resolveAnnouncementImage(announcement.image)}
                  alt=""
                />
                <Text className="revamp-announcementDetailId">
                  {t("announcements.cardTitle", { id: announcement.id })}
                </Text>
                <Text>{t("announcements.detailBody")}</Text>
                <div className="revamp-announcementDetailActions">
                  <a href={learnMoreUrl} target="_blank" rel="noreferrer">
                    {t("announcements.learnMore")}
                  </a>
                  <Link to="/faq">{t("announcements.faqLink")}</Link>
                </div>
              </Stack>
            </PageSection>
            <PillLink to="/daily">{t("announcements.backToHome")}</PillLink>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
