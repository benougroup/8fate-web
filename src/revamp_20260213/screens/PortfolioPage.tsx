/**
 * PortfolioPage.tsx — User portfolio / profile hub (revamp_20260213)
 *
 * Layout:
 *  1. ContentPageTopBar (sticky, menu page — no back button)
 *  2. Profile info card (real name + DOB from profileStore)
 *  3. Day Master + 5-Element spider web chart (SVG)
 *  4. Four Pillars summary (compact horizontal)
 *  5. Ten Gods spinner (← swipe through all 10 gods →)
 *  6. Quick actions grid (navigate to other features)
 */
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { ContentPageTopBar } from "../components/ContentPageTopBar";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { t } from "../i18n/t";
import { getBaziProfile } from "../services/providers/baziProvider";
import type { BaziProfile } from "../services/mock/baziTypes";
import { getIconSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";

// ─── Spider Web (Radar) Chart ─────────────────────────────────────────────────
const ELEMENT_COLORS: Record<string, string> = {
  wood:  "#22c55e",
  fire:  "#ef4444",
  earth: "#f59e0b",
  metal: "#94a3b8",
  water: "#3b82f6",
};
const ELEMENT_LABELS: Record<string, { zh: string; en: string }> = {
  wood:  { zh: "木", en: "Wood" },
  fire:  { zh: "火", en: "Fire" },
  earth: { zh: "土", en: "Earth" },
  metal: { zh: "金", en: "Metal" },
  water: { zh: "水", en: "Water" },
};
const ELEMENTS = ["wood", "fire", "earth", "metal", "water"] as const;

function SpiderChart({ values }: { values: Record<string, number> }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 80;
  const maxVal = Math.max(...Object.values(values), 1);
  const n = ELEMENTS.length;

  // Compute polygon points for each element
  const pts = ELEMENTS.map((el, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (values[el] / maxVal) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), el };
  });

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Axis endpoints
  const axes = ELEMENTS.map((el, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + maxR * Math.cos(angle),
      y: cy + maxR * Math.sin(angle),
      lx: cx + (maxR + 20) * Math.cos(angle),
      ly: cy + (maxR + 20) * Math.sin(angle),
      el,
    };
  });

  const polyPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="revamp-spiderChart" aria-label="Five Elements Balance">
      {/* Grid rings */}
      {rings.map((r) => {
        const ringPts = ELEMENTS.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return `${cx + maxR * r * Math.cos(angle)},${cy + maxR * r * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={r}
            points={ringPts}
            fill="none"
            stroke="var(--c-border)"
            strokeWidth={0.8}
          />
        );
      })}

      {/* Axes */}
      {axes.map((a) => (
        <line
          key={a.el}
          x1={cx} y1={cy}
          x2={a.x} y2={a.y}
          stroke="var(--c-border)"
          strokeWidth={0.8}
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polyPoints}
        fill="var(--c-accent)"
        fillOpacity={0.18}
        stroke="var(--c-accent)"
        strokeWidth={2}
      />

      {/* Data dots */}
      {pts.map((p) => (
        <circle
          key={p.el}
          cx={p.x} cy={p.y} r={4}
          fill={ELEMENT_COLORS[p.el]}
          stroke="#fff"
          strokeWidth={1.5}
        />
      ))}

      {/* Labels */}
      {axes.map((a) => {
        const lbl = ELEMENT_LABELS[a.el];
        const anchor =
          a.lx < cx - 5 ? "end" : a.lx > cx + 5 ? "start" : "middle";
        return (
          <g key={a.el}>
            <text
              x={a.lx} y={a.ly - 4}
              textAnchor={anchor}
              fontSize={11}
              fontWeight={700}
              fill={ELEMENT_COLORS[a.el]}
            >
              {lbl.zh}
            </text>
            <text
              x={a.lx} y={a.ly + 8}
              textAnchor={anchor}
              fontSize={9}
              fill="var(--c-text-muted)"
            >
              {lbl.en}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Ten Gods Spinner ─────────────────────────────────────────────────────────
type TenGodEntry = {
  name: string;
  zhName: string;
  emoji: string;
  descKey: string; // i18n key — resolved lazily at render time to avoid circular dep
};

// Use i18n keys, NOT pre-computed t() calls — avoids circular initialization
const TEN_GOD_DEFS: TenGodEntry[] = [
  { name: "Friend",           zhName: "比肩", emoji: "🤝", descKey: "info.tenGod_friend" },
  { name: "Rob Wealth",       zhName: "劫財", emoji: "⚔️", descKey: "info.tenGod_robWealth" },
  { name: "Eating God",       zhName: "食神", emoji: "🍽️", descKey: "info.tenGod_eatingGod" },
  { name: "Hurting Officer",  zhName: "傷官", emoji: "🎭", descKey: "info.tenGod_hurtingOfficer" },
  { name: "Direct Wealth",    zhName: "正財", emoji: "💰", descKey: "info.tenGod_directWealth" },
  { name: "Indirect Wealth",  zhName: "偏財", emoji: "🎲", descKey: "info.tenGod_indirectWealth" },
  { name: "Direct Officer",   zhName: "正官", emoji: "🏛️", descKey: "info.tenGod_directOfficer" },
  { name: "Seven Killings",   zhName: "七殺", emoji: "🗡️", descKey: "info.tenGod_sevenKillings" },
  { name: "Direct Resource",  zhName: "正印", emoji: "📚", descKey: "info.tenGod_directResource" },
  { name: "Indirect Resource",zhName: "偏印", emoji: "🔮", descKey: "info.tenGod_indirectResource" },
];

function TenGodSpinner() {
  const TEN_GODS = TEN_GOD_DEFS;
  const [idx, setIdx] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  const go = (dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIdx((prev) => (prev + dir + TEN_GODS.length) % TEN_GODS.length);
      setAnimating(false);
    }, 150);
  };

  const god = TEN_GODS[idx];
  // Resolve i18n at render time (not at module init) to avoid circular dependency
  const godDesc: string = t(god.descKey as Parameters<typeof t>[0]) ?? "";

  return (
    <div>
      <div className="revamp-godSpinner">
        <button
          type="button"
          className="revamp-godSpinnerBtn"
          onClick={() => go(-1)}
          aria-label="Previous god"
        >
          ←
        </button>
        <div
          className="revamp-godSpinnerCard"
          style={{ opacity: animating ? 0 : 1 }}
        >
          <div style={{ fontSize: "2rem" }}>{god.emoji}</div>
          <div>
            <Text style={{ fontWeight: 800, fontSize: "var(--fs-md)" }}>{god.name}</Text>
            <Text muted style={{ fontSize: "var(--fs-sm)" }}>{god.zhName}</Text>
          </div>
          <Text muted style={{ fontSize: "var(--fs-xs)", textAlign: "center", lineHeight: 1.5 }}>
            {godDesc ? (godDesc.includes(":") ? godDesc.split(":").slice(1).join(":").trim().split(".")[0] + "." : godDesc.split(".")[0] + ".") : ""}
          </Text>
        </div>
        <button
          type="button"
          className="revamp-godSpinnerBtn"
          onClick={() => go(1)}
          aria-label="Next god"
        >
          →
        </button>
      </div>
      {/* Dot indicators */}
      <div className="revamp-godSpinnerDots">
        {TEN_GODS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`revamp-godSpinnerDot${i === idx ? " revamp-godSpinnerDot--active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to ${TEN_GODS[i].name}`}
            style={{ border: "none", cursor: "pointer", padding: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
type QuickAction = {
  label: string;
  sublabel: string;
  iconKey: Parameters<typeof getIconSrc>[1];
  route: string;
};

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const displayName = userProfile.name || baziProfile?.name || t("home.user.guest");
  const displayDOB = userProfile.dateOfBirthISO || baziProfile?.birthDate || "—";
  const displayLocation = userProfile.placeOfBirth || baziProfile?.birthLocation || "";

  const quickActions: QuickAction[] = [
    { label: t("bazi.chart.title"),  sublabel: "Four Pillars",   iconKey: "daymaster",    route: "/bazi-chart" },
    { label: "Luck Pillars",         sublabel: "10-Year Cycles", iconKey: "lucktrend",    route: "/luck-pillars" },
    { label: "Annual Forecast",      sublabel: "2026 Reading",   iconKey: "year",         route: "/yearly" },
    { label: "Monthly",              sublabel: "This Month",     iconKey: "monthly_flow", route: "/monthly" },
    { label: "Daily Fortune",        sublabel: "Today's Energy", iconKey: "daily_flow",  route: "/daily" },
    { label: "Auspicious Dates",     sublabel: "Best Days",      iconKey: "today",        route: "/auspicious-dates" },
    { label: "AI Chat",              sublabel: "Ask a Question", iconKey: "mouth",        route: "/chat" },
  ];

  const elements = baziProfile?.elements ?? { wood: 2.5, fire: 1.8, earth: 1.2, metal: 3.5, water: 2.0 };
  const chart = baziProfile?.chart;

  if (isLoading) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <ContentPageTopBar />
            <Stack gap="md" align="center" style={{ paddingTop: "var(--s-8)" }}>
              <Text muted>{t("common.loading")}</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            {/* ── Sticky Top Bar ── */}
            <div className="revamp-portfolioStickyHeader">
              <ContentPageTopBar />
            </div>

            {/* ── Profile Card ── */}
            <Card>
              <Stack gap="sm">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--s-4)" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "var(--c-accent)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 800, fontSize: "var(--fs-lg)" }}>{displayName}</Text>
                    {displayDOB !== "—" && (
                      <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                        {new Date(displayDOB + "T00:00:00").toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </Text>
                    )}
                    {displayLocation && (
                      <Text muted style={{ fontSize: "var(--fs-xs)" }}>📍 {displayLocation}</Text>
                    )}
                  </div>
                  {chart && (
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 800,
                        color: "var(--c-accent)", lineHeight: 1,
                      }}>
                        {chart.dayMaster}
                      </div>
                      <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                        {chart.dayMasterEn}
                      </Text>
                      <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                        {chart.dayMasterElementEn}
                      </Text>
                    </div>
                  )}
                </div>
              </Stack>
            </Card>

            {/* ── Four Pillars ── */}
            {chart && (
              <PageSection>
                <SectionTitleRow
                  titleKey="bazi.chart.title"
                  zhNameKey="bazi.chart.fourPillars"
                  help={{ titleKey: "bazi.chart.fourPillars", bodyKey: "info.fourPillars.body" }}
                />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "var(--s-2)",
                }}>
                  {[
                    { pillar: chart.year,  label: t("bazi.chart.yearPillar") },
                    { pillar: chart.month, label: t("bazi.chart.monthPillar") },
                    { pillar: chart.day,   label: t("bazi.chart.dayPillar") },
                    { pillar: chart.hour,  label: t("bazi.chart.hourPillar") },
                  ].map(({ pillar, label }) => (
                    <BaziPillarCard key={label} pillar={pillar} label={label} compact />
                  ))}
                </div>
              </PageSection>
            )}

            {/* ── 5-Element Spider Web Chart ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="bazi.chart.elementBalance"
                zhNameKey="bazi.chart.elementBalance"
                help={{ titleKey: "bazi.chart.elementBalance", bodyKey: "info.elementBalance.body" }}
              />
              <Card>
                <SpiderChart values={elements} />
                {/* Element value bars */}
                <div style={{ marginTop: "var(--s-3)", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                  {ELEMENTS.map((el) => {
                    const maxVal = Math.max(...Object.values(elements), 1);
                    const pct = Math.round((elements[el] / maxVal) * 100);
                    return (
                      <div key={el} style={{ display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
                        <span style={{
                          width: 28, textAlign: "center", fontWeight: 800,
                          color: ELEMENT_COLORS[el], fontSize: "var(--fs-sm)",
                        }}>
                          {ELEMENT_LABELS[el].zh}
                        </span>
                        <div style={{ flex: 1, height: 6, background: "var(--c-surface-3, rgba(0,0,0,0.08))", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: ELEMENT_COLORS[el], borderRadius: 3 }} />
                        </div>
                        <span style={{ width: 32, textAlign: "right", fontSize: "var(--fs-xs)", color: "var(--c-text-muted)" }}>
                          {elements[el].toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </PageSection>

            {/* ── Ten Gods Spinner ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="bazi.chart.tenGods"
                help={{ titleKey: "bazi.chart.tenGods", bodyKey: "info.tenGods.body" }}
              />
              <Card>
                <TenGodSpinner />
              </Card>
            </PageSection>

            {/* ── Quick Actions ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="portfolio.explore"
              />
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "var(--s-3)",
              }}>
                {quickActions.map((action) => (
                  <Card
                    key={action.route}
                    style={{ cursor: "pointer", textAlign: "center", padding: "var(--s-4) var(--s-2)" }}
                    onClick={() => navigate(action.route)}
                  >
                    <Stack gap="xs" align="center">
                      <img
                        src={getIconSrc(theme, action.iconKey)}
                        alt={action.label}
                        style={{ width: 36, height: 36 }}
                      />
                      <Text style={{ fontSize: "var(--fs-xs)", fontWeight: 700, color: "var(--c-ink)" }}>
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
