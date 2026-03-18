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
import { BaziPillarCard } from "../components/BaziPillarCard";
import { TrendIndicator } from "../components/TrendIndicator";
import { IconSectionHeader } from "../components/IconSectionHeader";
import { SectionInfoButton } from "../components/SectionInfoButton";
import { t } from "../i18n/t";
import { getYearlyForecast } from "../services/providers/baziProvider";
import type { YearlyForecast as YearlyForecastType, ZodiacPosition, SpecialStar } from "../services/mock/baziTypes";
import { getZodiacSrc, getIconSrc, getDestinySrc, type DestinyKey } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

// ─── Zodiac Position Badge ────────────────────────────────────────────────────
function ZodiacPositionBadge({ position, theme }: { position: ZodiacPosition; theme: "yin" | "yang" }) {
  const colorMap: Record<ZodiacPosition, string> = {
    head: "var(--c-success)",
    middle: "var(--c-primary)",
    tail: "var(--c-warning)",
  };
  const iconKeyMap: Record<ZodiacPosition, Parameters<typeof getIconSrc>[1]> = {
    head: "top_half",
    middle: "half",
    tail: "bottom_half",
  };
  const labelMap: Record<ZodiacPosition, string> = {
    head: t("yearly.zodiacPosition.head"),
    middle: t("yearly.zodiacPosition.middle"),
    tail: t("yearly.zodiacPosition.tail"),
  };
  const color = colorMap[position];
  const icon = getIconSrc(theme, iconKeyMap[position]);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-xs)",
        padding: "var(--space-xs) var(--space-sm)",
        background: `${color}22`,
        border: `1px solid ${color}55`,
        borderRadius: "var(--radius-full)",
        color,
        fontSize: "var(--fs-sm)",
        fontWeight: 700,
      }}
    >
      <img src={icon} alt="" aria-hidden="true" style={{ width: 16, height: 16 }} />
      {labelMap[position]}
    </div>
  );
}

// ─── Half-Year Score Card ─────────────────────────────────────────────────────
function HalfYearCard({
  half,
  score,
  analysis,
  iconSrc,
}: {
  half: "first" | "second";
  score: number;
  analysis: string;
  iconSrc: string;
}) {
  const scoreColor =
    score >= 80 ? "var(--c-success)" : score >= 60 ? "var(--c-primary)" : "var(--c-warning)";
  const label = half === "first" ? t("yearly.firstHalf") : t("yearly.secondHalf");
  const period = half === "first" ? t("yearly.firstHalfPeriod") : t("yearly.secondHalfPeriod");
  return (
    <Card>
      <Stack gap="sm">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <img src={iconSrc} alt="" aria-hidden="true" style={{ width: 24, height: 24 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontWeight: 700, fontSize: "var(--fs-md)" }}>{label}</Text>
              <span style={{ fontWeight: 800, fontSize: "var(--fs-xl)", color: scoreColor }}>
                {score}
              </span>
            </div>
            <Text muted style={{ fontSize: "var(--fs-xs)" }}>{period}</Text>
          </div>
        </div>
        {/* Score bar */}
        <div
          style={{
            height: 8,
            background: "var(--c-surface-2)",
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${score}%`,
              background: scoreColor,
              borderRadius: "var(--radius-full)",
            }}
          />
        </div>
        <Text muted style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>{analysis}</Text>
      </Stack>
    </Card>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function YearlyForecast() {
  const [forecast, setForecast] = React.useState<YearlyForecastType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { theme } = usePreferences();
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    async function loadForecast() {
      try {
        const data = await getYearlyForecast(currentYear);
        setForecast(data);
      } catch (error) {
        console.error("Failed to load forecast:", error);
      } finally {
        setIsLoading(false);
      }
    }
    void loadForecast();
  }, [currentYear]);

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

  if (!forecast) {
    return (
      <Page>
        <PageCard>
          <PageContent>
            <Stack gap="md" align="center">
              <Text>{t("yearly.noData")}</Text>
            </Stack>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  const zodiacAnimalKey = (forecast.zodiacAnimal ?? "horse").toLowerCase() as Parameters<typeof getZodiacSrc>[1];
  const zodiacSrc = getZodiacSrc(theme, zodiacAnimalKey);
  const topHalfIcon = getIconSrc(theme, "top_half");
  const bottomHalfIcon = getIconSrc(theme, "bottom_half");

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            {/* ── Header ── */}
            <PageHeader
              title={`${forecast.year} ${t("yearly.title")}`}
              subtitle={t("yearly.subtitle")}
              icon="year"
            />

            {/* ── Zodiac Reading ── */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconSectionHeader iconKey="zodiac_icon" title={t("yearly.zodiacReading")} />
                <SectionInfoButton title={t("yearly.zodiacReading")} body={t("info.zodiacReading.body")} />
              </div>
              <Card>
                <Stack gap="md">
                  {/* Animal + position badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "var(--radius-lg)",
                        background: "var(--c-surface-2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={zodiacSrc}
                        alt={forecast.zodiacAnimal}
                        style={{ width: 64, height: 64, objectFit: "contain" }}
                      />
                    </div>
                    <Stack gap="xs">
                      <Text style={{ fontWeight: 800, fontSize: "var(--fs-xl)" }}>
                        {forecast.zodiac}
                      </Text>
                      <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                        {forecast.year} {t("yearly.zodiacYear")}
                      </Text>
                      {forecast.zodiacPosition && (
                        <ZodiacPositionBadge position={forecast.zodiacPosition} theme={theme} />
                      )}
                    </Stack>
                  </div>

                  {/* Position description */}
                  {forecast.zodiacPositionDesc && (
                    <div
                      style={{
                        padding: "var(--space-sm) var(--space-md)",
                        background: "var(--c-surface-2)",
                        borderRadius: "var(--radius-md)",
                        borderLeft: "3px solid var(--c-primary)",
                      }}
                    >
                      <Text muted style={{ fontSize: "var(--fs-sm)", lineHeight: 1.6 }}>
                        {forecast.zodiacPositionDesc}
                      </Text>
                    </div>
                  )}

                  {/* Head / Middle / Tail legend */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "var(--space-xs)",
                    }}
                  >
                    {(["head", "middle", "tail"] as ZodiacPosition[]).map((pos) => {
                      const isActive = forecast.zodiacPosition === pos;
                      const colors: Record<ZodiacPosition, string> = {
                        head: "var(--c-success)",
                        middle: "var(--c-primary)",
                        tail: "var(--c-warning)",
                      };
                      const iconKeys: Record<ZodiacPosition, Parameters<typeof getIconSrc>[1]> = {
                        head: "top_half",
                        middle: "half",
                        tail: "bottom_half",
                      };
                      const labels: Record<ZodiacPosition, string> = {
                        head: t("yearly.zodiacPosition.head"),
                        middle: t("yearly.zodiacPosition.middle"),
                        tail: t("yearly.zodiacPosition.tail"),
                      };
                      const periods: Record<ZodiacPosition, string> = {
                        head: t("yearly.zodiacPosition.headPeriod"),
                        middle: t("yearly.zodiacPosition.middlePeriod"),
                        tail: t("yearly.zodiacPosition.tailPeriod"),
                      };
                      return (
                        <div
                          key={pos}
                          style={{
                            padding: "var(--space-xs)",
                            background: isActive ? `${colors[pos]}22` : "var(--c-surface-2)",
                            border: isActive ? `2px solid ${colors[pos]}` : "2px solid transparent",
                            borderRadius: "var(--radius-md)",
                            textAlign: "center",
                            opacity: isActive ? 1 : 0.5,
                          }}
                        >
                          <img
                            src={getIconSrc(theme, iconKeys[pos])}
                            alt=""
                            aria-hidden="true"
                            style={{ width: 20, height: 20, margin: "0 auto 4px", display: "block" }}
                          />
                          <Text
                            style={{
                              fontSize: "var(--fs-xs)",
                              fontWeight: 700,
                              color: isActive ? colors[pos] : undefined,
                              display: "block",
                            }}
                          >
                            {labels[pos]}
                          </Text>
                          <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                            {periods[pos]}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                </Stack>
              </Card>
            </PageSection>

            {/* ── Year Pillar ── */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconSectionHeader iconKey="annual_flow" title={t("yearly.yearPillar")} />
                <SectionInfoButton title={t("yearly.yearPillar")} body={t("info.yearPillar.body")} />
              </div>
              <div style={{ maxWidth: "200px", margin: "0 auto" }}>
                <BaziPillarCard
                  pillarName={forecast.year.toString()}
                  stem={forecast.yearPillar.stem}
                  stemEn={forecast.yearPillar.stemEn}
                  branch={forecast.yearPillar.branch}
                  branchEn={forecast.yearPillar.branchEn}
                  tenGod={forecast.yearPillar.tenGod}
                  element={forecast.yearPillar.elementEn}
                />
              </div>
            </PageSection>

            {/* ── Overview ── */}
            <PageSection>
              <Card>
                <Stack gap="sm">
                  <Text className="revamp-sectionTitle">{t("yearly.overview")}</Text>
                  <Text muted style={{ lineHeight: 1.6 }}>{forecast.overview}</Text>
                </Stack>
              </Card>
            </PageSection>

            {/* ── First Half / Second Half Luck Split ── */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconSectionHeader iconKey="half" title={t("yearly.luckSplit")} />
                <SectionInfoButton title={t("yearly.luckSplit")} body={t("info.luckSplit.body")} />
              </div>
              <Stack gap="md">
                <HalfYearCard
                  half="first"
                  score={forecast.firstHalfScore}
                  analysis={forecast.firstHalfAnalysis}
                  iconSrc={topHalfIcon}
                />
                <HalfYearCard
                  half="second"
                  score={forecast.secondHalfScore}
                  analysis={forecast.secondHalfAnalysis}
                  iconSrc={bottomHalfIcon}
                />
              </Stack>
            </PageSection>

            {/* ── Life Domains ── */}
            {forecast.lifeDomains && forecast.lifeDomains.length > 0 && (
              <PageSection>
                <IconSectionHeader iconKey="zodiac_icon" title={t("yearly.lifeDomains")} />
                <Stack gap="sm">
                  {forecast.lifeDomains.map((domain) => (
                    <Card key={domain.domain} style={{ opacity: domain.isPremium ? 0.65 : 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <img
                          src={getDestinySrc(theme, domain.domain as DestinyKey)}
                          alt={domain.domain}
                          style={{ width: 32, height: 32, flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontWeight: 700, textTransform: "capitalize" }}>
                              {t(`destiny.${domain.domain}`)}
                            </Text>
                            <TrendIndicator trend={domain.trend} />
                          </div>
                          {domain.isPremium ? (
                            <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                              🔒 {t("common.premiumRequired")}
                            </Text>
                          ) : (
                            <Text muted style={{ fontSize: "var(--fs-sm)" }}>
                              {domain.description}
                            </Text>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </Stack>
              </PageSection>
            )}

            {/* ── Luck & Avoid ── */}
            {(forecast.luck?.length > 0 || forecast.avoid?.length > 0) && (
              <PageSection>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "var(--space-md)",
                  }}
                >
                  {forecast.luck?.length > 0 && (
                    <Card>
                      <Stack gap="sm">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                          <img src={getIconSrc(theme, "luck")} alt="" style={{ width: 20, height: 20 }} />
                          <Text className="revamp-sectionTitle" style={{ color: "var(--c-success)" }}>
                            {t("yearly.luck")}
                          </Text>
                        </div>
                        {forecast.luck.map((item) => (
                          <div
                            key={item}
                            style={{
                              padding: "var(--space-xs) var(--space-sm)",
                              background: "var(--c-success-subtle)",
                              color: "var(--c-success)",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "var(--fs-sm)",
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </Stack>
                    </Card>
                  )}
                  {forecast.avoid?.length > 0 && (
                    <Card>
                      <Stack gap="sm">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                          <img src={getIconSrc(theme, "avoid")} alt="" style={{ width: 20, height: 20 }} />
                          <Text className="revamp-sectionTitle" style={{ color: "var(--c-warning)" }}>
                            {t("yearly.avoid")}
                          </Text>
                        </div>
                        {forecast.avoid.map((item) => (
                          <div
                            key={item}
                            style={{
                              padding: "var(--space-xs) var(--space-sm)",
                              background: "var(--c-warning-subtle)",
                              color: "var(--c-warning)",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "var(--fs-sm)",
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </Stack>
                    </Card>
                  )}
                </div>
              </PageSection>
            )}

            {/* ── Favorable & Unfavorable Months ── */}
            <PageSection>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "var(--space-md)",
                }}
              >
                <Card>
                  <Stack gap="sm">
                    <Text className="revamp-sectionTitle" style={{ color: "var(--c-success)" }}>
                      ✓ {t("yearly.favorableMonths")}
                    </Text>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
                      {forecast.favorableMonths.map((month) => (
                        <div
                          key={month}
                          style={{
                            padding: "var(--space-xs) var(--space-sm)",
                            background: "var(--c-success-subtle)",
                            color: "var(--c-success)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--fs-sm)",
                            fontWeight: 600,
                          }}
                        >
                          {t(`month.${month}`)}
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Card>
                <Card>
                  <Stack gap="sm">
                    <Text className="revamp-sectionTitle" style={{ color: "var(--c-warning)" }}>
                      ⚠ {t("yearly.unfavorableMonths")}
                    </Text>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
                      {forecast.unfavorableMonths.map((month) => (
                        <div
                          key={month}
                          style={{
                            padding: "var(--space-xs) var(--space-sm)",
                            background: "var(--c-warning-subtle)",
                            color: "var(--c-warning)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--fs-sm)",
                            fontWeight: 600,
                          }}
                        >
                          {t(`month.${month}`)}
                        </div>
                      ))}
                    </div>
                  </Stack>
                </Card>
              </div>
            </PageSection>

            {/* ── Protection Strategy ── */}
            {forecast.protectionStrategy && (
              <PageSection>
                <Card>
                  <Stack gap="sm">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                      <img src={getIconSrc(theme, "protection")} alt="" style={{ width: 20, height: 20 }} />
                      <Text className="revamp-sectionTitle">{t("yearly.protection")}</Text>
                    </div>
                    <Text muted style={{ lineHeight: 1.6 }}>{forecast.protectionStrategy}</Text>
                  </Stack>
                </Card>
              </PageSection>
            )}

            {/* ── Monthly Predictions ── */}
            <PageSection>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconSectionHeader iconKey="monthly_flow" title={t("yearly.monthlyPredictions")} />
                <SectionInfoButton title={t("yearly.monthlyPredictions")} body={t("info.monthlyPredictions.body")} />
              </div>
              <Stack gap="md">
                {forecast.monthlyPredictions.map((monthly) => {
                  const isFavorable = forecast.favorableMonths.includes(monthly.month);
                  const isUnfavorable = forecast.unfavorableMonths.includes(monthly.month);
                  const isCritical = forecast.criticalMonths?.includes(monthly.month);
                  const borderColor = isCritical
                    ? "var(--c-error)"
                    : isFavorable
                    ? "var(--c-success)"
                    : isUnfavorable
                    ? "var(--c-warning)"
                    : "transparent";
                  return (
                    <Card key={monthly.month} style={{ borderLeft: `3px solid ${borderColor}` }}>
                      <Stack gap="xs">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Text className="revamp-sectionTitle" style={{ fontSize: "var(--fs-md)" }}>
                            {t(`month.${monthly.month}`)}
                          </Text>
                          {isCritical && (
                            <img src={getIconSrc(theme, "exclamation_mark")} alt="critical" style={{ width: 16, height: 16 }} />
                          )}
                          {isFavorable && !isCritical && (
                            <img src={getIconSrc(theme, "up")} alt="favorable" style={{ width: 16, height: 16 }} />
                          )}
                        </div>
                        <Text muted>{monthly.prediction}</Text>
                        <Text muted style={{ fontSize: "var(--fs-xs)", fontStyle: "italic" }}>
                          {monthly.elementInteraction}
                        </Text>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
            </PageSection>

            {/* ── Special Stars ── */}
            {forecast.specialStars && forecast.specialStars.length > 0 && (
              <PageSection>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <IconSectionHeader iconKey="wisdom_star" title={t("yearly.specialStars")} />
                  <SectionInfoButton title={t("yearly.specialStars")} body={t("info.specialStars.body")} />
                </div>
                <Stack gap="sm">
                  {forecast.specialStars.map((star: SpecialStar) => {
                    const starIconKey = star.type === "wisdom"
                      ? "wisdom_star"
                      : star.type === "romance"
                      ? "romance_star"
                      : "special_influence";
                    const starColor = star.type === "wisdom"
                      ? "var(--c-primary)"
                      : star.type === "romance"
                      ? "#e91e8c"
                      : "var(--c-warning)";
                    return (
                      <Card key={star.name} style={{ opacity: star.isPremium ? 0.65 : 1 }}>
                        <Stack gap="sm">
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                            <img
                              src={getIconSrc(theme, starIconKey as any)}
                              alt=""
                              style={{ width: 32, height: 32, flexShrink: 0 }}
                            />
                            <div style={{ flex: 1 }}>
                              <Text style={{ fontWeight: 700, color: starColor }}>{star.name}</Text>
                              <Text muted style={{ fontSize: "var(--fs-xs)" }}>{star.description}</Text>
                            </div>
                            {star.isPremium && (
                              <span style={{
                                fontSize: "var(--fs-xs)",
                                padding: "2px 6px",
                                background: "var(--c-accent-subtle)",
                                color: "var(--c-accent)",
                                borderRadius: "var(--radius-full)",
                                fontWeight: 600,
                              }}>Premium</span>
                            )}
                          </div>
                          {star.isPremium ? (
                            <Text muted style={{ fontSize: "var(--fs-xs)" }}>
                              🔒 {t("common.premiumRequired")}
                            </Text>
                          ) : (
                            <div style={{
                              padding: "var(--space-xs) var(--space-sm)",
                              background: `${starColor}15`,
                              borderLeft: `3px solid ${starColor}`,
                              borderRadius: "var(--radius-sm)",
                            }}>
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

            {/* ── Luck Pillar Context ── */}
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
