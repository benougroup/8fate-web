/**
 * Home.tsx — Daily Fortune home screen (revamp_20260213)
 *
 * Layout order:
 *  1. TopBar (user pill, notification, theme toggle)
 *  2. Date header
 *  3. Today's Phase row: [Energy Score badge] + [Day Pillar card] side-by-side
 *  4. Section cards: Today | Luck & Avoid (flip) | Protection | Upcoming
 *  5. Daily Fortune detail (from baziProvider):
 *     - Summary & Advice
 *     - Lucky Activity
 *     - Lucky Colors (no duplicate)
 *     - Do / Don't flip cards (Don't blurred for non-premium)
 *     - Recommendations
 *
 * Flip card rules:
 *  - Luck section: front = Lucky, back = Unlucky (avoid). Tap hint shown.
 *  - Do/Don't: front = Do (Lucky), back = Don't (Unlucky). Don't is blurred for free users.
 *
 * Section headers:
 *  - All use SectionTitleRow with zhNameKey + titleKey + ? help popup.
 *  - All help icons are "?" (question_mark).
 *
 * Mock data:
 *  - Only persisted in dev mode (ENV.isDev). See preferencesStore.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { PillButton } from "../components/PillButton";
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

/**
 * Section help popups — all use "?" icon.
 * Chinese names shown before English titles via zhNameKey.
 */
const HOME_SECTION_HELP: Record<
  HomeSectionSlot,
  {
    variant?: "question" | "exclamation";
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
    variant: "question",
    titleKey: "home.help.protection.title",
    bodyKey: "home.help.protection.body",
  },
  upcoming: {
    variant: "question",
    titleKey: "home.help.upcoming.title",
    bodyKey: "home.help.upcoming.body",
  },
};

/** Chinese name keys for each section */
const SLOT_ZH_NAME: Record<HomeSectionSlot, string> = {
  today: "home.sections.todayZh",
  luck: "home.sections.luckZh",
  protection: "home.sections.protectionZh",
  upcoming: "home.sections.upcomingZh",
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
  const navigate = useNavigate();
  const { theme, locale, isPremium } = usePreferences();
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

          getDailyFortune()
            .then((fortuneData) => {
              if (isMounted) setDailyFortune(fortuneData);
            })
            .catch((err) => {
              console.error("Failed to load daily fortune:", err);
            });
        }
      } catch (caught) {
        if (isMounted) {
          setData(null);
          setError(toUserErrorMessage(caught));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    setLoading(true);
    loadGuidance();

    return () => {
      isMounted = false;
    };
  }, [preview, reloadNonce]);

  React.useEffect(() => {
    if (!forcedTheme) return;
    setTheme(forcedTheme);
  }, [forcedTheme]);

  const previewName = t("home.user.previewName");

  React.useEffect(() => {
    if (!preview || hasSeededProfile.current) return;
    if (!profile.name.trim()) setProfile({ name: previewName });
    hasSeededProfile.current = true;
  }, [preview, previewName, profile.name, setProfile]);

  // Hydrate profile from API (non-preview only)
  React.useEffect(() => {
    if (preview) return;
    let isMounted = true;

    async function hydrateProfile() {
      try {
        const response = await getMeApi();
        const { profile: apiProfile } = response;
        if (!isMounted) return;
        const updates: Partial<import("../stores/profileStore").Profile> = {};
        if (!profile.name.trim() && apiProfile.name) updates.name = apiProfile.name;
        if (!profile.dateOfBirthISO && apiProfile.dateOfBirthISO)
          updates.dateOfBirthISO = apiProfile.dateOfBirthISO;
        if (!profile.placeOfBirth && apiProfile.placeOfBirth)
          updates.placeOfBirth = apiProfile.placeOfBirth;
        if (!profile.livingCountry && apiProfile.livingCountry)
          updates.livingCountry = apiProfile.livingCountry;
        if (!profile.level && apiProfile.level) updates.level = apiProfile.level;
        if (Object.keys(updates).length > 0) setProfile(updates);
      } catch (caught) {
        console.warn("profile.hydration failed:", toUserErrorMessage(caught));
      }
    }

    hydrateProfile();
    return () => {
      isMounted = false;
    };
  }, [preview, setProfile]);

  // isPremium from preferencesStore (set by setPremium() after purchase)
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
    zhNameKey: SLOT_ZH_NAME[slot],
    help: HOME_SECTION_HELP[slot],
  })) satisfies Array<{
    key: HomeSectionSlot;
    iconKey: IconKey;
    secondaryIconKey?: IconKey;
    labelKey: string;
    zhNameKey: string;
    help: (typeof HOME_SECTION_HELP)[HomeSectionSlot];
  }>;

  const dailyMeta = preview ? PREVIEW_DAILY_META : data?.dailyMeta ?? PREVIEW_DAILY_META;
  const protectionPhrase = preview
    ? PREVIEW_PROTECTION_PHRASE
    : data?.protectionPhrase ?? PREVIEW_PROTECTION_PHRASE;
  const upcomingText = preview
    ? PREVIEW_UPCOMING_TEXT
    : data?.upcomingText ?? PREVIEW_UPCOMING_TEXT;
  const luckMeta = preview ? PREVIEW_LUCK_META : data?.luckMeta ?? PREVIEW_LUCK_META;
  const avoidMeta = preview ? PREVIEW_AVOID_META : data?.avoidMeta ?? PREVIEW_AVOID_META;
  const hasUnreadNotifications = false;

  // ── Luck/Avoid flip card ──────────────────────────────────────────────────
  // Front = Lucky (吉), Back = Unlucky/Avoid (凶)
  const luckFlipFront = (
    <div className="revamp-cardFlipPanel glass-card">
      <div className="revamp-cardFlipTitle">{t("bazi.daily.luckyLabel")}</div>
      <LuckAvoidMeta meta={luckMeta} variant="luck" />
    </div>
  );
  const luckFlipBack = (
    <div className="revamp-cardFlipPanel glass-card">
      <div className="revamp-cardFlipTitle">{t("bazi.daily.unluckyLabel")}</div>
      <LuckAvoidMeta meta={avoidMeta} variant="avoid" />
    </div>
  );

  // ── Do / Don't flip cards ────────────────────────────────────────────────
  // Each is a flip card: front = Do (green), back = Don't (red, locked for free users)
  const doFlipFront = (
    <div className="revamp-doDontPanel revamp-doDontPanel--do">
      <div className="revamp-doDontTitle revamp-doDontTitle--do">✅ {t("bazi.daily.doListTitle")}</div>
      <ul className="revamp-doDontList">
        {(dailyFortune?.doList ?? ["Start new projects", "Network with colleagues"]).map(
          (item: string, i: number) => <li key={i}>{item}</li>
        )}
      </ul>
    </div>
  );
  const doFlipBack = (
    <div className="revamp-doDontPanel revamp-doDontPanel--dont">
      <div className="revamp-doDontTitle revamp-doDontTitle--dont">🚫 {t("bazi.daily.dontListTitle")}</div>
      {isPremium ? (
        <ul className="revamp-doDontList">
          {(dailyFortune?.dontList ?? ["Avoid conflicts", "Postpone major purchases"]).map(
            (item: string, i: number) => <li key={i}>{item}</li>
          )}
        </ul>
      ) : (
        <div
          className="revamp-doDontLockedOverlay"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/premium")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate("/premium"); }}
        >
          <span style={{ fontSize: "20px" }}>🔒</span>
          <span className="revamp-doDontLockedLabel">{t("bazi.daily.unlockDont")}</span>
        </div>
      )}
    </div>
  );

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

            {/* ── Today's Phase: Energy Score + Day Pillar side-by-side ── */}
            {dailyFortune && (
              <PageSection
                title={
                  <SectionTitleRow
                    titleKey="bazi.daily.todayPhase"
                    zhNameKey="bazi.daily.todayPillar"
                    help={{
                      titleKey: "home.help.today.title",
                      bodyKey: "home.help.today.body",
                    }}
                  />
                }
                gap="sm"
              >
                <div className="revamp-dailyPhaseRow">
                  {/* Energy Score badge */}
                  {dailyFortune.energyScore !== undefined && (
                    <div className="revamp-dailyEnergyBadge">
                      <span className="revamp-dailyEnergyLabel">
                        {t("bazi.daily.energyScore")}
                      </span>
                      <span className="revamp-dailyEnergyValue">
                        {dailyFortune.energyScore.toFixed(1)}/10
                      </span>
                    </div>
                  )}
                  {/* Day Pillar card (horizontal, compact) */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <BaziPillarCard
                      pillarName={t("bazi.chart.dayPillar")}
                      stem={dailyFortune.dayPillar.stem}
                      stemEn={dailyFortune.dayPillar.stemEn}
                      branch={dailyFortune.dayPillar.branch}
                      branchEn={dailyFortune.dayPillar.branchEn}
                      element={dailyFortune.dayPillar.element}
                      tenGod={dailyFortune.dayPillar.tenGod}
                    />
                  </div>
                </div>
              </PageSection>
            )}

            {/* ── Section cards ── */}
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

              const sectionBody = loading
                ? loadingCard
                : error
                ? errorCard
                : section.key === "luck"
                ? (
                    // Luck & Avoid flip card — front=Lucky, back=Unlucky
                    <CardFlip
                      className="revamp-homeCard"
                      front={luckFlipFront}
                      back={luckFlipBack}
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
                      zhNameKey={section.zhNameKey}
                      help={section.help}
                    />
                  }
                  gap="sm"
                >
                  {sectionBody}
                </PageSection>
              );
            })}

            {/* ── Daily Fortune detail ── */}
            {dailyFortune && (
              <>
                {/* Summary & Advice */}
                <PageSection
                  title={
                    <SectionTitleRow
                      titleKey="bazi.daily.summary"
                      help={{
                        titleKey: "home.help.today.title",
                        bodyKey: "home.help.today.body",
                      }}
                    />
                  }
                  gap="sm"
                >
                  <Card>
                    <Stack gap="md">
                      <Text style={{ fontWeight: 600 }}>{dailyFortune.summary}</Text>
                      <Text muted>{dailyFortune.advice}</Text>
                    </Stack>
                  </Card>
                </PageSection>

                {/* Lucky Activity */}
                <PageSection
                  title={
                    <SectionTitleRow
                      titleKey="bazi.daily.luckyActivity"
                      help={{
                        titleKey: "home.help.luck.title",
                        bodyKey: "home.help.luck.body",
                      }}
                    />
                  }
                  gap="sm"
                >
                  <Card>
                    <Text>{dailyFortune.luckyActivity}</Text>
                  </Card>
                </PageSection>

                {/* Do / Don't — flip card, Don't side locked for free users */}
                <PageSection
                  title={
                    <SectionTitleRow
                      titleKey="bazi.daily.dosAndDonts"
                      zhNameKey="bazi.daily.doListTitle"
                      help={{
                        titleKey: "home.help.luck.title",
                        bodyKey: "home.help.luck.body",
                      }}
                    />
                  }
                  gap="sm"
                >
                  <CardFlip
                    className="revamp-homeCard"
                    front={doFlipFront}
                    back={doFlipBack}
                    ariaLabel={t("bazi.daily.dosAndDonts")}
                  />
                </PageSection>

                {/* Recommendations */}
                {dailyFortune.recommendations?.length > 0 && (
                  <PageSection
                    title={
                      <SectionTitleRow
                        titleKey="bazi.daily.recommendations"
                        help={{
                          titleKey: "home.help.upcoming.title",
                          bodyKey: "home.help.upcoming.body",
                        }}
                      />
                    }
                    gap="sm"
                  >
                    <Card>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "var(--space-md, 16px)",
                        }}
                      >
                        {dailyFortune.recommendations.map(
                          (item: string, i: number) => (
                            <li key={i}>
                              <Text>{item}</Text>
                            </li>
                          )
                        )}
                      </ul>
                    </Card>
                  </PageSection>
                )}
              </>
            )}

            {/* Legacy dashboard link removed */}
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
