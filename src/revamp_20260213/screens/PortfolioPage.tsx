import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { t } from "../i18n/t";
import { getBaziProfile } from "../services/providers/baziProvider";
import type { BaziProfile } from "../services/mock/baziTypes";
import { getIconSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

type QuickAction = {
  label: string;
  sublabel: string;
  iconKey: Parameters<typeof getIconSrc>[1];
  route: string;
};

export function PortfolioPage() {
  const navigate = useNavigate();
  const { theme } = usePreferences();
  const [profile, setProfile] = React.useState<BaziProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getBaziProfile("profile-1");
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

  const quickActions: QuickAction[] = [
    { label: "Bazi Chart",      sublabel: "Four Pillars",      iconKey: "daymaster",     route: "/bazi-chart" },
    { label: "Luck Pillars",    sublabel: "10-Year Cycles",    iconKey: "lucktrend",     route: "/luck-pillars" },
    { label: "Annual Forecast", sublabel: "2026 Reading",      iconKey: "year",          route: "/yearly" },
    { label: "Monthly",         sublabel: "This Month",        iconKey: "monthly_flow",  route: "/monthly" },
    { label: "Daily Fortune",   sublabel: "Today's Energy",    iconKey: "daily_flow",    route: "/daily-fortune" },
    { label: "Compatibility",   sublabel: "Relationship",      iconKey: "me",            route: "/compatibility" },
    { label: "Auspicious Dates",sublabel: "Best Days",         iconKey: "today",         route: "/auspicious-dates" },
    { label: "AI Chat",         sublabel: "Ask a Question",    iconKey: "mouth",         route: "/chat" },
  ];

  if (isLoading) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title="Portfolio" />
          <PageContent className="revamp-innerPageContent">
            <Stack gap="md" align="center">
              <Text>{t("common.loading")}</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  if (!profile) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title="Portfolio" />
          <PageContent className="revamp-innerPageContent">
            <Stack gap="md" align="center">
              <Text>No profile found</Text>
              <PillLink to="/daily">{t("placeholder.cta.backToHome")}</PillLink>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar title="My Bazi Profile" subtitle="Lifelong Destiny Analysis" />
        <PageContent className="revamp-innerPageContent">
          <Stack gap="lg">

            {/* Profile Info */}
            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text className="revamp-sectionTitle">{profile.name}</Text>
                  <Text muted>
                    Born: {profile.birthDate} at {profile.birthTime}
                  </Text>
                  {profile.birthLocation && (
                    <Text muted>Location: {profile.birthLocation}</Text>
                  )}
                </Stack>
              </Card>
            </PageSection>

            {/* Day Master Summary */}
            <PageSection>
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <img
                    src={getIconSrc(theme, "daymaster")}
                    alt="Day Master"
                    style={{ width: 40, height: 40, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text className="revamp-sectionTitle">Your Day Master</Text>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)", marginTop: 4 }}>
                      <span
                        style={{
                          fontSize: "3rem",
                          fontWeight: 700,
                          color: "var(--c-accent)",
                          lineHeight: 1,
                        }}
                      >
                        {profile.chart.dayMaster}
                      </span>
                      <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                        {profile.chart.dayMasterEn} · {profile.chart.dayMasterElement} ({profile.chart.dayMasterElementEn})
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </PageSection>

            {/* Quick Actions */}
            <PageSection>
              <Stack gap="md">
                <Text className="revamp-sectionTitle">Explore Your Destiny</Text>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "var(--space-md)",
                  }}
                >
                  {quickActions.map((action) => (
                    <Card
                      key={action.route}
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={() => navigate(action.route)}
                    >
                      <Stack gap="xs" align="center">
                        <img
                          src={getIconSrc(theme, action.iconKey)}
                          alt={action.label}
                          style={{ width: 36, height: 36 }}
                        />
                        <Text className="revamp-sectionTitle" style={{ fontSize: "var(--fs-sm)" }}>
                          {action.label}
                        </Text>
                        <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                          {action.sublabel}
                        </Text>
                      </Stack>
                    </Card>
                  ))}
                </div>
              </Stack>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
