import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  getDestinySrc,
  getElementSrc,
  getIconSrc,
  type DestinyKey,
  type ElementKey,
} from "../assets/assetMap";
import { Button } from "../components/Button";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { SectionTitleRow } from "../components/SectionTitleRow";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { useServices } from "../services";
import type { MonthlyDomainKey, MonthlyPayload, Trend } from "../services/types";
import { usePreferences } from "../stores/preferencesStore";

const DOMAIN_ORDER: MonthlyDomainKey[] = [
  "work",
  "wealth",
  "relationship",
  "health",
  "study",
  "family",
  "talent",
];

const TREND_SYMBOLS: Record<Trend, string> = {
  up: "↑",
  flat: "→",
  down: "↓",
};

function getElementLabel(element: ElementKey) {
  return t(`home.elements.${element}`);
}

export function Monthly() {
  const navigate = useNavigate();
  const services = useServices();
  const { theme, isPremium } = usePreferences();
  const [payload, setPayload] = React.useState<MonthlyPayload | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isActive = true;

    const loadMonthly = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await services.monthly.getMonthly();
        if (isActive) {
          setPayload(response);
        }
      } catch (err) {
        console.error("Failed to load monthly payload", err);
        if (isActive) {
          setError(t("common.errorUnknownDetail"));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadMonthly();

    return () => {
      isActive = false;
    };
  }, [services]);

  const orderedDomains = React.useMemo(() => {
    if (!payload) {
      return [];
    }
    const domainMap = new Map(payload.domains.map((domain) => [domain.key, domain]));
    return DOMAIN_ORDER.map((key) => domainMap.get(key)).filter(
      (domain): domain is MonthlyPayload["domains"][number] => Boolean(domain),
    );
  }, [payload]);

  const headerTitle = payload
    ? `${payload.monthTitle} · ${payload.chineseMonthLabel}`
    : t("common.loading");
  const dayMasterElement = payload?.interaction.dayMaster as ElementKey | undefined;
  const dayMasterLabel = dayMasterElement ? getElementLabel(dayMasterElement) : "";
  const headerSubtitle = payload
    ? t("monthly.header.subtitle", {
        dayMaster: dayMasterLabel,
        interaction: payload.interaction.interactionLabel,
      })
    : undefined;
  const headerIconSrc = getIconSrc(theme, "monthly_flow");
  const dayMasterIconSrc = dayMasterElement
    ? getElementSrc(theme, dayMasterElement, "mono")
    : null;

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            <PageHeader
              title={headerTitle}
              subtitle={
                headerSubtitle ? (
                  <span className="revamp-monthlySubtitle">
                    {dayMasterIconSrc ? (
                      <img
                        className="icon-sm"
                        src={dayMasterIconSrc}
                        alt=""
                        aria-hidden="true"
                      />
                    ) : null}
                    <span>{headerSubtitle}</span>
                  </span>
                ) : undefined
              }
              icon={
                <img
                  className="icon-md"
                  src={headerIconSrc}
                  alt=""
                  aria-hidden="true"
                />
              }
            />
            {isLoading ? <Text muted>{t("common.loading")}</Text> : null}
            {error ? <Text>{error}</Text> : null}
            {payload ? (
              <>
                <PageSection
                  title={<SectionTitleRow titleKey="monthly.overview.title" />}
                >
                  <Text muted>{payload.overview}</Text>
                </PageSection>

                <PageSection
                  title={
                    <SectionTitleRow
                      titleKey="monthly.luckAvoid.title"
                      iconKey="luck"
                      secondaryIconKey="avoid"
                    />
                  }
                >
                  <div className="revamp-monthlyLuckAvoid">
                    <div className="revamp-listCard">
                      <Stack gap="xs" align="start">
                        <Text className="revamp-sectionTitle">
                          {t("monthly.luck.title")}
                        </Text>
                        <ul className="revamp-monthlyList">
                          {payload.luck.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Stack>
                    </div>
                    <div className="revamp-listCard">
                      <Stack gap="xs" align="start">
                        <Text className="revamp-sectionTitle">
                          {t("monthly.avoid.title")}
                        </Text>
                        <ul className="revamp-monthlyList">
                          {payload.avoid.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </Stack>
                    </div>
                  </div>
                </PageSection>

                <PageSection
                  title={
                    <div className="revamp-sectionTitleRow">
                      <img
                        className="revamp-sectionTitleIcon"
                        src={getElementSrc(theme, "wood", "mono")}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className="revamp-sectionTitleLabel">
                        {t("monthly.fortune.title")}
                      </span>
                    </div>
                  }
                >
                  <div className="revamp-listCard">
                    <Stack gap="sm" align="start">
                      <div className="revamp-fortuneRow">
                        <Text muted>{t("monthly.fortune.luckyColor")}</Text>
                        <span className="revamp-fortuneValue">
                          <span
                            className="revamp-colorDot"
                            style={{ backgroundColor: payload.fortune.luckyColorHex }}
                          />
                          <Text>{payload.fortune.luckyColorHex}</Text>
                        </span>
                      </div>
                      <div className="revamp-fortuneRow">
                        <Text muted>{t("monthly.fortune.luckyNumber")}</Text>
                        <span className="revamp-badge">
                          {payload.fortune.luckyNumber}
                        </span>
                      </div>
                      <div className="revamp-fortuneRow">
                        <Text muted>{t("monthly.fortune.activeElement")}</Text>
                        <span className="revamp-fortuneValue">
                          <img
                            className="icon-sm"
                            src={getElementSrc(
                              theme,
                              payload.fortune.activeElement as ElementKey,
                              "mono",
                            )}
                            alt=""
                            aria-hidden="true"
                          />
                          <Text>
                            {getElementLabel(
                              payload.fortune.activeElement as ElementKey,
                            )}
                          </Text>
                        </span>
                      </div>
                      <div className="revamp-fortuneRow">
                        <Text muted>{t("monthly.fortune.weakElement")}</Text>
                        <span className="revamp-fortuneValue">
                          <img
                            className="icon-sm"
                            src={getElementSrc(
                              theme,
                              payload.fortune.weakElement as ElementKey,
                              "mono",
                            )}
                            alt=""
                            aria-hidden="true"
                          />
                          <Text>
                            {getElementLabel(
                              payload.fortune.weakElement as ElementKey,
                            )}
                          </Text>
                        </span>
                      </div>
                    </Stack>
                  </div>
                </PageSection>

                <PageSection
                  title={
                    <SectionTitleRow titleKey="monthly.domains.title" iconKey="lucktrend" />
                  }
                >
                  <Stack gap="sm">
                    {orderedDomains.map((domain) => {
                      const isLocked = Boolean(domain.isPremiumLocked) && !isPremium;
                      const summaryText = isLocked
                        ? t("monthly.domains.locked")
                        : domain.summary;
                      const iconSrc = getDestinySrc(
                        theme,
                        domain.key as DestinyKey,
                      );

                      return (
                        <div key={domain.key} className="revamp-listCard">
                          <Stack gap="xs" align="start">
                            <div className="revamp-domainRow">
                              <img
                                className="icon-sm"
                                src={iconSrc}
                                alt=""
                                aria-hidden="true"
                              />
                              <Text>{t(`monthly.domain.${domain.key}`)}</Text>
                              <span className="revamp-domainTrend">
                                {TREND_SYMBOLS[domain.trend]}
                              </span>
                            </div>
                            <Text
                              className={
                                isLocked
                                  ? "revamp-domainSummary revamp-locked"
                                  : "revamp-domainSummary"
                              }
                              muted={!isLocked}
                            >
                              {summaryText}
                            </Text>
                            {isLocked ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/premium")}
                              >
                                {t("monthly.domains.unlockCta")}
                              </Button>
                            ) : null}
                          </Stack>
                        </div>
                      );
                    })}
                  </Stack>
                </PageSection>

                <PageSection
                  title={
                    <SectionTitleRow
                      titleKey="monthly.interaction.title"
                      iconKey="monthly_flow"
                    />
                  }
                >
                  <div className="revamp-listCard">
                    <Stack gap="xs" align="start">
                      <div className="revamp-interactionIcons">
                        {dayMasterIconSrc ? (
                          <img
                            className="icon-sm"
                            src={dayMasterIconSrc}
                            alt=""
                            aria-hidden="true"
                          />
                        ) : null}
                        <img
                          className="icon-sm"
                          src={getElementSrc(theme, "wood", "mono")}
                          alt=""
                          aria-hidden="true"
                        />
                      </div>
                      <Text muted>{payload.interaction.monthStemBranch}</Text>
                      <Text>{payload.interaction.description}</Text>
                    </Stack>
                  </div>
                </PageSection>

                <PageSection
                  title={
                    <SectionTitleRow
                      titleKey="monthly.protection.title"
                      iconKey="protection"
                    />
                  }
                >
                  <div className="revamp-listCard">
                    <Stack gap="xs" align="start">
                      <Text muted>{t("monthly.protection.focusLabel")}</Text>
                      <Text>{payload.protection.focus}</Text>
                      <ul className="revamp-monthlyList">
                        {payload.protection.suggestions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Stack>
                  </div>
                </PageSection>

                <PageSection
                  title={
                    <SectionTitleRow titleKey="monthly.upcoming.title" iconKey="upcoming" />
                  }
                >
                  <div className="revamp-listCard revamp-upcomingCard">
                    <Stack gap="xs" align="start">
                      <Text className="revamp-sectionTitle">
                        {payload.upcoming.title}
                      </Text>
                      <Text>{payload.upcoming.description}</Text>
                      <Button variant="secondary" size="sm" disabled>
                        {payload.upcoming.disabledCtaLabel ??
                          t("monthly.upcoming.disabledCta")}
                      </Button>
                    </Stack>
                  </div>
                </PageSection>
              </>
            ) : null}
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
