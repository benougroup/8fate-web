/**
 * MonthlyNew.tsx — Monthly Fortune screen (revamp_20260213)
 *
 * Layout order:
 *  1. InnerTopBar (back button, title, subtitle)
 *  2. Monthly Overview (italic summary)
 *  3. Luck & Avoid flip card (SectionTitleRow header)
 *  4. Fortune Hints grid (lucky color, number, active/weak element)
 *  5. Life Domains grid (6 flip cards: work, wealth, relationship, health, study, talent)
 *  6. Day Master × Month interaction
 *  7. Protection section
 *
 * Section headers: all use SectionTitleRow with titleKey + help popup
 * CardFlip: uses front/back props (not frontContent/backContent)
 */
import React, { useEffect } from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { CardFlip } from "../components/CardFlip";
import { LifeDomainCard } from "../components/LifeDomainCard";
import { Grid } from "../components/Grid";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { BaziPillarCard } from "../components/BaziPillarCard";
import type { MonthlyFortune } from "../services/mock/baziTypes";
import { MOCK_MONTHLY_FORTUNE } from "../services/mock/baziDataExtended";
import { t } from "../i18n/t";

export const MonthlyNew: React.FC = () => {
  const [monthlyData, setMonthlyData] = React.useState<MonthlyFortune | null>(null);

  useEffect(() => {
    // Simulate loading monthly data
    const timer = setTimeout(() => {
      setMonthlyData(MOCK_MONTHLY_FORTUNE);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!monthlyData) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title={t("monthly.overview.title")} backTo="/portfolio" />
          <PageContent className="revamp-innerPageContent">
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Text>{t("common.loading")}</Text>
            </div>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  // ── Luck & Avoid flip card content ────────────────────────────────────────
  const luckFront = (
    <div className="revamp-monthlyFlipFace">
      <div className="revamp-monthlyFlipEmoji">✅</div>
      <h3 className="revamp-monthlyFlipTitle">{t("monthly.luck.title")}</h3>
      <ul className="revamp-monthlyFlipList">
        {monthlyData.luck.map((item, idx) => (
          <li key={idx} className="revamp-monthlyFlipItem">• {item}</li>
        ))}
      </ul>
      <p className="revamp-cardFlipHint">{t("common.tapToFlip")}</p>
    </div>
  );

  const luckBack = (
    <div className="revamp-monthlyFlipFace">
      <div className="revamp-monthlyFlipEmoji">⚠️</div>
      <h3 className="revamp-monthlyFlipTitle">{t("monthly.avoid.title")}</h3>
      <ul className="revamp-monthlyFlipList">
        {monthlyData.avoid.map((item, idx) => (
          <li key={idx} className="revamp-monthlyFlipItem">• {item}</li>
        ))}
      </ul>
      <p className="revamp-cardFlipHint">{t("common.tapToFlip")}</p>
    </div>
  );

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar
          title={monthlyData.month}
          subtitle={`流月（${monthlyData.chineseMonth}）`}
          backTo="/portfolio"
          iconLabel="monthly"
        />
        <PageContent className="revamp-innerPageContent">
          <Stack gap="lg">
            {/* ── Month Pillar ── */}
            <BaziPillarCard
              pillarName={t("bazi.chart.monthPillar")}
              stem={monthlyData.monthPillar.stem}
              stemEn={monthlyData.monthPillar.stemEn}
              branch={monthlyData.monthPillar.branch}
              branchEn={monthlyData.monthPillar.branchEn}
              element={monthlyData.monthPillar.element}
              tenGod={monthlyData.monthPillar.tenGod}
            />

            {/* ── Monthly Overview ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="monthly.overview.title"
                  help={{
                    titleKey: "monthly.overview.help.title",
                    bodyKey: "monthly.overview.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <Card>
                <Text muted style={{ fontStyle: "italic", lineHeight: 1.7 }}>
                  {monthlyData.overview}
                </Text>
              </Card>
            </PageSection>

            {/* ── Luck & Avoid flip card ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="monthly.luckAvoid.title"
                  help={{
                    titleKey: "monthly.luckAvoid.help.title",
                    bodyKey: "monthly.luckAvoid.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <CardFlip
                front={luckFront}
                back={luckBack}
                ariaLabel={t("monthly.luckAvoid.title")}
                className="revamp-monthlyLuckFlip"
              />
            </PageSection>

            {/* ── Fortune Hints ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="monthly.fortune.title"
                  help={{
                    titleKey: "monthly.fortune.help.title",
                    bodyKey: "monthly.fortune.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <Grid columns={2} gap="sm">
                {/* Lucky Color */}
                <div className="revamp-fortuneHintCell">
                  <div className="revamp-fortuneHintLabel">{t("monthly.fortune.luckyColor")}</div>
                  <div className="revamp-fortuneHintColorRow">
                    <div
                      className="revamp-fortuneHintColorSwatch"
                      style={{ background: monthlyData.luckyColor }}
                    />
                    <span className="revamp-fortuneHintValue">{monthlyData.luckyColor}</span>
                  </div>
                </div>
                {/* Lucky Number */}
                <div className="revamp-fortuneHintCell">
                  <div className="revamp-fortuneHintLabel">{t("monthly.fortune.luckyNumber")}</div>
                  <div className="revamp-fortuneHintNumber">{monthlyData.luckyNumber}</div>
                </div>
                {/* Active Element */}
                <div className="revamp-fortuneHintCell">
                  <div className="revamp-fortuneHintLabel">{t("monthly.fortune.activeElement")}</div>
                  <Badge variant="success">{monthlyData.activeElement}</Badge>
                </div>
                {/* Weak Element */}
                <div className="revamp-fortuneHintCell">
                  <div className="revamp-fortuneHintLabel">{t("monthly.fortune.weakElement")}</div>
                  <Badge variant="warning">{monthlyData.weakElement}</Badge>
                </div>
              </Grid>
            </PageSection>

            {/* ── Life Domains ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="monthly.domains.title"
                  help={{
                    titleKey: "monthly.domains.help.title",
                    bodyKey: "monthly.domains.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <Grid columns={2} gap="md">
                {monthlyData.lifeDomains.map((domain, idx) => (
                  <LifeDomainCard key={idx} domain={domain} />
                ))}
              </Grid>
            </PageSection>

            {/* ── Day Master × Month Interaction ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="monthly.interaction.title"
                  help={{
                    titleKey: "monthly.interaction.help.title",
                    bodyKey: "monthly.interaction.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <Card>
                <Text style={{ lineHeight: 1.6 }}>{monthlyData.dayMasterInteraction}</Text>
              </Card>
            </PageSection>

            {/* ── Protection ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="monthly.protection.title"
                  help={{
                    titleKey: "monthly.protection.help.title",
                    bodyKey: "monthly.protection.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <Card style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))" }}>
                <Stack gap="sm">
                  <Text style={{ fontWeight: 700, color: "var(--c-accent)", textAlign: "center" }}>
                    {monthlyData.protectionFocus}
                  </Text>
                  <ul className="revamp-monthlyFlipList">
                    {monthlyData.protectionSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="revamp-monthlyFlipItem">• {suggestion}</li>
                    ))}
                  </ul>
                </Stack>
              </Card>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
};
