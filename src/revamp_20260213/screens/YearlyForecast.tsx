import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { ContentPageTopBar } from "../components/ContentPageTopBar";
import { PageSection } from "../components/PageSection";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { BaziPillarCard } from "../components/BaziPillarCard";
import { TrendIndicator } from "../components/TrendIndicator";
import { t } from "../i18n/t";
import { getYearlyForecast } from "../services/providers/baziProvider";
import type { YearlyForecast as YearlyForecastType, ZodiacPosition, SpecialStar } from "../services/mock/baziTypes";
import { getZodiacSrc, getIconSrc, getDestinySrc, type DestinyKey } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

function ZodiacPositionBadge({ position, theme }: { position: ZodiacPosition; theme: "yin" | "yang" }) {
  const colorMap: Record<ZodiacPosition, string> = {
    head: "var(--c-success)", middle: "var(--c-primary)", tail: "var(--c-warning)",
  };
  const iconKeyMap: Record<ZodiacPosition, Parameters<typeof getIconSrc>[1]> = {
    head: "top_half", middle: "half", tail: "bottom_half",
  };
  const labelMap: Record<ZodiacPosition, string> = {
    head: t("yearly.zodiacPosition.head"),
    middle: t("yearly.zodiacPosition.middle"),
    tail: t("yearly.zodiacPosition.tail"),
  };
  const color = colorMap[position];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-xs)",
      padding: "var(--space-xs) var(--space-sm)", background: `${color}22`,
      border: `1px solid ${color}55`, borderRadius: "var(--radius-full)",
      color, fontSize: "var(--fs-sm)", fontWeight: 700,
    }}>
      <img src={getIconSrc(theme, iconKeyMap[position])} alt="" aria-hidden="true" style={{ width: 16, height: 16 }} />
      {labelMap[position]}
    </div>
  );
}

function MonthlyLineChart({
  data, selectedMonth, onSelectMonth, isPremium, favorableMonths, unfavorableMonths, criticalMonths,
}: {
  data: { month: number; score: number; isPremium?: boolean }[];
  selectedMonth: number | null;
  onSelectMonth: (m: number) => void;
  isPremium: boolean;
  favorableMonths: number[];
  unfavorableMonths: number[];
  criticalMonths: number[];
}) {
  const W = 320, H = 140;
  const PAD = { top: 16, right: 16, bottom: 28, left: 28 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const ABBR = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const points = data.map((d, i) => {
    const x = PAD.left + (i / (data.length - 1)) * cW;
    const displayScore = (!isPremium && d.isPremium) ? 50 : d.score;
    const y = PAD.top + cH - (displayScore / 100) * cH;
    return { x, y, ...d, displayScore };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fillD = pathD + ` L ${points[points.length-1].x} ${PAD.top + cH} L ${points[0].x} ${PAD.top + cH} Z`;
  const lockedStart = points.find(p => p.isPremium && !isPremium);
  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", maxWidth: "100%" }}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--c-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--c-primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[25,50,75].map(v => {
          const y = PAD.top + cH - (v/100)*cH;
          return <line key={v} x1={PAD.left} y1={y} x2={PAD.left+cW} y2={y} stroke="var(--c-border)" strokeWidth="0.5" strokeDasharray="3 3" />;
        })}
        {[25,50,75,100].map(v => {
          const y = PAD.top + cH - (v/100)*cH;
          return <text key={v} x={PAD.left-4} y={y+4} textAnchor="end" fontSize="8" fill="var(--c-text-muted)">{v}</text>;
        })}
        <path d={fillD} fill="url(#cg)" />
        <path d={pathD} fill="none" stroke="var(--c-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {lockedStart && !isPremium && (
          <line x1={lockedStart.x-8} y1={PAD.top} x2={lockedStart.x-8} y2={PAD.top+cH}
            stroke="var(--c-warning)" strokeWidth="1" strokeDasharray="4 2" />
        )}
        {points.map((p) => {
          const isLocked = p.isPremium && !isPremium;
          const isSelected = selectedMonth === p.month;
          const isFav = favorableMonths.includes(p.month);
          const isCrit = criticalMonths.includes(p.month);
          const dotColor = isCrit ? "#e53e3e" : isFav ? "var(--c-success)" : "var(--c-primary)";
          return (
            <g key={p.month} onClick={() => onSelectMonth(p.month)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={isSelected ? 7 : 5}
                fill={isLocked ? "var(--c-border)" : dotColor}
                stroke={isSelected ? "var(--c-text)" : "var(--c-bg)"}
                strokeWidth={isSelected ? 2 : 1.5}
                opacity={isLocked ? 0.5 : 1}
              />
              <text x={p.x} y={PAD.top+cH+14} textAnchor="middle" fontSize="9"
                fill={isSelected ? "var(--c-text)" : "var(--c-text-muted)"}
                fontWeight={isSelected ? "700" : "400"}>
                {ABBR[p.month-1]}
              </text>
              {isLocked && <text x={p.x} y={p.y+4} textAnchor="middle" fontSize="8" fill="var(--c-text-muted)">&#x1F512;</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function YearlyForecast() {
  const [forecast, setForecast] = React.useState<YearlyForecastType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { theme, isPremium } = usePreferences();
  const currentYear = new Date().getFullYear();
  const [halfYear, setHalfYear] = React.useState<"first" | "second">("first");
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

  React.useEffect(() => {
    async function loadForecast() {
      try {
        const data = await getYearlyForecast(currentYear);
        setForecast(data);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }
    void loadForecast();
  }, [currentYear]);

  if (isLoading) return <Page><PageCard><PageContent><Stack gap="md" align="center"><Text>{t("common.loading")}</Text></Stack></PageContent></PageCard><FloatingRadialNav /></Page>;
  if (!forecast) return <Page><PageCard><PageContent><Stack gap="md" align="center"><Text>{t("yearly.noData")}</Text></Stack></PageContent></PageCard><FloatingRadialNav /></Page>;

  const zodiacAnimalKey = (forecast.zodiacAnimal ?? "horse").toLowerCase() as Parameters<typeof getZodiacSrc>[1];
  const zodiacSrc = getZodiacSrc(theme, zodiacAnimalKey);
  const topHalfIcon = getIconSrc(theme, "top_half");
  const bottomHalfIcon = getIconSrc(theme, "bottom_half");
  const selectedMonthData = selectedMonth ? forecast.monthlyPredictions.find(m => m.month === selectedMonth) : null;
  const isSelectedLocked = selectedMonthData?.isPremium && !isPremium;
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <Page>
      <PageCard>
        <ContentPageTopBar />
        <PageContent>
          <Stack gap="lg">

            <PageSection>
              <SectionTitleRow titleKey="yearly.zodiacReading" iconKey="zodiac_icon"
                help={{ titleKey: "yearly.zodiacReading", bodyKey: "info.zodiacReading.body" }} />
              <Card>
                <Stack gap="md">
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <img src={zodiacSrc} alt={forecast.zodiacAnimal}
                      style={{ width: 72, height: 72, objectFit: "contain", flexShrink: 0 }} />
                    <Stack gap="xs">
                      <Text style={{ fontWeight: 800, fontSize: "var(--fs-xl)" }}>{forecast.zodiac}</Text>
                      <Text muted style={{ fontSize: "var(--fs-sm)" }}>{forecast.year} {t("yearly.zodiacYear")}</Text>
                      {forecast.zodiacPosition && <ZodiacPositionBadge position={forecast.zodiacPosition} theme={theme} />}
                    </Stack>
                  </div>
                  {forecast.zodiacPositionDesc && (
                    <div style={{ padding: "var(--space-sm) var(--space-md)", background: "var(--c-surface-2)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--c-primary)" }}>
                      <Text muted style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>{forecast.zodiacPositionDesc}</Text>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-xs)" }}>
                    {(["head","middle","tail"] as ZodiacPosition[]).map((pos) => {
                      const isActive = forecast.zodiacPosition === pos;
                      const colors: Record<ZodiacPosition,string> = { head: "var(--c-success)", middle: "var(--c-primary)", tail: "var(--c-warning)" };
                      const iconKeys: Record<ZodiacPosition, Parameters<typeof getIconSrc>[1]> = { head: "top_half", middle: "half", tail: "bottom_half" };
                      const labels: Record<ZodiacPosition,string> = { head: t("yearly.zodiacPosition.head"), middle: t("yearly.zodiacPosition.middle"), tail: t("yearly.zodiacPosition.tail") };
                      const periods: Record<ZodiacPosition,string> = { head: t("yearly.zodiacPosition.headPeriod"), middle: t("yearly.zodiacPosition.middlePeriod"), tail: t("yearly.zodiacPosition.tailPeriod") };
                      return (
                        <div key={pos} style={{ padding: "var(--space-xs)", background: isActive ? `${colors[pos]}22` : "var(--c-surface-2)", border: isActive ? `2px solid ${colors[pos]}` : "2px solid transparent", borderRadius: "var(--radius-md)", textAlign: "center", opacity: isActive ? 1 : 0.5 }}>
                          <img src={getIconSrc(theme, iconKeys[pos])} alt="" aria-hidden="true" style={{ width: 20, height: 20, margin: "0 auto 4px", display: "block" }} />
                          <Text style={{ fontSize: "var(--fs-xs)", fontWeight: 700, color: isActive ? colors[pos] : undefined, display: "block" }}>{labels[pos]}</Text>
                          <Text muted style={{ fontSize: "var(--fs-xs)" }}>{periods[pos]}</Text>
                        </div>
                      );
                    })}
                  </div>
                </Stack>
              </Card>
            </PageSection>

            <PageSection>
              <SectionTitleRow titleKey="yearly.yearPillar" iconKey="annual_flow"
                help={{ titleKey: "yearly.yearPillar", bodyKey: "info.yearPillar.body" }} />
              <div style={{ maxWidth: "200px", margin: "0 auto" }}>
                <BaziPillarCard pillarName={forecast.year.toString()} stem={forecast.yearPillar.stem} stemEn={forecast.yearPillar.stemEn} branch={forecast.yearPillar.branch} branchEn={forecast.yearPillar.branchEn} tenGod={forecast.yearPillar.tenGod} element={forecast.yearPillar.elementEn} />
              </div>
            </PageSection>

            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text className="revamp-sectionTitle">{t("yearly.overview")}</Text>
                  <Text muted style={{ lineHeight: 1.6 }}>{forecast.overview}</Text>
                </Stack>
              </Card>
            </PageSection>

            <PageSection>
              <SectionTitleRow titleKey="yearly.luckSplit" iconKey="half"
                help={{ titleKey: "yearly.luckSplit", bodyKey: "info.luckSplit.body" }} />
              <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                {(["first","second"] as const).map((half) => {
                  const isSecond = half === "second";
                  const locked = isSecond && !isPremium;
                  const active = halfYear === half;
                  return (
                    <button key={half} onClick={() => { if (!locked) setHalfYear(half); }}
                      style={{ flex: 1, padding: "var(--space-sm) var(--space-md)", borderRadius: "var(--radius-md)", border: "2px solid", borderColor: active ? "var(--c-primary)" : "var(--c-border)", background: active ? "var(--c-primary)" : "var(--c-surface-2)", color: active ? "var(--c-bg)" : "var(--c-text)", fontWeight: 700, fontSize: "var(--fs-sm)", cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xs)" }}>
                      <img src={isSecond ? bottomHalfIcon : topHalfIcon} alt="" style={{ width: 16, height: 16 }} />
                      {isSecond ? t("yearly.secondHalf") : t("yearly.firstHalf")}
                      {locked && <span style={{ fontSize: "var(--fs-xs)" }}>&#x1F512;</span>}
                    </button>
                  );
                })}
              </div>
              <Card>
                <Stack gap="sm">
                  {(() => {
                    const score = halfYear === "first" ? forecast.firstHalfScore : forecast.secondHalfScore;
                    const analysis = halfYear === "first" ? forecast.firstHalfAnalysis : forecast.secondHalfAnalysis;
                    const period = halfYear === "first" ? t("yearly.firstHalfPeriod") : t("yearly.secondHalfPeriod");
                    const scoreColor = score >= 70 ? "var(--c-success)" : "var(--c-warning)";
                    return (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Text style={{ fontWeight: 700 }}>{halfYear === "first" ? t("yearly.firstHalf") : t("yearly.secondHalf")}</Text>
                          <span style={{ fontWeight: 800, fontSize: "var(--fs-xl)", color: scoreColor }}>{score}</span>
                        </div>
                        <Text muted style={{ fontSize: "var(--fs-xs)" }}>{period}</Text>
                        <div style={{ height: 8, background: "var(--c-surface-2)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${score}%`, background: scoreColor, borderRadius: "var(--radius-full)", transition: "width 0.6s ease" }} />
                        </div>
                        <Text muted style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>{analysis}</Text>
                      </>
                    );
                  })()}
                </Stack>
              </Card>
            </PageSection>

            <PageSection>
              <SectionTitleRow titleKey="yearly.monthlyPredictions" iconKey="annual_flow"
                help={{ titleKey: "yearly.monthlyPredictions", bodyKey: "info.monthlyPredictions.body" }} />
              <Card>
                <Stack gap="sm">
                  <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                    {t("yearly.monthlyChartHint")}
                    {!isPremium && <span style={{ marginLeft: 4, color: "var(--c-warning)" }}> {t("yearly.monthlyChartPremiumHint")}</span>}
                  </Text>
                  <MonthlyLineChart data={forecast.monthlyPredictions} selectedMonth={selectedMonth}
                    onSelectMonth={(m) => setSelectedMonth(prev => prev === m ? null : m)}
                    isPremium={isPremium} favorableMonths={forecast.favorableMonths}
                    unfavorableMonths={forecast.unfavorableMonths} criticalMonths={forecast.criticalMonths} />
                  <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", marginTop: "var(--space-xs)" }}>
                    {([["var(--c-success)", "yearly.favorable"], ["#e53e3e", "yearly.critical"], ["var(--c-primary)", "yearly.neutral"]] as [string,string][]).map(([color, key]) => (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--fs-xs)", color }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />{t(key)}
                      </div>
                    ))}
                  </div>
                </Stack>
              </Card>
              {selectedMonth && selectedMonthData && (
                <Card style={{ marginTop: "var(--space-sm)", border: "1.5px solid var(--c-primary)" }}>
                  <Stack gap="sm">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontWeight: 700 }}>{MONTH_NAMES[selectedMonth-1]}</Text>
                      <button onClick={() => setSelectedMonth(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--fs-lg)", color: "var(--c-text-muted)" }} aria-label="Close">x</button>
                    </div>
                    {isSelectedLocked ? (
                      <div style={{ textAlign: "center", padding: "var(--space-md)" }}>
                        <div style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--space-xs)" }}>&#x1F512;</div>
                        <Text muted style={{ fontSize: "var(--fs-sm)" }}>{t("common.premiumRequired")}</Text>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                          <span style={{ fontWeight: 800, fontSize: "var(--fs-2xl)", color: selectedMonthData.score >= 70 ? "var(--c-success)" : selectedMonthData.score >= 50 ? "var(--c-primary)" : "var(--c-warning)" }}>{selectedMonthData.score}</span>
                          <Text muted style={{ fontSize: "var(--fs-xs)" }}>/100</Text>
                        </div>
                        <Text style={{ lineHeight: 1.6 }}>{selectedMonthData.prediction}</Text>
                        <div style={{ padding: "var(--space-xs) var(--space-sm)", background: "var(--c-surface-2)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--c-primary)" }}>
                          <Text muted style={{ fontSize: "var(--fs-xs)", fontStyle: "italic" }}>{selectedMonthData.elementInteraction}</Text>
                        </div>
                      </>
                    )}
                  </Stack>
                </Card>
              )}
            </PageSection>

            {forecast.lifeDomains && forecast.lifeDomains.length > 0 && (
              <PageSection>
                <SectionTitleRow titleKey="yearly.lifeDomains" iconKey="zodiac_icon"
                  help={{ titleKey: "yearly.lifeDomains", bodyKey: "info.lifeDomains.body" }} />
                <Stack gap="sm">
                  {forecast.lifeDomains.map((domain) => (
                    <Card key={domain.domain}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <img src={getDestinySrc(theme, domain.domain as DestinyKey)} alt={domain.domain} style={{ width: 32, height: 32, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontWeight: 700, textTransform: "capitalize" }}>{t(`destiny.${domain.domain}`)}</Text>
                            <TrendIndicator trend={domain.trend} />
                          </div>
                          {domain.isPremium && !isPremium ? (
                            <Text muted style={{ fontSize: "var(--fs-xs)" }}>&#x1F512; {t("common.premiumRequired")}</Text>
                          ) : (
                            <Text muted style={{ fontSize: "var(--fs-sm)" }}>{domain.description}</Text>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </Stack>
              </PageSection>
            )}

            {(forecast.luck?.length > 0 || forecast.avoid?.length > 0) && (
              <PageSection>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-md)" }}>
                  {forecast.luck?.length > 0 && (
                    <Card>
                      <Stack gap="sm">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                          <img src={getIconSrc(theme, "luck")} alt="" style={{ width: 20, height: 20 }} />
                          <Text className="revamp-sectionTitle" style={{ color: "var(--c-success)" }}>{t("yearly.luck")}</Text>
                        </div>
                        {forecast.luck.map((item) => (
                          <div key={item} style={{ padding: "var(--space-xs) var(--space-sm)", background: "var(--c-success-subtle)", color: "var(--c-success)", borderRadius: "var(--radius-sm)", fontSize: "var(--fs-sm)" }}>{item}</div>
                        ))}
                      </Stack>
                    </Card>
                  )}
                  {forecast.avoid?.length > 0 && (
                    <Card>
                      <Stack gap="sm">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                          <img src={getIconSrc(theme, "avoid")} alt="" style={{ width: 20, height: 20 }} />
                          <Text className="revamp-sectionTitle" style={{ color: "var(--c-warning)" }}>{t("yearly.avoid")}</Text>
                        </div>
                        {forecast.avoid.map((item) => (
                          <div key={item} style={{ padding: "var(--space-xs) var(--space-sm)", background: "var(--c-warning-subtle)", color: "var(--c-warning)", borderRadius: "var(--radius-sm)", fontSize: "var(--fs-sm)" }}>{item}</div>
                        ))}
                      </Stack>
                    </Card>
                  )}
                </div>
              </PageSection>
            )}

            {forecast.specialStars && forecast.specialStars.length > 0 && (
              <PageSection>
                <SectionTitleRow titleKey="yearly.specialStars" iconKey="wisdom_star"
                  help={{ titleKey: "yearly.specialStars", bodyKey: "info.specialStars.body" }} />
                <Stack gap="sm">
                  {forecast.specialStars.map((star: SpecialStar) => {
                    const starIconKey = star.type === "wisdom" ? "wisdom_star" : star.type === "romance" ? "romance_star" : "special_influence";
                    const starColor = star.type === "wisdom" ? "var(--c-primary)" : star.type === "romance" ? "#e91e8c" : "var(--c-warning)";
                    const isLocked = star.isPremium && !isPremium;
                    return (
                      <Card key={star.name}>
                        <Stack gap="sm">
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                            <img src={getIconSrc(theme, starIconKey as any)} alt="" style={{ width: 32, height: 32, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <Text style={{ fontWeight: 700, color: starColor }}>{star.name}</Text>
                              <Text muted style={{ fontSize: "var(--fs-xs)" }}>{star.description}</Text>
                            </div>
                            {star.isPremium && <span style={{ fontSize: "var(--fs-xs)", padding: "2px 6px", background: "var(--c-accent-subtle)", color: "var(--c-accent)", borderRadius: "var(--radius-full)", fontWeight: 600 }}>Premium</span>}
                          </div>
                          {isLocked ? (
                            <Text muted style={{ fontSize: "var(--fs-xs)" }}>&#x1F512; {t("common.premiumRequired")}</Text>
                          ) : (
                            <div style={{ padding: "var(--space-xs) var(--space-sm)", background: `${starColor}15`, borderLeft: `3px solid ${starColor}`, borderRadius: "var(--radius-sm)" }}>
                              <Text style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>{star.impact}</Text>
                            </div>
                          )}
                        </Stack>
                      </Card>
                    );
                  })}
                </Stack>
              </PageSection>
            )}

            {forecast.luckPillarContext && (
              <PageSection>
                <Card>
                  <Stack gap="sm">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                      <img src={getIconSrc(theme, "major_cycle")} alt="" style={{ width: 20, height: 20 }} />
                      <Text className="revamp-sectionTitle">{t("yearly.luckPillarContext")}</Text>
                    </div>
                    <Text muted style={{ lineHeight: 1.6 }}>{forecast.luckPillarContext}</Text>
                  </Stack>
                </Card>
              </PageSection>
            )}

          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
