/**
 * MonthlyNew.tsx — Monthly Fortune screen (revamp_20260213)
 *
 * Layout mirrors Daily (Home.tsx) exactly:
 *  1. TopBar (UserBadge pill, SkinToggleIcon, NotificationButton)
 *  2. Month header + Chinese month pillar (compact horizontal)
 *  3. Life Domains — 6-category selector + trend line chart
 *     (wealth / relationship / health locked for non-premium)
 *  4. Luck & Avoid flip card (SectionTitleRow header with ?)
 *  5. Fortune Hints grid (lucky color, number, active/weak element)
 *  6. Day Master × Month interaction
 *  7. Protection section
 *
 * Section headers: all use SectionTitleRow with zhNameKey + titleKey + help popup
 */
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { CardFlip } from "../components/CardFlip";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { ContentPageTopBar } from "../components/ContentPageTopBar";
import { BaziPillarCard } from "../components/BaziPillarCard";
import type { MonthlyFortune, LifeDomain } from "../services/mock/baziTypes";
import { MOCK_MONTHLY_FORTUNE } from "../services/mock/baziDataExtended";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";

// ─── Domain config ────────────────────────────────────────────────────────────
type DomainKey = "work" | "wealth" | "relationship" | "health" | "study" | "talent";
const DOMAIN_KEYS: DomainKey[] = ["work", "wealth", "relationship", "health", "study", "talent"];
const PREMIUM_DOMAINS: DomainKey[] = ["wealth", "relationship", "health"];

// Domain display labels (short, for tabs)
const DOMAIN_LABELS: Record<DomainKey, string> = {
  work: "Career",
  wealth: "Wealth",
  relationship: "Love",
  health: "Health",
  study: "Study",
  talent: "Talent",
};

// ─── Tiny SVG line chart ──────────────────────────────────────────────────────
function MiniLineChart({
  data,
  activeIndex,
  onDotClick,
  width = 300,
  height = 90,
}: {
  data: number[];
  activeIndex: number;
  onDotClick: (i: number) => void;
  width?: number;
  height?: number;
}) {
  const color = "var(--c-accent)";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padX = 10;
  const padY = 10;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const pts = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + (1 - (v - min) / range) * chartH;
    return { x, y };
  });
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ overflow: "visible", cursor: "pointer" }}
    >
      {/* Grid lines */}
      {[0, 0.5, 1].map((frac) => (
        <line
          key={frac}
          x1={padX}
          y1={padY + (1 - frac) * chartH}
          x2={width - padX}
          y2={padY + (1 - frac) * chartH}
          stroke="var(--c-border)"
          strokeWidth={0.5}
          strokeDasharray="3,3"
        />
      ))}
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dots */}
      {pts.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={i === activeIndex ? 5 : 3.5}
          fill={i === activeIndex ? color : "var(--c-card-bg)"}
          stroke={color}
          strokeWidth={i === activeIndex ? 2 : 1.5}
          style={{ cursor: "pointer" }}
          onClick={() => onDotClick(i)}
        />
      ))}
    </svg>
  );
}

// ─── Trend score (mock) ───────────────────────────────────────────────────────
function trendScore(trend: "up" | "neutral" | "down") {
  return trend === "up" ? 82 : trend === "neutral" ? 55 : 28;
}

// ─── Main component ───────────────────────────────────────────────────────────
export const MonthlyNew: React.FC = () => {
  const { theme, isPremium } = usePreferences();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [monthlyData] = React.useState<MonthlyFortune>(MOCK_MONTHLY_FORTUNE);
  const [selectedDomainIdx, setSelectedDomainIdx] = React.useState(0);
  const [luckFlipped, setLuckFlipped] = React.useState(false);

  const domainMap = React.useMemo(() => {
    const m: Partial<Record<DomainKey, LifeDomain>> = {};
    for (const d of monthlyData.lifeDomains) {
      m[d.domain as DomainKey] = d;
    }
    return m;
  }, [monthlyData]);

  // Chart data: scores for all 6 domains in order
  const chartData = DOMAIN_KEYS.map((k) => {
    const d = domainMap[k];
    return d ? trendScore(d.trend) : 55;
  });

  const selectedDomainKey = DOMAIN_KEYS[selectedDomainIdx];
  const activeDomain = domainMap[selectedDomainKey];
  const isDomainPremium = PREMIUM_DOMAINS.includes(selectedDomainKey) && !isPremium;

  // ── Luck & Avoid flip card ────────────────────────────────────────────────
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
      <PageCard>
        <PageContent>
          <Stack gap="lg">

            {/* ── 1. TopBar (mirrors Daily) ── */}
            <ContentPageTopBar />

            {/* ── 2. Month header ── */}
            <div>
              <h1 style={{ fontSize: "var(--fs-xl)", fontWeight: 800, marginBottom: 4 }}>
                {t("monthly.overview.title")}
              </h1>
              <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-text-muted)" }}>
                {monthlyData.month} · {monthlyData.chineseMonth}
              </p>
            </div>

            {/* ── 3. Month Pillar + Overview (side by side, mirrors Daily phase row) ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="monthly.pillar.title"
                zhNameKey="monthly.pillar.zhName"
                help={{ titleKey: "info.monthlyFlow.title", bodyKey: "info.monthlyFlow.body" }}
              />
              <div style={{ display: "flex", gap: "var(--s-3)", alignItems: "flex-start", marginTop: "var(--s-3)" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <BaziPillarCard
                    compact
                    pillarName={t("bazi.chart.monthPillar")}
                    stem={monthlyData.monthPillar.stem}
                    stemEn={monthlyData.monthPillar.stemEn}
                    branch={monthlyData.monthPillar.branch}
                    branchEn={monthlyData.monthPillar.branchEn}
                    element={monthlyData.monthPillar.element}
                    tenGod={monthlyData.monthPillar.tenGod}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Card>
                    <Text muted style={{ fontSize: "var(--fs-sm)", lineHeight: 1.7, fontStyle: "italic" }}>
                      {monthlyData.overview}
                    </Text>
                  </Card>
                </div>
              </div>
            </PageSection>

            {/* ── 4. Life Domains — line chart + category tabs ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="monthly.lifeDomains.title"
                zhNameKey="monthly.lifeDomains.zhName"
                help={{ titleKey: "info.lifeDomains.title", bodyKey: "info.lifeDomains.body" }}
              />
              <Card style={{ marginTop: "var(--s-3)" }}>
                <Stack gap="md">
                  {/* Category tabs */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {DOMAIN_KEYS.map((key, idx) => {
                      const isPrem = PREMIUM_DOMAINS.includes(key) && !isPremium;
                      const isActive = selectedDomainIdx === idx;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedDomainIdx(idx)}
                          style={{
                            padding: "5px 11px",
                            borderRadius: "999px",
                            border: isActive
                              ? "2px solid var(--c-accent)"
                              : "1px solid var(--c-border)",
                            background: isActive ? "var(--c-accent)" : "transparent",
                            color: isActive ? "#fff" : "var(--c-text-muted)",
                            fontSize: "var(--fs-xs)",
                            fontWeight: isActive ? 700 : 400,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          {isPrem && "🔒 "}
                          {DOMAIN_LABELS[key]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Line chart — tap a dot to select that domain */}
                  <div>
                    <MiniLineChart
                      data={chartData}
                      activeIndex={selectedDomainIdx}
                      onDotClick={(i) => setSelectedDomainIdx(i)}
                    />
                    {/* X-axis labels */}
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
                      {DOMAIN_KEYS.map((k, i) => (
                        <span
                          key={k}
                          style={{
                            fontSize: 9,
                            color: selectedDomainIdx === i ? "var(--c-accent)" : "var(--c-text-muted)",
                            fontWeight: selectedDomainIdx === i ? 700 : 400,
                            textAlign: "center",
                            flex: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedDomainIdx(i)}
                        >
                          {DOMAIN_LABELS[k].slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selected domain detail */}
                  {activeDomain && (
                    <div style={{
                      padding: "var(--s-3)",
                      background: "var(--c-surface-2, rgba(0,0,0,0.04))",
                      borderRadius: "var(--r-md)",
                      borderLeft: "3px solid var(--c-accent)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: "1.1rem" }}>
                          {selectedDomainKey === "work" ? "💼" :
                           selectedDomainKey === "wealth" ? "💰" :
                           selectedDomainKey === "relationship" ? "❤️" :
                           selectedDomainKey === "health" ? "🏃" :
                           selectedDomainKey === "study" ? "📚" : "✨"}
                        </span>
                        <Text style={{ fontWeight: 700 }}>
                          {DOMAIN_LABELS[selectedDomainKey]}
                        </Text>
                        <span style={{
                          fontSize: "var(--fs-xs)",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: activeDomain.trend === "up"
                            ? "rgba(34,197,94,0.15)"
                            : activeDomain.trend === "down"
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(234,179,8,0.15)",
                          color: activeDomain.trend === "up"
                            ? "var(--c-green, #16a34a)"
                            : activeDomain.trend === "down"
                            ? "var(--c-red, #dc2626)"
                            : "var(--c-yellow, #ca8a04)",
                          fontWeight: 600,
                        }}>
                          {activeDomain.trend === "up" ? "↑ Rising" :
                           activeDomain.trend === "down" ? "↓ Caution" : "→ Steady"}
                        </span>
                      </div>
                      {isDomainPremium ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "var(--s-3)" }}>
                          <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                            🔒 {t("common.premiumRequired")}
                          </Text>
                          <button
                            type="button"
                            onClick={() => navigate("/premium")}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "999px",
                              background: "var(--c-accent)",
                              color: "#fff",
                              border: "none",
                              fontSize: "var(--fs-xs)",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            {t("premium.cta")}
                          </button>
                        </div>
                      ) : (
                        <Text muted style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>
                          {activeDomain.description}
                        </Text>
                      )}
                    </div>
                  )}
                </Stack>
              </Card>
            </PageSection>

            {/* ── 5. Luck & Avoid flip card ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="monthly.luckAvoid.title"
                zhNameKey="monthly.luckAvoid.zhName"
                help={{ titleKey: "info.luckAvoid.title", bodyKey: "info.luckAvoid.body" }}
              />
              <div style={{ marginTop: "var(--s-3)" }}>
                <CardFlip
                  front={luckFront}
                  back={luckBack}
                  isFlipped={luckFlipped}
                  onFlipChange={() => setLuckFlipped((f) => !f)}
                  ariaLabel={t("monthly.luckAvoid.title")}
                  className="revamp-monthlyLuckFlip"
                />
              </div>
            </PageSection>

            {/* ── 6. Fortune Hints ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="monthly.fortune.title"
                zhNameKey="monthly.fortune.zhName"
                help={{ titleKey: "info.monthlyFlow.title", bodyKey: "info.monthlyFlow.body" }}
              />
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "var(--s-3)",
                marginTop: "var(--s-3)",
              }}>
                {[
                  { label: t("monthly.fortune.luckyColor"), value: monthlyData.luckyColor, icon: "🎨" },
                  { label: t("monthly.fortune.luckyNumber"), value: String(monthlyData.luckyNumber), icon: "🔢" },
                  { label: t("monthly.fortune.activeElement"), value: monthlyData.activeElement, icon: "⚡" },
                  { label: t("monthly.fortune.weakElement"), value: monthlyData.weakElement, icon: "🌙" },
                ].map(({ label, value, icon }) => (
                  <Card key={label} style={{ textAlign: "center", padding: "var(--s-3)" }}>
                    <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{icon}</div>
                    <Text muted style={{ fontSize: "var(--fs-xs)" }}>{label}</Text>
                    <Text style={{ fontWeight: 700, marginTop: 2 }}>{value}</Text>
                  </Card>
                ))}
              </div>
            </PageSection>

            {/* ── 7. Day Master × Month ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="monthly.interaction.title"
                zhNameKey="monthly.interaction.zhName"
                help={{ titleKey: "info.dayMaster.title", bodyKey: "info.dayMaster.body" }}
              />
              <Card style={{ marginTop: "var(--s-3)" }}>
                <Text muted style={{ lineHeight: 1.7 }}>
                  {monthlyData.dayMasterInteraction}
                </Text>
              </Card>
            </PageSection>

            {/* ── 8. Protection ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="monthly.protection.title"
                zhNameKey="monthly.protection.zhName"
                help={{ titleKey: "info.protection.title", bodyKey: "info.protection.body" }}
              />
              <Card style={{
                marginTop: "var(--s-3)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(59,130,246,0.07))",
              }}>
                <Stack gap="sm">
                  <Text style={{ fontWeight: 700, color: "var(--c-accent)", textAlign: "center" }}>
                    {monthlyData.protectionFocus}
                  </Text>
                  <ul style={{ paddingLeft: "var(--s-4)", margin: 0 }}>
                    {monthlyData.protectionSuggestions.map((s, i) => (
                      <li key={i} style={{ fontSize: "var(--fs-sm)", color: "var(--c-text-muted)", marginBottom: 4 }}>
                        {s}
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
};
