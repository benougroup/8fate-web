import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { PillButton, PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TopBar } from "../components/TopBar";
import { UserBadge } from "../components/UserBadge";
import { SkinToggleIcon } from "../components/SkinToggleIcon";
import { NotificationButton } from "../components/NotificationButton";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { CardFlip } from "../components/CardFlip";
import { DailyReadingCard } from "../components/DailyReadingCard";
import { ProtectionCard } from "../components/ProtectionCard";
import { LuckAvoidMeta } from "../components/LuckAvoidMeta";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { Card } from "../components/Card";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { t } from "../i18n/t";
import {
  setTheme,
  usePreferences,
  type ThemeMode,
} from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";
import { toUserErrorMessage } from "../services/api/errorMessage";
import { getMeApi } from "../services/providers/apiProfileProvider";
import { getDailyHomeData } from "../services/providers/homeDataProvider";
import { getDailyFortune } from "../services/providers/baziProvider";
import type { HomeData } from "../services/providers/types";
import type { HomeSlot } from "../contracts/v1/types";
import type {
  DailyReadingMeta,
  LuckPanelMeta,
} from "../contracts/v1/homeMeta";

export type HomeProps = {
  preview?: boolean;
  forcedTheme?: ThemeMode;
};

type HomeMetaData = HomeData & {
  dailyMeta?: DailyReadingMeta;
  protectionPhrase?: string;
  luckMeta?: LuckPanelMeta;
  avoidMeta?: LuckPanelMeta;
  upcomingText?: string;
};

const HOME_SECTION_SLOTS = [
  "today",
  "luck",
  "protection",
  "upcoming",
] as const satisfies HomeSlot[];
type HomeSectionSlot = (typeof HOME_SECTION_SLOTS)[number];

const SLOT_ICON: Record<HomeSectionSlot, IconKey> = {
  today: "today",
  luck: "luck",
  protection: "protection",
  upcoming: "upcoming",
};

const HOME_SECTION_HELP: Record<
  HomeSectionSlot,
  {
    variant: "question" | "exclamation";
    titleKey: string;
    bodyKey: string;
  }
> = {
  today: {
    variant: "question",
    titleKey: "home.help.today.title",
    bodyKey: "home.help.today.body",
  },
  luck: {
    variant: "question",
    titleKey: "home.help.luck.title",
    bodyKey: "home.help.luck.body",
  },
  protection: {
    variant: "exclamation",
    titleKey: "home.help.protection.title",
    bodyKey: "home.help.protection.body",
  },
  upcoming: {
    variant: "question",
    titleKey: "home.help.upcoming.title",
    bodyKey: "home.help.upcoming.body",
  },
};

const PREVIEW_HOME_DATA: HomeData = {
  dateISO: "2025-01-10",
  theme: "yang",
  sourceUpdatedAtISO: new Date().toISOString(),
  cards: [
    {
      id: "today-intent",
      slot: "today",
      title: { en: "Steady Momentum", zhHant: "安定步伐" },
      summary: "Move with intention and keep your pace gentle today.",
      action: "Choose one priority and complete it fully.",
      avoid: "Overbooking your afternoon.",
      luckStatus: "up",
    },
    {
      id: "luck-path",
      slot: "luck",
      title: { en: "Open Path", zhHant: "開路" },
      summary: "Small, decisive steps open the most helpful doors.",
      action: "Say yes to one high-impact opportunity.",
      avoid: "Waiting for perfect timing.",
    },
    {
      id: "avoid-noise",
      slot: "avoid",
      title: { en: "Quiet Boundaries", zhHant: "靜界" },
      summary: "Protect your energy from noisy demands.",
      action: "Decline one low-priority request.",
      avoid: "Letting distractions lead the day.",
    },
    {
      id: "protection-focus",
      slot: "protection",
      title: { en: "Focus Shield", zhHant: "專注護盾" },
      summary: "Keep a grounded ritual to maintain clarity.",
      action: "Take three deep breaths before each meeting.",
      avoid: "Jumping between tasks too quickly.",
    },
    {
      id: "upcoming-next",
      slot: "upcoming",
      title: { en: "Next Horizon", zhHant: "下個地平線" },
      summary: "A calm shift arrives later in the week.",
      action: "Plan one restorative activity.",
      avoid: "Skipping recovery time.",
    },
  ],
};

const PREVIEW_DAILY_META: DailyReadingMeta = {
  luckLevel: "good",
  quote: "Move gently and keep your focus steady.",
};

const PREVIEW_PROTECTION_PHRASE = "Focus Shield";
const PREVIEW_UPCOMING_TEXT = "A calm shift arrives later in the week.";

const PREVIEW_LUCK_META: LuckPanelMeta = {
  number: 88,
  colorHex: "#C9A44C",
  zodiac: "monkey",
  element: "water",
  direction: "east-north",
};

const PREVIEW_AVOID_META: LuckPanelMeta = {
  number: 22,
  colorHex: "#3F5D73",
  zodiac: "snake",
  element: "fire",
  direction: "west",
};

export function Home({ preview = false, forcedTheme }: HomeProps) {
  const { theme, locale } = usePreferences();
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<HomeMetaData | null>(null);
  const [dailyFortune, setDailyFortune] = React.useState<any>(null);
  const [reloadNonce, setReloadNonce] = React.useState(0);
  const hasSeededProfile = React.useRef(false);

  React.useEffect(() => {
    let isMounted = true;

    async function loadGuidance() {
      if (preview) {
        if (isMounted) {
          setData(PREVIEW_HOME_DATA);
          setError(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getDailyHomeData();

        if (isMounted) {
          setData(response);
          setError(null);
          
          // Load daily fortune data
          getDailyFortune().then((fortuneData) => {
            if (isMounted) {
              setDailyFortune(fortuneData);
            }
          }).catch((err) => {
            console.error("Failed to load daily fortune:", err);
          });
        }
      } catch (caught) {
        if (isMounted) {
          setData(null);
          setError(toUserErrorMessage(caught));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadGuidance();

    return () => {
      isMounted = false;
    };
  }, [preview, reloadNonce]);

  React.useEffect(() => {
    if (!forcedTheme) {
      return;
    }

    setTheme(forcedTheme);
  }, [forcedTheme]);

  const previewName = t("home.user.previewName");

  React.useEffect(() => {
    if (!preview || hasSeededProfile.current) {
      return;
    }

    if (!profile.name.trim()) {
      setProfile({ name: previewName });
    }

    hasSeededProfile.current = true;
  }, [preview, previewName, profile.name, setProfile]);

  const isPremium = profile.level === "advanced";
  const displayName = profile.name.trim() || t("home.user.guest");
  const premiumBadgeSrc = getIconSrc(theme, "premium");
  const dateSource = data?.dateISO ? new Date(data.dateISO) : new Date();
  const safeDate = Number.isNaN(dateSource.getTime()) ? new Date() : dateSource;
  const localeTag = locale === "zh-Hant" ? "zh-Hant-TW" : "en-US";
  const formattedDate = safeDate.toLocaleDateString(localeTag, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const dashboardLabel = preview
    ? t("home.cta.backToDashboard")
    : t("home.cta.returnToDashboard");
  const sectionConfigs = HOME_SECTION_SLOTS.map((slot) => ({
    key: slot,
    iconKey: slot === "luck" ? "avoid" : SLOT_ICON[slot],
    secondaryIconKey: slot === "luck" ? "luck" : undefined,
    labelKey: `home.sections.${slot}`,
    help: HOME_SECTION_HELP[slot],
  })) satisfies Array<{
    key: HomeSectionSlot;
    iconKey: IconKey;
    secondaryIconKey?: IconKey;
    labelKey: string;
    help: (typeof HOME_SECTION_HELP)[HomeSectionSlot];
  }>;
  const dailyMeta = preview
    ? PREVIEW_DAILY_META
    : data?.dailyMeta ?? PREVIEW_DAILY_META;
  const protectionPhrase = preview
    ? PREVIEW_PROTECTION_PHRASE
    : data?.protectionPhrase ?? PREVIEW_PROTECTION_PHRASE;
  const upcomingText = preview
    ? PREVIEW_UPCOMING_TEXT
    : data?.upcomingText ?? PREVIEW_UPCOMING_TEXT;
  const luckMeta = preview ? PREVIEW_LUCK_META : data?.luckMeta ?? PREVIEW_LUCK_META;
  const avoidMeta = preview ? PREVIEW_AVOID_META : data?.avoidMeta ?? PREVIEW_AVOID_META;
  const hasUnreadNotifications = false;

  React.useEffect(() => {
    if (preview) {
      return;
    }

    let isMounted = true;

    async function hydrateProfile() {
      try {
        const response = await getMeApi();
        const { profile: apiProfile } = response;
        if (!isMounted) {
          return;
        }
        // Only update fields that are not already set locally.
        // This prevents the mock API from overwriting data the user just registered.
        const updates: Partial<{
          name: string;
          dateOfBirthISO: string;
          placeOfBirth: string;
          livingCountry: string;
          level: string;
        }> = {};
        if (!profile.name.trim() && apiProfile.name) updates.name = apiProfile.name;
        if (!profile.dateOfBirthISO && apiProfile.dateOfBirthISO) updates.dateOfBirthISO = apiProfile.dateOfBirthISO;
        if (!profile.placeOfBirth && apiProfile.placeOfBirth) updates.placeOfBirth = apiProfile.placeOfBirth;
        if (!profile.livingCountry && apiProfile.livingCountry) updates.livingCountry = apiProfile.livingCountry;
        if (!profile.level && apiProfile.level) updates.level = apiProfile.level;
        if (Object.keys(updates).length > 0) {
          setProfile(updates);
        }
      } catch (caught) {
        console.warn("profile.hydration failed:", toUserErrorMessage(caught));
      }
    }

    hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, [preview, setProfile]);

  return (
    <Page>
      <PageCard>
        <TopBar
          left={
            <div className="revamp-topBarUser">
              <div className="revamp-userPill">
                <UserBadge name={displayName} />
                <span className="revamp-userName">{displayName}</span>
                {isPremium ? (
                  <img
                    className="revamp-premiumBadgeIcon"
                    src={premiumBadgeSrc}
                    alt={t("home.card.premiumBadge")}
                  />
                ) : null}
              </div>
            </div>
          }
          center={null}
          right={
            <>
              <NotificationButton hasUnread={hasUnreadNotifications} />
              <SkinToggleIcon />
            </>
          }
        />
        <PageContent className="revamp-homeContent">
          <Stack gap="md">
            <PageHeader title={t("home.header.title")} />
            <Text className="revamp-homeDate">
              {t("home.header.dateLabel", { date: formattedDate })}
            </Text>
            {sectionConfigs.map((section) => {
              const emptyCard = (
                <div className="revamp-sectionCard revamp-homeCard glass-card">
                  <Text>{t("home.content.emptySection")}</Text>
                </div>
              );
              const loadingCard = (
                <div className="revamp-sectionCard revamp-homeCard glass-card">
                  <Text>{t("common.loading")}</Text>
                </div>
              );
              const sectionLabel = t(section.labelKey);
              const errorCard = (
                <div className="revamp-sectionCard revamp-homeCard glass-card">
                  <Stack gap="sm" align="start">
                    <Text>
                      {t("common.unableToLoad", {
                        resource: sectionLabel,
                        detail: error ?? t("common.errorUnknownDetail"),
                      })}
                    </Text>
                    <PillButton onClick={() => setReloadNonce((nonce) => nonce + 1)}>
                      {t("common.retry")}
                    </PillButton>
                  </Stack>
                </div>
              );
              const standardCard = (content: React.ReactNode) => (
                <div className="revamp-sectionCard revamp-homeCard glass-card">
                  {content}
                </div>
              );
              const flipFront = (
                <div className="revamp-cardFlipPanel glass-card">
                  <LuckAvoidMeta meta={luckMeta} variant="luck" />
                </div>
              );
              const flipBack = (
                <div className="revamp-cardFlipPanel glass-card">
                  <LuckAvoidMeta meta={avoidMeta} variant="avoid" />
                </div>
              );
              const sectionBody = loading
                ? loadingCard
                : error
                ? errorCard
                : section.key === "luck"
                ? (
                    <CardFlip
                      className="revamp-homeCard"
                      front={flipFront}
                      back={flipBack}
                      ariaLabel={t("home.card.flipLabel", {
                        section: sectionLabel,
                      })}
                    />
                  )
                : section.key === "today"
                ? standardCard(<DailyReadingCard meta={dailyMeta} />)
                : section.key === "protection"
                ? standardCard(<ProtectionCard phrase={protectionPhrase} />)
                : section.key === "upcoming"
                ? standardCard(<Text>{upcomingText}</Text>)
                : emptyCard;

              return (
                <PageSection
                  key={section.key}
                  title={
                    <SectionTitleRow
                      iconKey={section.iconKey}
                      secondaryIconKey={section.secondaryIconKey}
                      titleKey={section.labelKey}
                      help={section.help}
                    />
                  }
                  gap="sm"
                >
                  {sectionBody}
                </PageSection>
              );
            })}

            {/* Bazi Daily Fortune Section */}
            {dailyFortune && dailyFortune.energyScore !== undefined && (
              <>
                {/* Energy Score Badge */}
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
                    margin: "var(--space-lg) auto 0",
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
                    {dailyFortune.energyScore.toFixed(1)}/10
                  </Text>
                </div>

                {/* Today's Pillar */}
                <PageSection
                  title={t("bazi.daily.todayPillar")}
                  gap="sm"
                >
                  <BaziPillarCard
                    pillarName={t("bazi.chart.dayPillar")}
                    stem={dailyFortune.dayPillar.stem}
                    stemEn={dailyFortune.dayPillar.stemEn}
                    branch={dailyFortune.dayPillar.branch}
                    branchEn={dailyFortune.dayPillar.branchEn}
                    element={dailyFortune.dayPillar.element}
                    tenGod={dailyFortune.dayPillar.tenGod}
                  />
                </PageSection>

                {/* Summary & Advice */}
                <PageSection
                  title={t("bazi.daily.summary")}
                  gap="sm"
                >
                  <Card>
                    <Stack gap="md">
                      <Text style={{ fontWeight: 600 }}>
                        {dailyFortune.summary}
                      </Text>
                      <Text muted>{dailyFortune.advice}</Text>
                    </Stack>
                  </Card>
                </PageSection>

                {/* Lucky Activity */}
                <PageSection
                  title={t("bazi.daily.luckyActivity")}
                  gap="sm"
                >
                  <Card>
                    <Text>{dailyFortune.luckyActivity}</Text>
                  </Card>
                </PageSection>

                {/* Lucky Colors */}
                <PageSection
                  title={t("bazi.daily.luckyColors")}
                  gap="sm"
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-md)",
                      flexWrap: "wrap",
                    }}
                  >
                    {dailyFortune.luckyColors?.map((color: string) => (
                      <div
                        key={color}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-sm)",
                          padding: "var(--space-sm) var(--space-md)",
                          background: "var(--c-card)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: color,
                            border: "2px solid var(--c-border)",
                          }}
                        />
                        <Text>{color}</Text>
                      </div>
                    ))}
                  </div>
                </PageSection>

                {/* Do's and Don'ts */}
                <PageSection
                  title={t("bazi.daily.dosAndDonts")}
                  gap="sm"
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "var(--space-md)",
                    }}
                  >
                    {/* Do's */}
                    <Card>
                      <Stack gap="sm">
                        <Text
                          style={{
                            fontWeight: 600,
                            color: "var(--c-success)",
                          }}
                        >
                          {t("bazi.daily.doList")}
                        </Text>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "var(--space-md)",
                          }}
                        >
                          {dailyFortune.doList?.map((item: string, i: number) => (
                            <li key={i}>
                              <Text style={{ fontSize: "var(--fs-sm)" }}>
                                {item}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </Stack>
                    </Card>

                    {/* Don'ts */}
                    <Card>
                      <Stack gap="sm">
                        <Text
                          style={{
                            fontWeight: 600,
                            color: "var(--c-error)",
                          }}
                        >
                          {t("bazi.daily.dontList")}
                        </Text>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "var(--space-md)",
                          }}
                        >
                          {dailyFortune.dontList?.map((item: string, i: number) => (
                            <li key={i}>
                              <Text style={{ fontSize: "var(--fs-sm)" }}>
                                {item}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </Stack>
                    </Card>
                  </div>
                </PageSection>

                {/* Recommendations */}
                <PageSection
                  title={t("bazi.daily.recommendations")}
                  gap="sm"
                >
                  <Card>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "var(--space-md)",
                      }}
                    >
                      {dailyFortune.recommendations?.map(
                        (item: string, i: number) => (
                          <li key={i}>
                            <Text>{item}</Text>
                          </li>
                        )
                      )}
                    </ul>
                  </Card>
                </PageSection>
              </>
            )}

            <PillLink to="/dashboard">{dashboardLabel}</PillLink>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
