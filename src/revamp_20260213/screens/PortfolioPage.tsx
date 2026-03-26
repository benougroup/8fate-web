/**
 * PortfolioPage.tsx — User portfolio / profile hub (revamp_20260213)
 *
 * Shows the user's real profile data from profileStore (not mock data).
 * The BaZi chart data (day master, etc.) still uses mock data until the
 * real API is connected.
 *
 * Layout:
 *  1. InnerTopBar (back to /daily, title "My Profile")
 *  2. Profile info card (real name + DOB from profileStore)
 *  3. Day Master summary (from mock bazi data)
 *  4. Quick actions grid (navigate to other features)
 */
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { t } from "../i18n/t";
import { getBaziProfile } from "../services/providers/baziProvider";
import type { BaziProfile } from "../services/mock/baziTypes";
import { getIconSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";

type QuickAction = {
  label: string;
  sublabel: string;
  iconKey: Parameters<typeof getIconSrc>[1];
  route: string;
};

export function PortfolioPage() {
  const navigate = useNavigate();
  const { theme } = usePreferences();
  const { profile: userProfile } = useProfile();
  const [baziProfile, setBaziProfile] = React.useState<BaziProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadBaziProfile() {
      try {
        const data = await getBaziProfile("profile-1");
        setBaziProfile(data);
      } catch (error) {
        console.error("Failed to load bazi profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    void loadBaziProfile();
  }, []);

  // Use real user name from profileStore, fall back to mock data name
  const displayName = userProfile.name || baziProfile?.name || t("home.user.guest");
  const displayDOB = userProfile.dateOfBirthISO || baziProfile?.birthDate || "—";
  const displayLocation = userProfile.placeOfBirth || baziProfile?.birthLocation || "";

  const quickActions: QuickAction[] = [
    { label: t("bazi.chart.title"),     sublabel: "Four Pillars",   iconKey: "daymaster",    route: "/bazi-chart" },
    { label: "Luck Pillars",            sublabel: "10-Year Cycles", iconKey: "lucktrend",    route: "/luck-pillars" },
    { label: "Annual Forecast",         sublabel: "2026 Reading",   iconKey: "year",         route: "/yearly" },
    { label: "Monthly",                 sublabel: "This Month",     iconKey: "monthly_flow", route: "/monthly" },
    { label: "Daily Fortune",           sublabel: "Today's Energy", iconKey: "daily_flow",   route: "/daily" },
    { label: "Auspicious Dates",        sublabel: "Best Days",      iconKey: "today",        route: "/auspicious-dates" },
    { label: "AI Chat",                 sublabel: "Ask a Question", iconKey: "mouth",        route: "/chat" },
  ];

  if (isLoading) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title="My Profile" backTo="/daily" />
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

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar title="My Bazi Profile" subtitle="Lifelong Destiny Analysis" backTo="/daily" />
        <PageContent className="revamp-innerPageContent">
          <Stack gap="lg">

            {/* ── Profile Info ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="portfolio.profile.title"
                  help={{
                    titleKey: "portfolio.profile.help.title",
                    bodyKey: "portfolio.profile.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <Card>
                <Stack gap="sm">
                  <Text style={{ fontWeight: 700, fontSize: "var(--fs-lg)", color: "var(--c-ink)" }}>
                    {displayName}
                  </Text>
                  <Text muted>
                    Born: {displayDOB}
                    {baziProfile?.birthTime ? ` at ${baziProfile.birthTime}` : ""}
                  </Text>
                  {displayLocation && (
                    <Text muted>Location: {displayLocation}</Text>
                  )}
                  {userProfile.livingCountry && (
                    <Text muted>Living: {userProfile.livingCountry}</Text>
                  )}
                </Stack>
              </Card>
            </PageSection>

            {/* ── Day Master Summary ── */}
            {baziProfile && (
              <PageSection
                title={
                  <SectionTitleRow
                    titleKey="bazi.common.dayMaster"
                    help={{
                      titleKey: "portfolio.dayMaster.help.title",
                      bodyKey: "portfolio.dayMaster.help.body",
                    }}
                  />
                }
                gap="sm"
              >
                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--s-4)" }}>
                    <img
                      src={getIconSrc(theme, "daymaster")}
                      alt="Day Master"
                      style={{ width: 40, height: 40, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-2)" }}>
                        <span
                          style={{
                            fontSize: "3rem",
                            fontWeight: 700,
                            color: "var(--c-accent)",
                            lineHeight: 1,
                          }}
                        >
                          {baziProfile.chart.dayMaster}
                        </span>
                        <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                          {baziProfile.chart.dayMasterEn} · {baziProfile.chart.dayMasterElement} ({baziProfile.chart.dayMasterElementEn})
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </PageSection>
            )}

            {/* ── Quick Actions ── */}
            <PageSection
              title={
                <SectionTitleRow
                  titleKey="portfolio.explore.title"
                  help={{
                    titleKey: "portfolio.explore.help.title",
                    bodyKey: "portfolio.explore.help.body",
                  }}
                />
              }
              gap="sm"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "var(--s-3)",
                }}
              >
                {quickActions.map((action) => (
                  <Card
                    key={action.route}
                    style={{ cursor: "pointer", textAlign: "center", padding: "var(--s-4)" }}
                    onClick={() => navigate(action.route)}
                  >
                    <Stack gap="xs" align="center">
                      <img
                        src={getIconSrc(theme, action.iconKey)}
                        alt={action.label}
                        style={{ width: 36, height: 36 }}
                      />
                      <Text style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--c-ink)" }}>
                        {action.label}
                      </Text>
                      <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                        {action.sublabel}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </div>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
