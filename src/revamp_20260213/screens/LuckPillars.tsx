import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { SectionInfoButton } from "../components/SectionInfoButton";
import { t } from "../i18n/t";
import { getBaziProfileById } from "../services/mock/baziData";
import { usePreferences } from "../stores/preferencesStore";
import { getTenGodIconSrc, getIconSrc, type TenGodKey } from "../assets/assetMap";
import type { LuckPillar } from "../services/mock/baziTypes";

// Ten God descriptions for the popup
const TEN_GOD_DESCRIPTIONS: Record<TenGodKey, { role: string; nature: string; colour: string }> = {
  "Friend":           { role: "Peer / Ally",            nature: "Same element, same polarity as Day Master",  colour: "#4CAF50" },
  "Rob Wealth":       { role: "Competitor / Rival",      nature: "Same element, opposite polarity",            colour: "#F44336" },
  "Eating God":       { role: "Creative Output",         nature: "Element you produce, same polarity",         colour: "#9C27B0" },
  "Hurting Officer":  { role: "Rebellious Talent",       nature: "Element you produce, opposite polarity",     colour: "#E91E63" },
  "Direct Wealth":    { role: "Earned Wealth",           nature: "Element you control, opposite polarity",     colour: "#FF9800" },
  "Indirect Wealth":  { role: "Windfall / Investment",   nature: "Element you control, same polarity",         colour: "#FF5722" },
  "Direct Officer":   { role: "Authority / Career",      nature: "Element that controls you, opposite polarity", colour: "#2196F3" },
  "Seven Killings":   { role: "Power / Pressure",        nature: "Element that controls you, same polarity",   colour: "#F44336" },
  "Direct Resource":  { role: "Support / Mentor",        nature: "Element that produces you, opposite polarity", colour: "#00BCD4" },
  "Indirect Resource":{ role: "Wisdom / Intuition",      nature: "Element that produces you, same polarity",   colour: "#009688" },
};

function TenGodBadge({ god, theme, gold = false }: { god: TenGodKey; theme: "yin" | "yang"; gold?: boolean }) {
  const info = TEN_GOD_DESCRIPTIONS[god];
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className="revamp-tenGodBadge"
        data-gold={gold}
        onClick={() => setOpen(true)}
        title={god}
      >
        <img
          src={getTenGodIconSrc(theme, god, gold)}
          alt={god}
          className="revamp-tenGodBadgeIcon"
        />
        <span className="revamp-tenGodBadgeLabel">{god}</span>
      </button>
      {open && (
        <div className="revamp-infoPopupOverlay" onClick={() => setOpen(false)}>
          <div className="revamp-infoPopupSheet" onClick={e => e.stopPropagation()}>
            <div className="revamp-infoPopupHeader">
              <img src={getTenGodIconSrc(theme, god, gold)} alt={god} style={{ width: 40, height: 40 }} />
              <div>
                <div className="revamp-infoPopupTitle">{god}</div>
                <div className="revamp-infoPopupSubtitle">{info.role}</div>
              </div>
              <button type="button" className="revamp-infoPopupClose" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="revamp-infoPopupBody">
              <p>{info.nature}</p>
              {gold && <p style={{ color: "#B8860B", fontWeight: 600 }}>★ This is the dominant Ten God in your current Luck Pillar — its influence is amplified.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LuckPillarRow({ pillar, theme }: { pillar: LuckPillar; theme: "yin" | "yang" }) {
  const [expanded, setExpanded] = React.useState(pillar.isCurrent);
  const pillarQualityIcon = pillar.isCurrent ? "icon_life" : "icon_flow";

  return (
    <div
      className="revamp-luckPillarRow"
      data-current={pillar.isCurrent}
    >
      {/* Header row */}
      <button
        type="button"
        className="revamp-luckPillarRowHeader"
        onClick={() => setExpanded(p => !p)}
      >
        {/* Age range */}
        <div className="revamp-luckPillarAgeRange">
          <img
            src={getIconSrc(theme, pillarQualityIcon)}
            alt=""
            className="revamp-luckPillarQualityIcon"
          />
          <span className="revamp-luckPillarAge">
            Age {pillar.startAge}–{pillar.endAge}
          </span>
          {pillar.isCurrent && (
            <span className="revamp-luckPillarCurrentBadge">Current</span>
          )}
        </div>

        {/* Stem + Branch */}
        <div className="revamp-luckPillarChars">
          <span className="revamp-luckPillarStem" title={pillar.stemEn}>{pillar.stem}</span>
          <span className="revamp-luckPillarBranch" title={pillar.branchEn}>{pillar.branch}</span>
          <span className="revamp-luckPillarElement">{pillar.elementEn}</span>
        </div>

        {/* Ten God badges (stem) */}
        {pillar.stemTenGod && (
          <div className="revamp-luckPillarTenGods" onClick={e => e.stopPropagation()}>
            <TenGodBadge god={pillar.stemTenGod} theme={theme} gold={pillar.isCurrent} />
            {pillar.branchTenGod && pillar.branchTenGod !== pillar.stemTenGod && (
              <TenGodBadge god={pillar.branchTenGod} theme={theme} />
            )}
          </div>
        )}

        <span className="revamp-luckPillarChevron">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Expanded analysis */}
      {expanded && (
        <div className="revamp-luckPillarAnalysis">
          <Text muted style={{ fontSize: "var(--fs-sm)" }}>{pillar.analysis}</Text>
          {pillar.stemTenGod && (
            <div className="revamp-luckPillarTenGodDetail">
              <Text style={{ fontSize: "var(--fs-sm)", fontWeight: 600 }}>Stem: {pillar.stemEn} → {pillar.stemTenGod}</Text>
              <Text muted style={{ fontSize: "var(--fs-sm)" }}>{TEN_GOD_DESCRIPTIONS[pillar.stemTenGod].role} — {TEN_GOD_DESCRIPTIONS[pillar.stemTenGod].nature}</Text>
            </div>
          )}
          {pillar.branchTenGod && (
            <div className="revamp-luckPillarTenGodDetail">
              <Text style={{ fontSize: "var(--fs-sm)", fontWeight: 600 }}>Branch: {pillar.branchEn} → {pillar.branchTenGod}</Text>
              <Text muted style={{ fontSize: "var(--fs-sm)" }}>{TEN_GOD_DESCRIPTIONS[pillar.branchTenGod].role} — {TEN_GOD_DESCRIPTIONS[pillar.branchTenGod].nature}</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function LuckPillars() {
  const { theme } = usePreferences();
  const profile = getBaziProfileById("profile-1");

  if (!profile) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <Stack gap="md" align="center">
              <Text>No profile found</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  const { luckPillars } = profile;

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            {/* Header */}
            <PageHeader
              title={t("bazi.luckPillars.title")}
              subtitle={t("bazi.luckPillars.subtitle")}
              icon="lucktrend"
            />

            {/* What are Luck Pillars */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <img
                  src={getIconSrc(theme, "major_cycle")}
                  alt=""
                  style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Text style={{ fontWeight: 600 }}>{t("info.luckPillars.title")}</Text>
                    <SectionInfoButton
                      title={t("info.luckPillars.title")}
                      body={t("info.luckPillars.body")}
                    />
                  </div>
                  <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                    Each 10-year Luck Pillar brings a Heavenly Stem and Earthly Branch that interact with your Day Master, shaping the quality of that decade. Tap any pillar to see the Ten Gods in play.
                  </Text>
                </div>
              </div>
            </PageSection>

            {/* Ten Gods Legend */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <img src={getIconSrc(theme, "ten_gods")} alt="" style={{ width: 22, height: 22 }} />
                <Text style={{ fontWeight: 600 }}>{t("info.tenGods.title")}</Text>
                <SectionInfoButton
                  title={t("info.tenGods.title")}
                  body={t("info.tenGods.body")}
                />
              </div>
              <div className="revamp-tenGodsGrid">
                {(Object.keys(TEN_GOD_DESCRIPTIONS) as TenGodKey[]).map(god => (
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

            {/* Luck Pillars Timeline */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Text style={{ fontWeight: 600 }}>{t("bazi.luckPillars.timeline")}</Text>
                <SectionInfoButton
                  title={t("bazi.luckPillars.timeline")}
                  body={t("info.luckPillarTimeline.body")}
                />
              </div>
              <Stack gap="sm">
                {luckPillars.map((pillar) => (
                  <LuckPillarRow
                    key={`${pillar.startAge}-${pillar.endAge}`}
                    pillar={pillar}
                    theme={theme}
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
