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
import { ElementBalanceChart } from "../components/ElementBalanceChart";
import { t } from "../i18n/t";
import { getCompatibility } from "../services/providers/baziProvider";
import type { CompatibilityResult } from "../services/mock/baziTypes";

export function Compatibility() {
  const [compatibility, setCompatibility] = React.useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCompatibility() {
      try {
        // For now, use hardcoded profile IDs
        // Later this will come from profile selection
        const data = await getCompatibility("profile-1", "profile-2");
        setCompatibility(data);
      } catch (error) {
        console.error("Failed to load compatibility:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadCompatibility();
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

  if (!compatibility) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <Stack gap="md" align="center">
              <Text>No compatibility data found</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  // Prepare element harmony data for chart
  const elementColors: Record<string, string> = {
    Wood: "#10b981",
    Fire: "#ef4444",
    Earth: "#f59e0b",
    Metal: "#94a3b8",
    Water: "#3b82f6",
  };

  const harmonyData = [
    {
      name: t("bazi.elements.wood"),
      nameChinese: "木",
      score: compatibility.elementHarmony.wood * 6, // Scale to 0-6 for chart
      color: elementColors.Wood,
    },
    {
      name: t("bazi.elements.fire"),
      nameChinese: "火",
      score: compatibility.elementHarmony.fire * 6,
      color: elementColors.Fire,
    },
    {
      name: t("bazi.elements.earth"),
      nameChinese: "土",
      score: compatibility.elementHarmony.earth * 6,
      color: elementColors.Earth,
    },
    {
      name: t("bazi.elements.metal"),
      nameChinese: "金",
      score: compatibility.elementHarmony.metal * 6,
      color: elementColors.Metal,
    },
    {
      name: t("bazi.elements.water"),
      nameChinese: "水",
      score: compatibility.elementHarmony.water * 6,
      color: elementColors.Water,
    },
  ];

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="xl">
            {/* Header */}
            <PageHeader
              title={t("bazi.compatibility.title")}
              subtitle={t("bazi.compatibility.subtitle")}
              icon="relationship"
            />

            {/* Profile Names */}
            <PageSection>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: "var(--space-md)",
                }}
              >
                <Card style={{ flex: 1, textAlign: "center" }}>
                  <Text className="revamp-sectionTitle">{compatibility.profileA}</Text>
                </Card>
                <Text style={{ fontSize: "var(--fs-xl)" }}>💕</Text>
                <Card style={{ flex: 1, textAlign: "center" }}>
                  <Text className="revamp-sectionTitle">{compatibility.profileB}</Text>
                </Card>
              </div>
            </PageSection>

            {/* Compatibility Score */}
            <PageSection>
              <Card style={{ textAlign: "center" }}>
                <Stack gap="sm" align="center">
                  <Text className="revamp-sectionTitle">
                    {t("bazi.compatibility.score")}
                  </Text>
                  <div
                    style={{
                      fontSize: "4rem",
                      fontWeight: 700,
                      color: "var(--c-accent)",
                      lineHeight: 1,
                    }}
                  >
                    {compatibility.score}
                  </div>
                  <Text muted>out of 100</Text>
                </Stack>
              </Card>
            </PageSection>

            {/* Element Harmony */}
            <PageSection>
              <Stack gap="md">
                <Text className="revamp-sectionTitle">
                  {t("bazi.compatibility.elementHarmony")}
                </Text>
                <ElementBalanceChart elements={harmonyData} />
              </Stack>
            </PageSection>

            {/* Strengths */}
            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text
                    className="revamp-sectionTitle"
                    style={{ color: "var(--c-success)" }}
                  >
                    ✓ {t("bazi.compatibility.strengths")}
                  </Text>
                  <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                    {compatibility.strengths.map((item, index) => (
                      <li key={index}>
                        <Text muted>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Card>
            </PageSection>

            {/* Challenges */}
            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text
                    className="revamp-sectionTitle"
                    style={{ color: "var(--c-warning)" }}
                  >
                    ⚠ {t("bazi.compatibility.challenges")}
                  </Text>
                  <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                    {compatibility.challenges.map((item, index) => (
                      <li key={index}>
                        <Text muted>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Card>
            </PageSection>

            {/* Recommendations */}
            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text className="revamp-sectionTitle">
                    {t("bazi.compatibility.recommendations")}
                  </Text>
                  <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
                    {compatibility.recommendations.map((item, index) => (
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
