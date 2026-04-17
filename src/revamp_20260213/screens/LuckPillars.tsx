import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { ContentPageTopBar } from "../components/ContentPageTopBar";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { PageSection } from "../components/PageSection";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { t } from "../i18n/t";
import { getBaziProfileById } from "../services/mock/baziData";
import { usePreferences } from "../stores/preferencesStore";
import { getTenGodIconSrc, getIconSrc, type TenGodKey } from "../assets/assetMap";
import type { LuckPillar } from "../services/mock/baziTypes";

// ─── Ten God Descriptions ─────────────────────────────────────────────────────
const TEN_GOD_DESCRIPTIONS: Record<TenGodKey, { role: string; nature: string; colour: string; keywords: string[] }> = {
  "Friend":           { role: "Peer / Ally",            nature: "Same element, same polarity as Day Master",      colour: "#4CAF50", keywords: ["Cooperation","Networking","Peer support"] },
  "Rob Wealth":       { role: "Competitor / Rival",      nature: "Same element, opposite polarity",                colour: "#F44336", keywords: ["Competition","Drive","Ambition"] },
  "Eating God":       { role: "Creative Output",         nature: "Element you produce, same polarity",             colour: "#9C27B0", keywords: ["Creativity","Expression","Enjoyment"] },
  "Hurting Officer":  { role: "Rebellious Talent",       nature: "Element you produce, opposite polarity",         colour: "#E91E63", keywords: ["Innovation","Rebellion","Talent"] },
  "Direct Wealth":    { role: "Earned Wealth",           nature: "Element you control, opposite polarity",         colour: "#FF9800", keywords: ["Steady income","Discipline","Reliability"] },
  "Indirect Wealth":  { role: "Windfall / Investment",   nature: "Element you control, same polarity",             colour: "#FF5722", keywords: ["Speculation","Opportunity","Risk"] },
  "Direct Officer":   { role: "Authority / Career",      nature: "Element that controls you, opposite polarity",   colour: "#2196F3", keywords: ["Structure","Reputation","Career"] },
  "Seven Killings":   { role: "Power / Pressure",        nature: "Element that controls you, same polarity",       colour: "#F44336", keywords: ["Pressure","Transformation","Power"] },
  "Direct Resource":  { role: "Support / Mentor",        nature: "Element that produces you, opposite polarity",   colour: "#00BCD4", keywords: ["Mentorship","Learning","Support"] },
  "Indirect Resource":{ role: "Wisdom / Intuition",      nature: "Element that produces you, same polarity",       colour: "#009688", keywords: ["Intuition","Strategy","Independence"] },
};

// ─── Element colours ─────────────────────────────────────────────────────────
const ELEMENT_COLOURS: Record<string, string> = {
  Water: "#3b82f6", Wood: "#22c55e", Fire: "#ef4444",
  Earth: "#f59e0b", Metal: "#94a3b8",
};

// ─── Ten God Badge (tappable, shows popup) ────────────────────────────────────
function TenGodBadge({ god, theme, gold = false }: { god: TenGodKey; theme: "yin" | "yang"; gold?: boolean }) {
  const info = TEN_GOD_DESCRIPTIONS[god];
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className="revamp-tenGodBadge"
        data-gold={gold}
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        title={god}
      >
        <img src={getTenGodIconSrc(theme, god, gold)} alt={god} className="revamp-tenGodBadgeIcon" />
        <span className="revamp-tenGodBadgeLabel">{god}</span>
      </button>
      {open && (
        <div className="revamp-infoPopupOverlay" onClick={() => setOpen(false)}>
          <div className="revamp-infoPopupSheet" onClick={(e) => e.stopPropagation()}>
            <div className="revamp-infoPopupHeader">
              <img src={getTenGodIconSrc(theme, god, gold)} alt={god} style={{ width: 40, height: 40 }} />
              <div style={{ flex: 1 }}>
                <div className="revamp-infoPopupTitle">{god}</div>
                <div className="revamp-infoPopupSubtitle">{info.role}</div>
              </div>
              <button type="button" className="revamp-infoPopupClose" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="revamp-infoPopupBody">
              <p style={{ marginBottom: 8 }}>{info.nature}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {info.keywords.map((kw) => (
                  <span key={kw} style={{
                    background: info.colour + "22", color: info.colour,
                    borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
                  }}>{kw}</span>
                ))}
              </div>
              {gold && (
                <p style={{ color: "#B8860B", fontWeight: 600, fontSize: 13 }}>
                  ★ This is the dominant Ten God in your current Luck Pillar — its influence is amplified right now.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Life Timeline Bar ────────────────────────────────────────────────────────
function LifeTimelineBar({ pillars }: { pillars: LuckPillar[] }) {
  if (!pillars.length) return null;
  const minAge = pillars[0].startAge;
  const maxAge = pillars[pillars.length - 1].endAge;
  const totalSpan = maxAge - minAge || 1;
  const currentPillar = pillars.find((p) => p.isCurrent);

  return (
    <div className="revamp-lifeTimeline">
      {pillars.map((p) => {
        const widthPct = ((p.endAge - p.startAge) / totalSpan) * 100;
        const colour = ELEMENT_COLOURS[p.elementEn] ?? "#94a3b8";
        return (
          <div
            key={p.startAge}
            className="revamp-lifeTimelineSegment"
            data-current={p.isCurrent}
            style={{ width: `${widthPct}%`, background: colour + (p.isCurrent ? "dd" : "44") }}
            title={`Age ${p.startAge}–${p.endAge}: ${p.elementEn}`}
          >
            {p.isCurrent && (
              <span className="revamp-lifeTimelineNow">▼</span>
            )}
          </div>
        );
      })}
      <div className="revamp-lifeTimelineLabels">
        <span>{minAge}</span>
        {currentPillar && (
          <span style={{ position: "absolute", left: `${((currentPillar.startAge - minAge) / totalSpan) * 100}%`, transform: "translateX(-50%)", fontWeight: 700, color: "var(--c-accent)" }}>
            {currentPillar.startAge}
          </span>
        )}
        <span>{maxAge}</span>
      </div>
    </div>
  );
}

// ─── Derived data helpers ─────────────────────────────────────────────────────
/** Generate mock yearly scores for a pillar (deterministic from startAge) */
function getYearlyScores(pillar: LuckPillar): { year: number; age: number; score: number; isCurrent: boolean }[] {
  const currentYear = new Date().getFullYear();
  const rows: { year: number; age: number; score: number; isCurrent: boolean }[] = [];
  for (let i = 0; i < (pillar.endAge - pillar.startAge); i++) {
    const age = pillar.startAge + i;
    // Deterministic pseudo-random score based on pillar + offset
    const seed = (pillar.startAge * 7 + i * 13) % 100;
    const score = 45 + Math.round(Math.abs(Math.sin(seed) * 50));
    const year = currentYear - (pillar.isCurrent ? (new Date().getFullYear() - (currentYear - (pillar.startAge - (new Date().getFullYear() - currentYear)))) : 0) + i;
    rows.push({ year: pillar.isCurrent ? currentYear - Math.floor((pillar.endAge - pillar.startAge) / 2) + i : 2000 + i, age, score, isCurrent: pillar.isCurrent && i === Math.floor((pillar.endAge - pillar.startAge) / 2) });
  }
  return rows;
}

/** Life domain data for the pillar */
const DOMAIN_DATA: { icon: string; name: string; scoreKey: number }[] = [
  { icon: "💼", name: "Career",      scoreKey: 1 },
  { icon: "💰", name: "Wealth",      scoreKey: 2 },
  { icon: "❤️", name: "Romance",     scoreKey: 3 },
  { icon: "🏥", name: "Health",      scoreKey: 4 },
  { icon: "🎓", name: "Learning",    scoreKey: 5 },
  { icon: "👨‍👩‍👧", name: "Family",     scoreKey: 6 },
];

function getDomainScore(pillar: LuckPillar, key: number): number {
  const seed = (pillar.startAge * 3 + key * 17) % 100;
  return 40 + Math.round(Math.abs(Math.sin(seed) * 55));
}

function getFortuneThemes(pillar: LuckPillar): { label: string; type: "positive" | "caution" | "neutral" }[] {
  const stemGod = pillar.stemTenGod;
  const branchGod = pillar.branchTenGod;
  const themes: { label: string; type: "positive" | "caution" | "neutral" }[] = [];
  if (stemGod) {
    const info = TEN_GOD_DESCRIPTIONS[stemGod];
    info.keywords.forEach((kw) => themes.push({ label: kw, type: ["Direct Wealth","Direct Officer","Direct Resource","Eating God","Friend"].includes(stemGod) ? "positive" : "caution" }));
  }
  if (branchGod && branchGod !== stemGod) {
    const info = TEN_GOD_DESCRIPTIONS[branchGod];
    info.keywords.slice(0, 2).forEach((kw) => themes.push({ label: kw, type: ["Direct Wealth","Direct Officer","Direct Resource","Eating God","Friend"].includes(branchGod) ? "positive" : "caution" }));
  }
  themes.push({ label: pillar.elementEn + " Phase", type: "neutral" });
  return themes;
}

// ─── Pillar Row (expandable) ──────────────────────────────────────────────────
function LuckPillarRow({ pillar, theme, index, total }: { pillar: LuckPillar; theme: "yin" | "yang"; index: number; total: number }) {
  const [expanded, setExpanded] = React.useState(pillar.isCurrent);
  const [activeTab, setActiveTab] = React.useState<"overview" | "yearly" | "domains">("overview");
  const elemColour = ELEMENT_COLOURS[pillar.elementEn] ?? "#94a3b8";
  const domainScores = DOMAIN_DATA.map((d) => ({ ...d, score: getDomainScore(pillar, d.scoreKey) }));
  const themes = getFortuneThemes(pillar);
  const yearlyRows = getYearlyScores(pillar);
  const maxScore = Math.max(...yearlyRows.map((r) => r.score));

  return (
    <div className="revamp-luckPillarRow" data-current={pillar.isCurrent}>
      {/* ── Row Header (always visible, tappable) ── */}
      <button
        type="button"
        className="revamp-luckPillarRowHeader"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        {/* Left: age + current badge */}
        <div className="revamp-luckPillarAgeRange">
          <div
            className="revamp-luckPillarIndexDot"
            style={{ background: elemColour }}
          >
            {index + 1}
          </div>
          <div>
            <span className="revamp-luckPillarAge">Age {pillar.startAge}–{pillar.endAge}</span>
            {pillar.isCurrent && (
              <span className="revamp-luckPillarCurrentBadge">Current</span>
            )}
          </div>
        </div>

        {/* Centre: stem + branch + element */}
        <div className="revamp-luckPillarChars">
          <span className="revamp-luckPillarStem" title={pillar.stemEn}>{pillar.stem}</span>
          <span className="revamp-luckPillarBranch" title={pillar.branchEn}>{pillar.branch}</span>
          <span
            className="revamp-luckPillarElement"
            style={{ color: elemColour, borderColor: elemColour + "44", background: elemColour + "15" }}
          >
            {pillar.elementEn}
          </span>
        </div>

        {/* Right: ten god badges */}
        {pillar.stemTenGod && (
          <div className="revamp-luckPillarTenGods" onClick={(e) => e.stopPropagation()}>
            <TenGodBadge god={pillar.stemTenGod} theme={theme} gold={pillar.isCurrent} />
            {pillar.branchTenGod && pillar.branchTenGod !== pillar.stemTenGod && (
              <TenGodBadge god={pillar.branchTenGod} theme={theme} />
            )}
          </div>
        )}

        <span className="revamp-luckPillarChevron">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* ── Expanded Detail Panel ── */}
      {expanded && (
        <div className="revamp-luckPillarExpandPanel">

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--c-border)", marginBottom: 12 }}>
            {(["overview", "yearly", "domains"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "6px 4px", border: "none", background: "transparent",
                  fontSize: 11, fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? elemColour : "var(--c-text-muted)",
                  borderBottom: activeTab === tab ? `2px solid ${elemColour}` : "2px solid transparent",
                  cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {tab === "overview" ? "Overview" : tab === "yearly" ? "Year by Year" : "Life Domains"}
              </button>
            ))}
          </div>

          {/* ── Tab: Overview ── */}
          {activeTab === "overview" && (
            <>
              {/* Element energy ring + legend */}
              <div className="revamp-luckPillarElementRing">
                <svg className="revamp-luckPillarElementRingChart" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="var(--c-border)" strokeWidth="8" />
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke={elemColour}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 26 * 0.72} ${2 * Math.PI * 26}`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    opacity="0.85"
                  />
                  <text x="32" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill={elemColour}>
                    {pillar.element}
                  </text>
                </svg>
                <div className="revamp-luckPillarElementLegend">
                  <div className="revamp-luckPillarElementLegendRow">
                    <div className="revamp-luckPillarElementDot" style={{ background: elemColour }} />
                    <span className="revamp-luckPillarElementName">{pillar.elementEn} (Dominant)</span>
                    <span className="revamp-luckPillarElementVal">72%</span>
                  </div>
                  {pillar.stemTenGod && (
                    <div className="revamp-luckPillarElementLegendRow">
                      <div className="revamp-luckPillarElementDot" style={{ background: TEN_GOD_DESCRIPTIONS[pillar.stemTenGod].colour }} />
                      <span className="revamp-luckPillarElementName">{pillar.stemTenGod}</span>
                      <span className="revamp-luckPillarElementVal">Stem</span>
                    </div>
                  )}
                  {pillar.branchTenGod && (
                    <div className="revamp-luckPillarElementLegendRow">
                      <div className="revamp-luckPillarElementDot" style={{ background: TEN_GOD_DESCRIPTIONS[pillar.branchTenGod].colour }} />
                      <span className="revamp-luckPillarElementName">{pillar.branchTenGod}</span>
                      <span className="revamp-luckPillarElementVal">Branch</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis text */}
              <p className="revamp-luckPillarAnalysisText">{pillar.analysis}</p>

              {/* Fortune themes */}
              <div>
                <p className="revamp-luckPillarExpandSectionTitle">Fortune Themes</p>
                <div className="revamp-luckPillarThemes">
                  {themes.map((th, i) => (
                    <span key={i} className={`revamp-luckPillarThemeTag revamp-luckPillarThemeTag--${th.type}`}>
                      {th.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stem + Branch breakdown */}
              <div className="revamp-luckPillarBreakdown">
                {pillar.stemTenGod && (
                  <div className="revamp-luckPillarBreakdownItem">
                    <div className="revamp-luckPillarBreakdownHeader">
                      <span className="revamp-luckPillarBreakdownChar">{pillar.stem}</span>
                      <div>
                        <Text style={{ fontSize: "var(--fs-sm)", fontWeight: 700 }}>Stem · {pillar.stemEn}</Text>
                        <Text muted style={{ fontSize: "var(--fs-xs)" }}>→ {pillar.stemTenGod}</Text>
                      </div>
                    </div>
                    <Text muted style={{ fontSize: "var(--fs-xs)", lineHeight: 1.5 }}>
                      {TEN_GOD_DESCRIPTIONS[pillar.stemTenGod].role} — {TEN_GOD_DESCRIPTIONS[pillar.stemTenGod].nature}
                    </Text>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                      {TEN_GOD_DESCRIPTIONS[pillar.stemTenGod].keywords.map((kw) => (
                        <span key={kw} style={{
                          background: TEN_GOD_DESCRIPTIONS[pillar.stemTenGod!].colour + "22",
                          color: TEN_GOD_DESCRIPTIONS[pillar.stemTenGod!].colour,
                          borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 600,
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {pillar.branchTenGod && (
                  <div className="revamp-luckPillarBreakdownItem">
                    <div className="revamp-luckPillarBreakdownHeader">
                      <span className="revamp-luckPillarBreakdownChar">{pillar.branch}</span>
                      <div>
                        <Text style={{ fontSize: "var(--fs-sm)", fontWeight: 700 }}>Branch · {pillar.branchEn}</Text>
                        <Text muted style={{ fontSize: "var(--fs-xs)" }}>→ {pillar.branchTenGod}</Text>
                      </div>
                    </div>
                    <Text muted style={{ fontSize: "var(--fs-xs)", lineHeight: 1.5 }}>
                      {TEN_GOD_DESCRIPTIONS[pillar.branchTenGod].role} — {TEN_GOD_DESCRIPTIONS[pillar.branchTenGod].nature}
                    </Text>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                      {TEN_GOD_DESCRIPTIONS[pillar.branchTenGod].keywords.map((kw) => (
                        <span key={kw} style={{
                          background: TEN_GOD_DESCRIPTIONS[pillar.branchTenGod!].colour + "22",
                          color: TEN_GOD_DESCRIPTIONS[pillar.branchTenGod!].colour,
                          borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 600,
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {index === total - 1 && (
                <Text muted style={{ fontSize: "var(--fs-xs)", fontStyle: "italic", marginTop: 4 }}>
                  Future pillars beyond this point will be calculated as your chart evolves.
                </Text>
              )}
            </>
          )}

          {/* ── Tab: Year by Year ── */}
          {activeTab === "yearly" && (
            <div className="revamp-luckPillarYearTable">
              <p className="revamp-luckPillarExpandSectionTitle" style={{ marginBottom: 8 }}>
                Annual Fortune within this Pillar
              </p>
              {yearlyRows.map((row) => (
                <div key={row.age} className="revamp-luckPillarYearRow" data-current={row.isCurrent}>
                  <span className="revamp-luckPillarYearNum">Age {row.age}</span>
                  <div className="revamp-luckPillarYearBar">
                    <div
                      className="revamp-luckPillarYearBarFill"
                      style={{ width: `${(row.score / maxScore) * 100}%`, background: elemColour }}
                    />
                  </div>
                  <span className="revamp-luckPillarYearScore">{row.score}/100</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab: Life Domains ── */}
          {activeTab === "domains" && (
            <>
              <p className="revamp-luckPillarExpandSectionTitle" style={{ marginBottom: 8 }}>
                Domain Outlook for this Pillar
              </p>
              <div className="revamp-luckPillarDomains">
                {domainScores.map((d) => (
                  <div key={d.name} className="revamp-luckPillarDomainChip">
                    <span className="revamp-luckPillarDomainIcon">{d.icon}</span>
                    <span className="revamp-luckPillarDomainName">{d.name}</span>
                    <span
                      className="revamp-luckPillarDomainScore"
                      style={{ color: d.score >= 70 ? "var(--c-success)" : d.score >= 50 ? elemColour : "var(--c-text-muted)" }}
                    >
                      {d.score}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: "var(--c-text-muted)", marginTop: 8, lineHeight: 1.5 }}>
                Scores are relative indicators within this pillar period. Higher = more favourable energy in that domain.
              </p>
            </>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function LuckPillars() {
  const { theme } = usePreferences();
  const profile = getBaziProfileById("profile-1");

  if (!profile) {
    return (
      <Page>
        <PageCard>
          <ContentPageTopBar />
          <PageContent>
            <Stack gap="md" align="center">
              <Text muted>{t("common.noData")}</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  const { luckPillars } = profile;
  const currentIdx = luckPillars.findIndex((p) => p.isCurrent);

  return (
    <Page>
      <PageCard>
        <ContentPageTopBar />
        <PageContent>
          <Stack gap="lg">

            {/* ── Life Timeline Visual ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="bazi.luckPillars.title"
                iconKey="major_cycle"
                help={{ titleKey: "info.luckPillars.title", bodyKey: "info.luckPillars.body" }}
              />
              <LifeTimelineBar pillars={luckPillars} />
              {currentIdx >= 0 && (
                <Card style={{ marginTop: "var(--s-3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: ELEMENT_COLOURS[luckPillars[currentIdx].elementEn] + "33",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.4rem", fontWeight: 800,
                      color: ELEMENT_COLOURS[luckPillars[currentIdx].elementEn],
                      flexShrink: 0,
                    }}>
                      {luckPillars[currentIdx].stem}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 700, fontSize: "var(--fs-sm)" }}>
                        You are in Pillar {currentIdx + 1} of {luckPillars.length}
                      </Text>
                      <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                        Age {luckPillars[currentIdx].startAge}–{luckPillars[currentIdx].endAge} · {luckPillars[currentIdx].elementEn} phase
                      </Text>
                    </div>
                    <span style={{
                      background: "var(--c-accent)", color: "#fff",
                      borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700,
                    }}>Current</span>
                  </div>
                </Card>
              )}
            </PageSection>

            {/* ── Ten Gods Legend ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="info.tenGods.title"
                iconKey="ten_gods"
                help={{ titleKey: "info.tenGods.title", bodyKey: "info.tenGods.body" }}
              />
              <div className="revamp-tenGodsGrid">
                {(Object.keys(TEN_GOD_DESCRIPTIONS) as TenGodKey[]).map((god) => (
                  <div key={god} className="revamp-tenGodsLegendItem">
                    <img
                      src={getTenGodIconSrc(theme, god)}
                      alt={god}
                      className="revamp-tenGodsLegendIcon"
                    />
                    <span className="revamp-tenGodsLegendName">{god}</span>
                    <span className="revamp-tenGodsLegendRole">{TEN_GOD_DESCRIPTIONS[god].role}</span>
                  </div>
                ))}
              </div>
            </PageSection>

            {/* ── Luck Pillar Timeline ── */}
            <PageSection>
              <SectionTitleRow
                titleKey="bazi.luckPillars.timeline"
                iconKey="major_cycle"
                help={{ titleKey: "bazi.luckPillars.timeline", bodyKey: "info.luckPillarTimeline.body" }}
              />
              <Text muted style={{ fontSize: "var(--fs-xs)", marginBottom: "var(--s-3)" }}>
                {luckPillars.length} pillar{luckPillars.length !== 1 ? "s" : ""} calculated · Tap any row to expand
              </Text>
              <Stack gap="sm">
                {luckPillars.map((pillar, i) => (
                  <LuckPillarRow
                    key={`${pillar.startAge}-${pillar.endAge}`}
                    pillar={pillar}
                    theme={theme}
                    index={i}
                    total={luckPillars.length}
                  />
                ))}
              </Stack>
            </PageSection>

          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
