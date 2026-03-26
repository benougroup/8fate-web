import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { InnerTopBar } from "../components/InnerTopBar";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { PageSection } from "../components/PageSection";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { ElementBalanceChart } from "../components/ElementBalanceChart";
import { DayMasterCard } from "../components/DayMasterCard";
import { ElementAnalysisCard } from "../components/ElementAnalysisCard";
import { BaziTermTooltip } from "../components/BaziTermTooltip";

import { usePreferences } from "../stores/preferencesStore";

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
        <InnerTopBar title={t("bazi.chart.title")} subtitle={t("bazi.chart.subtitle")} backTo={-1} />
        <PageContent>
          <Stack gap="lg">
            {/* Day Master Display */}
            <PageSection>
              <SectionTitleRow titleKey="bazi.chart.dayMaster" iconKey="daymaster" help={{ titleKey: "bazi.chart.dayMaster", bodyKey: "info.dayMaster.body" }} />
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
              <SectionTitleRow titleKey="bazi.chart.fourPillars" iconKey="heavenly_stem" help={{ titleKey: "bazi.chart.fourPillars", bodyKey: "info.fourPillars.body" }} />
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
            </PageSection>

            {/* Five Elements Balance */}
            <PageSection>
              <SectionTitleRow titleKey="bazi.chart.elementBalance" iconKey="five_elements_icon" help={{ titleKey: "bazi.chart.elementBalance", bodyKey: "info.elementBalance.body" }} />
              <ElementBalanceChart elements={elementData} />
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
