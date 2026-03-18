import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AlertDialog } from "../components/AlertDialog";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TimeMatchOptionCard, type TimeMatchOption } from "../components/TimeMatchOptionCard";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

export function TimeFinder() {
  const navigate = useNavigate();
  const { isPremium, locale } = usePreferences();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleComplete = () => {
    setShowSuccess(true);
  };

  const options = React.useMemo<TimeMatchOption[]>(
    () => [
      {
        id: "dawn",
        hourLabel: t("timeFinder.options.dawn.title"),
        description: t("timeFinder.options.dawn.body"),
        keywords: [
          t("timeFinder.options.dawn.tags.0"),
          t("timeFinder.options.dawn.tags.1"),
        ],
      },
      {
        id: "mid",
        hourLabel: t("timeFinder.options.midday.title"),
        description: t("timeFinder.options.midday.body"),
        keywords: [
          t("timeFinder.options.midday.tags.0"),
          t("timeFinder.options.midday.tags.1"),
          t("timeFinder.options.midday.tags.2"),
        ],
      },
      {
        id: "dusk",
        hourLabel: t("timeFinder.options.dusk.title"),
        description: t("timeFinder.options.dusk.body"),
        keywords: [
          t("timeFinder.options.dusk.tags.0"),
          t("timeFinder.options.dusk.tags.1"),
        ],
      },
      {
        id: "night",
        hourLabel: t("timeFinder.options.night.title"),
        description: t("timeFinder.options.night.body"),
        keywords: [
          t("timeFinder.options.night.tags.0"),
          t("timeFinder.options.night.tags.1"),
        ],
        isLocked: !isPremium,
      },
      {
        id: "midnight",
        hourLabel: t("timeFinder.options.midnight.title"),
        description: t("timeFinder.options.midnight.body"),
        keywords: [
          t("timeFinder.options.midnight.tags.0"),
          t("timeFinder.options.midnight.tags.1"),
          t("timeFinder.options.midnight.tags.2"),
        ],
        isLocked: !isPremium,
      },
    ],
    [isPremium, locale],
  );

  return (
    <Page>
      <PageCard className="revamp-timeMatchCardShell">
        <PageContent>
          <Stack gap="lg">
            <div className="revamp-timeMatchActions">
              <Button variant="ghost" size="sm" pill onClick={handleComplete}>
                {t("timeFinder.skip")}
              </Button>
            </div>
            <PageHeader
              title={t("timeFinder.title")}
              subtitle={t("timeFinder.subtitle")}
            />
            <Text muted>{t("timeFinder.helper")}</Text>
            <div className="revamp-timeMatchList">
              {options.map((option) => (
                <TimeMatchOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedId === option.id}
                  lockedTitle={t("timeFinder.lockedTitle")}
                  lockedBody={t("timeFinder.lockedBody")}
                  lockedCta={t("timeFinder.lockedCta")}
                  onSelect={(id) => setSelectedId(id)}
                  onLockedClick={() => navigate("/purchase")}
                />
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleComplete}
              disabled={!selectedId}
            >
              {t("timeFinder.finish")}
            </Button>
          </Stack>
        </PageContent>
      </PageCard>

      <AlertDialog
        open={showSuccess}
        title={t("timeFinder.successTitle")}
        message={t("timeFinder.successMessage")}
        onClose={() => setShowSuccess(false)}
        actions={[
          {
            key: "daily",
            label: t("timeFinder.successAction"),
            variant: "primary",
            onPress: () => navigate("/daily", { replace: true }),
          },
        ]}
      />
    </Page>
  );
}
