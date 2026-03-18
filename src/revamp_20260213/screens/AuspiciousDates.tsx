import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { t } from "../i18n/t";
import { getAuspiciousDates } from "../services/providers/baziProvider";
import type { AuspiciousDate } from "../services/mock/baziTypes";

export function AuspiciousDates() {
  const [dates, setDates] = React.useState<AuspiciousDate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<AuspiciousDate | null>(null);

  React.useEffect(() => {
    async function loadDates() {
      try {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setMonth(endDate.getMonth() + 3); // Next 3 months

        const startStr = today.toISOString().split("T")[0];
        const endStr = endDate.toISOString().split("T")[0];

        const data = await getAuspiciousDates(startStr, endStr);
        setDates(data);
        if (data.length > 0) {
          setSelectedDate(data[0]);
        }
      } catch (error) {
        console.error("Failed to load auspicious dates:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDates();
  }, []);

  if (isLoading) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <Stack gap="md" align="center">
              <Text>{t("common.loading")}</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--c-success)";
    if (score >= 60) return "var(--c-accent)";
    if (score >= 40) return "var(--c-warning)";
    return "var(--c-error)";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="xl">
            {/* Header */}
            <PageHeader
              title={t("bazi.auspicious.title")}
              subtitle={t("bazi.auspicious.subtitle")}
              icon="today"
            />

            {/* Date List */}
            <PageSection>
              <Stack gap="sm">
                <Text className="revamp-sectionTitle">Upcoming Auspicious Dates</Text>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "var(--space-sm)",
                  }}
                >
                  {dates.map((date) => {
                    const isSelected = selectedDate?.date === date.date;
                    return (
                      <Card
                        key={date.date}
                        style={{
                          cursor: "pointer",
                          border: isSelected
                            ? "2px solid var(--c-accent)"
                            : "1px solid var(--c-border)",
                          textAlign: "center",
                        }}
                        onClick={() => setSelectedDate(date)}
                      >
                        <Stack gap="xs" align="center">
                          <Text
                            style={{
                              fontSize: "var(--fs-sm)",
                              fontWeight: 600,
                            }}
                          >
                            {new Date(date.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </Text>
                          <div
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color: getScoreColor(date.score),
                            }}
                          >
                            {date.score}
                          </div>
                          <Text
                            muted
                            style={{
                              fontSize: "var(--fs-xs)",
                            }}
                          >
                            {getScoreLabel(date.score)}
                          </Text>
                        </Stack>
                      </Card>
                    );
                  })}
                </div>
              </Stack>
            </PageSection>

            {/* Selected Date Details */}
            {selectedDate && (
              <>
                {/* Date Score */}
                <PageSection>
                  <Card style={{ textAlign: "center" }}>
                    <Stack gap="sm" align="center">
                      <Text className="revamp-sectionTitle">
                        {new Date(selectedDate.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                      <div
                        style={{
                          fontSize: "4rem",
                          fontWeight: 700,
                          color: getScoreColor(selectedDate.score),
                          lineHeight: 1,
                        }}
                      >
                        {selectedDate.score}
                      </div>
                      <Text muted>{getScoreLabel(selectedDate.score)}</Text>
                    </Stack>
                  </Card>
                </PageSection>

                {/* Day Pillar */}
                <PageSection>
                  <Stack gap="md">
                    <Text className="revamp-sectionTitle">Day Pillar</Text>
                    <div style={{ maxWidth: "200px", margin: "0 auto" }}>
                      <BaziPillarCard
                        pillarName="Day"
                        stem={selectedDate.dayPillar.stem}
                        stemEn={selectedDate.dayPillar.stemEn}
                        branch={selectedDate.dayPillar.branch}
                        branchEn={selectedDate.dayPillar.branchEn}
                        tenGod={selectedDate.dayPillar.tenGod}
                        element={selectedDate.dayPillar.elementEn}
                      />
                    </div>
                  </Stack>
                </PageSection>

                {/* Favorable & Unfavorable Activities */}
                <PageSection>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "var(--space-md)",
                    }}
                  >
                    {/* Favorable */}
                    <Card>
                      <Stack gap="sm">
                        <Text
                          className="revamp-sectionTitle"
                          style={{ color: "var(--c-success)" }}
                        >
                          ✓ {t("bazi.auspicious.favorableFor")}
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                          {selectedDate.favorableFor.map((item, index) => (
                            <li key={index}>
                              <Text muted>{item}</Text>
                            </li>
                          ))}
                        </ul>
                      </Stack>
                    </Card>

                    {/* Unfavorable */}
                    <Card>
                      <Stack gap="sm">
                        <Text
                          className="revamp-sectionTitle"
                          style={{ color: "var(--c-error)" }}
                        >
                          ✗ {t("bazi.auspicious.unfavorableFor")}
                        </Text>
                        <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                          {selectedDate.unfavorableFor.map((item, index) => (
                            <li key={index}>
                              <Text muted>{item}</Text>
                            </li>
                          ))}
                        </ul>
                      </Stack>
                    </Card>
                  </div>
                </PageSection>

                {/* Analysis */}
                <PageSection>
                  <Card>
                    <Stack gap="sm">
                      <Text className="revamp-sectionTitle">
                        {t("bazi.auspicious.analysis")}
                      </Text>
                      <Text muted>{selectedDate.analysis}</Text>
                    </Stack>
                  </Card>
                </PageSection>
              </>
            )}
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
