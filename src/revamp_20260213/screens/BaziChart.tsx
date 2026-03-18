import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { ElementBalanceChart } from "../components/ElementBalanceChart";
import { DayMasterCard } from "../components/DayMasterCard";
import { ElementAnalysisCard } from "../components/ElementAnalysisCard";
import { BaziTermTooltip } from "../components/BaziTermTooltip";
import { IconSectionHeader } from "../components/IconSectionHeader";
import { SectionInfoButton } from "../components/SectionInfoButton";
import { usePreferences } from "../stores/preferencesStore";
import { getIconSrc } from "../assets/assetMap";
import { t } from "../i18n/t";
import { getBaziProfileById } from "../services/mock/baziData";

export function BaziChart() {
  // For now, use mock data. Later this will come from profile selection
  const profile = getBaziProfileById("profile-1");

  if (!profile) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <Stack gap="md" align="center">
              <Text>No profile found</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  const { chart, elements } = profile;
  const { theme } = usePreferences();

  // Prepare element data for chart
  const elementColors: Record<string, string> = {
    Wood: "#10b981",
    Fire: "#ef4444",
    Earth: "#f59e0b",
    Metal: "#94a3b8",
    Water: "#3b82f6",
  };

  const elementData = [
    {
      name: t("bazi.elements.wood"),
      nameChinese: "木",
      score: elements.wood,
      color: elementColors.Wood,
    },
    {
      name: t("bazi.elements.fire"),
      nameChinese: "火",
      score: elements.fire,
      color: elementColors.Fire,
    },
    {
      name: t("bazi.elements.earth"),
      nameChinese: "土",
      score: elements.earth,
      color: elementColors.Earth,
    },
    {
      name: t("bazi.elements.metal"),
      nameChinese: "金",
      score: elements.metal,
      color: elementColors.Metal,
    },
    {
      name: t("bazi.elements.water"),
      nameChinese: "水",
      score: elements.water,
      color: elementColors.Water,
    },
  ];

  // Find strongest and weakest elements
  const sortedElements = [...elementData].sort((a, b) => b.score - a.score);
  const strongest = sortedElements[0];
  const weakest = sortedElements[sortedElements.length - 1];

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            {/* Header */}
            <PageHeader
              title={t("bazi.chart.title")}
              subtitle={t("bazi.chart.subtitle")}
              icon="chart"
            />

            {/* Day Master Display */}
            <PageSection>
              <Stack gap="sm">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <IconSectionHeader iconKey="daymaster" title={t("bazi.chart.dayMaster")} />
                  <SectionInfoButton title={t("bazi.chart.dayMaster")} body={t("info.dayMaster.body")} />
                </div>
              </Stack>
              <DayMasterCard
                dayMaster={chart.dayMaster}
                dayMasterEn={chart.dayMasterEn}
                element={chart.dayMasterElement}
                elementEn={chart.dayMasterElementEn}
                description={t("bazi.glossary.dayMaster")}
              />
            </PageSection>

            {/* Four Pillars */}
            <PageSection>
              <Stack gap="sm">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconSectionHeader iconKey="heavenly_stem" title={t("bazi.chart.fourPillars")} />
                  <SectionInfoButton title={t("bazi.chart.fourPillars")} body={t("info.fourPillars.body")} />
                  <BaziTermTooltip
                    term={t("bazi.common.pillar")}
                    definition={t("bazi.glossary.pillar")}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "var(--space-md)",
                  }}
                >
                  <BaziPillarCard
                    pillarName={t("bazi.chart.yearPillar")}
                    stem={chart.year.stem}
                    stemEn={chart.year.stemEn}
                    branch={chart.year.branch}
                    branchEn={chart.year.branchEn}
                    tenGod={chart.year.tenGod}
                    element={chart.year.elementEn}
                  />
                  <BaziPillarCard
                    pillarName={t("bazi.chart.monthPillar")}
                    stem={chart.month.stem}
                    stemEn={chart.month.stemEn}
                    branch={chart.month.branch}
                    branchEn={chart.month.branchEn}
                    tenGod={chart.month.tenGod}
                    element={chart.month.elementEn}
                  />
                  <BaziPillarCard
                    pillarName={t("bazi.chart.dayPillar")}
                    stem={chart.day.stem}
                    stemEn={chart.day.stemEn}
                    branch={chart.day.branch}
                    branchEn={chart.day.branchEn}
                    tenGod={chart.day.tenGod}
                    element={chart.day.elementEn}
                  />
                  <BaziPillarCard
                    pillarName={t("bazi.chart.hourPillar")}
                    stem={chart.hour.stem}
                    stemEn={chart.hour.stemEn}
                    branch={chart.hour.branch}
                    branchEn={chart.hour.branchEn}
                    tenGod={chart.hour.tenGod}
                    element={chart.hour.elementEn}
                  />
                </div>
              </Stack>
            </PageSection>

            {/* Five Elements Balance */}
            <PageSection>
              <Stack gap="md">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconSectionHeader iconKey="five_elements_icon" title={t("bazi.chart.elementBalance")} />
                  <SectionInfoButton title={t("bazi.chart.elementBalance")} body={t("info.elementBalance.body")} />
                  <BaziTermTooltip
                    term={t("bazi.common.fiveElements")}
                    definition={t("bazi.glossary.fiveElements")}
                  />
                </div>

                <ElementBalanceChart elements={elementData} />
              </Stack>
            </PageSection>

            {/* Element Analysis */}
            <PageSection>
              <ElementAnalysisCard
                strongestElement={strongest.name}
                strongestScore={strongest.score}
                weakestElement={weakest.name}
                weakestScore={weakest.score}
              />
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
