import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { DayMasterCard } from "../components/DayMasterCard";
import { SectionInfoButton } from "../components/SectionInfoButton";
import { t } from "../i18n/t";
import { getDailyFortune } from "../services/providers/baziProvider";
import { useProfile } from "../stores/profileStore";
import { usePreferences } from "../stores/preferencesStore";
import {
  getIconSrc,
  getElementSrc,
  getDirectionSrc,
  type DirectionKey,
  type ElementKey,
} from "../assets/assetMap";

// Map activity string to icon key
const ACTIVITY_ICON_MAP: Record<string, string> = {
  "stay home": "activity_stayhome",
  "stay at home": "activity_stayhome",
  "go out": "activity_out",
  "outdoor": "activity_outside",
  "outing": "activity_outing",
  "move": "activity_move",
  "travel": "activity_outing",
  "indoor": "activity_inside",
  "inside": "activity_inside",
  "exercise": "activity_outside",
  "meditation": "activity_inside",
};

function getActivityIconKey(activity: string): string {
  const lower = activity.toLowerCase();
  for (const [key, icon] of Object.entries(ACTIVITY_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return "activity_outside";
}

// Map direction string to DirectionKey
const DIRECTION_KEY_MAP: Record<string, DirectionKey> = {
  north: "north",
  south: "south",
  east: "east",
  west: "west",
  northeast: "north",
  northwest: "north",
  southeast: "south",
  southwest: "south",
};

function getDirectionKey(direction: string): DirectionKey | null {
  const lower = direction.toLowerCase();
  for (const [key, dir] of Object.entries(DIRECTION_KEY_MAP)) {
    if (lower.includes(key)) return dir;
  }
  return null;
}

// Map element string to ElementKey
const ELEMENT_KEY_MAP: Record<string, ElementKey> = {
  water: "water",
  wood: "wood",
  fire: "fire",
  earth: "earth",
  metal: "metal",
  gold: "metal",
};

function getElementKey(element: string): ElementKey | null {
  return ELEMENT_KEY_MAP[element.toLowerCase()] ?? null;
}

export function DailyFortune() {
  const { profile } = useProfile();
  const { theme } = usePreferences();
  const [fortune, setFortune] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  React.useEffect(() => {
    getDailyFortune().then((data) => {
      setFortune(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title={t("bazi.daily.title")} />
          <PageContent className="revamp-innerPageContent">
            <Stack gap="lg" align="center">
              <Text>Loading daily fortune...</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  if (!fortune) return null;

  const activityIconKey = getActivityIconKey(fortune.luckyActivity ?? "");

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar title={t("bazi.daily.title")} subtitle={today} />
        <PageContent className="revamp-innerPageContent">
          <Stack gap="lg">
            {/* Energy Score */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-sm)",
                  padding: "var(--space-sm) var(--space-md)",
                  background: "var(--c-accent-subtle)",
                  borderRadius: "var(--radius-full)",
                  width: "fit-content",
                  margin: "var(--space-md) auto 0",
                }}
              >
                <Text style={{ fontSize: "var(--fs-sm)", fontWeight: 600 }}>
                  {t("bazi.daily.energyScore")}:
                </Text>
                <Text
                  style={{
                    fontSize: "var(--fs-lg)",
                    fontWeight: 700,
                    color: "var(--c-accent)",
                  }}
                >
                  {fortune.energyScore.toFixed(1)}/10
                </Text>
              </div>
            </div>

            {/* Day Master */}
            {profile && (
              <PageSection>
                <Stack gap="sm">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <img
                      src={getIconSrc(theme, "daymaster")}
                      alt=""
                      style={{ width: 22, height: 22 }}
                    />
                    <Text style={{ fontWeight: 600 }}>{t("bazi.chart.dayMaster")}</Text>
                    <SectionInfoButton
                      title={t("bazi.chart.dayMaster")}
                      body={t("info.dayMaster.body")}
                    />
                  </div>
                  <div style={{ maxWidth: "200px" }}>
                    <DayMasterCard
                      dayMaster="甲"
                      dayMasterEn="Jia"
                      element="木"
                      elementEn="Wood"
                    />
                  </div>
                </Stack>
              </PageSection>
            )}

            {/* Today's Pillar & Summary */}
            <PageSection>
              <Stack gap="sm">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <img
                    src={getIconSrc(theme, "daily_flow")}
                    alt=""
                    style={{ width: 22, height: 22 }}
                  />
                  <Text style={{ fontWeight: 600 }}>{t("bazi.daily.todayPillar")}</Text>
                  <SectionInfoButton
                    title={t("bazi.daily.todayPillar")}
                    body={t("info.dailyPillar.body")}
                  />
                </div>
              </Stack>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "var(--space-md)",
                  alignItems: "start",
                }}
              >
                {/* Pillar */}
                <Stack gap="sm" align="center">
                  <div style={{ maxWidth: "180px" }}>
                    <BaziPillarCard
                      pillarName="Today"
                      stem={fortune.dayPillar.stem}
                      stemEn={fortune.dayPillar.stemEn}
                      branch={fortune.dayPillar.branch}
                      branchEn={fortune.dayPillar.branchEn}
                      tenGod={fortune.dayPillar.tenGod}
                      element={fortune.dayPillar.elementEn}
                    />
                  </div>
                </Stack>

                {/* Summary & Advice */}
                <Card>
                  <Stack gap="md">
                    <div>
                      <Text
                        style={{
                          fontSize: "var(--fs-lg)",
                          fontWeight: 700,
                          color: "var(--c-accent)",
                          marginBottom: "var(--space-xs)",
                        }}
                      >
                        {fortune.summary}
                      </Text>
                      <Text muted style={{ lineHeight: 1.6 }}>
                        {fortune.fortune}
                      </Text>
                    </div>
                    <div
                      style={{
                        padding: "var(--space-sm)",
                        background: "var(--c-accent-subtle)",
                        borderLeft: "3px solid var(--c-accent)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <Text style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>
                        {fortune.advice}
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </div>
            </PageSection>

            {/* Lucky Activity & Color */}
            <PageSection>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "var(--space-md)",
                }}
              >
                {/* Lucky Activity with icon */}
                <Card>
                  <Stack gap="xs">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Text
                        style={{
                          fontSize: "var(--fs-xs)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--c-text-muted)",
                        }}
                      >
                        {t("bazi.daily.luckyActivity")}
                      </Text>
                      <SectionInfoButton
                        title={t("bazi.daily.luckyActivity")}
                        body={t("info.luckyActivity.body")}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img
                        src={getIconSrc(theme, activityIconKey as any)}
                        alt={fortune.luckyActivity}
                        style={{ width: 36, height: 36, objectFit: "contain" }}
                      />
                      <Text style={{ fontWeight: 600 }}>
                        {fortune.luckyActivity}
                      </Text>
                    </div>
                  </Stack>
                </Card>

                {/* Lucky Colors */}
                <Card>
                  <Stack gap="xs">
                    <Text
                      style={{
                        fontSize: "var(--fs-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--c-text-muted)",
                      }}
                    >
                      {t("bazi.daily.luckyColors")}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-xs)",
                        flexWrap: "wrap",
                      }}
                    >
                      {fortune.luckyColors.map((color: string) => (
                        <span
                          key={color}
                          style={{
                            padding: "var(--space-xs) var(--space-sm)",
                            background: "var(--c-accent-subtle)",
                            color: "var(--c-accent)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--fs-sm)",
                            fontWeight: 600,
                          }}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </Stack>
                </Card>
              </div>
            </PageSection>

            {/* Lucky Elements & Directions */}
            <PageSection>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "var(--space-md)",
                }}
              >
                {/* Lucky Elements with element icons */}
                <Card>
                  <Stack gap="xs">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <img
                        src={getIconSrc(theme, "five_elements_icon")}
                        alt=""
                        style={{ width: 18, height: 18 }}
                      />
                      <Text className="revamp-sectionTitle">
                        {t("bazi.daily.luckyElements")}
                      </Text>
                      <SectionInfoButton
                        title={t("bazi.daily.luckyElements")}
                        body={t("info.luckyElements.body")}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-xs)",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {fortune.luckyElements.map((element: string) => {
                        const elKey = getElementKey(element);
                        return (
                          <div
                            key={element}
                            style={{ display: "flex", alignItems: "center", gap: 4 }}
                          >
                            {elKey && (
                              <img
                                src={getElementSrc(theme, elKey, "mono")}
                                alt={element}
                                style={{ width: 22, height: 22, objectFit: "contain" }}
                              />
                            )}
                            <span
                              style={{
                                padding: "2px 8px",
                                background: "var(--c-accent-subtle)",
                                color: "var(--c-accent)",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "var(--fs-sm)",
                                fontWeight: 600,
                              }}
                            >
                              {element}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </Stack>
                </Card>

                {/* Favorable Directions with direction icons */}
                <Card>
                  <Stack gap="xs">
                    <Text className="revamp-sectionTitle">
                      {t("bazi.daily.favorableDirections")}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-xs)",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {fortune.favorableDirections.map((direction: string) => {
                        const dirKey = getDirectionKey(direction);
                        return (
                          <div
                            key={direction}
                            style={{ display: "flex", alignItems: "center", gap: 4 }}
                          >
                            {dirKey && (
                              <img
                                src={getDirectionSrc(theme, dirKey)}
                                alt={direction}
                                style={{ width: 22, height: 22, objectFit: "contain" }}
                              />
                            )}
                            <span
                              style={{
                                padding: "2px 8px",
                                background: "var(--c-card-bg)",
                                border: "1px solid var(--c-border)",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "var(--fs-sm)",
                              }}
                            >
                              {direction}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </Stack>
                </Card>
              </div>
            </PageSection>

            {/* Do's and Don'ts */}
            <PageSection>
              <Stack gap="sm">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <img
                    src={getIconSrc(theme, "daily_flow")}
                    alt=""
                    style={{ width: 22, height: 22 }}
                  />
                  <Text style={{ fontWeight: 600 }}>{t("bazi.daily.dosAndDonts")}</Text>
                  <SectionInfoButton
                    title={t("bazi.daily.dosAndDonts")}
                    body={t("info.dosAndDonts.body")}
                  />
                </div>
              </Stack>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "var(--space-md)",
                }}
              >
                {/* Do List */}
                <Card>
                  <Stack gap="sm">
                    <Text
                      className="revamp-sectionTitle"
                      style={{ color: "var(--c-success)" }}
                    >
                      ✓ {t("bazi.daily.doList")}
                    </Text>
                    <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                      {fortune.doList.map((item: string, index: number) => (
                        <li key={index}>
                          <Text muted>{item}</Text>
                        </li>
                      ))}
                    </ul>
                  </Stack>
                </Card>

                {/* Don't List */}
                <Card>
                  <Stack gap="sm">
                    <Text
                      className="revamp-sectionTitle"
                      style={{ color: "var(--c-error)" }}
                    >
                      ✗ {t("bazi.daily.dontList")}
                    </Text>
                    <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                      {fortune.dontList.map((item: string, index: number) => (
                        <li key={index}>
                          <Text muted>{item}</Text>
                        </li>
                      ))}
                    </ul>
                  </Stack>
                </Card>
              </div>
            </PageSection>

            {/* Recommendations */}
            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text className="revamp-sectionTitle">
                    {t("bazi.daily.recommendations")}
                  </Text>
                  <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                    {fortune.recommendations.map((item: string, index: number) => (
                      <li key={index}>
                        <Text muted>{item}</Text>
                      </li>
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
}
