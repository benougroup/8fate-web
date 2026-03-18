import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

type PricingTier = {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
};

const PRICING_TIERS: PricingTier[] = [
  {
    id: "monthly",
    name: t("premium.pricing.monthly.name"),
    price: "$9.99",
    period: t("premium.pricing.monthly.period"),
  },
  {
    id: "yearly",
    name: t("premium.pricing.yearly.name"),
    price: "$99.99",
    period: t("premium.pricing.yearly.period"),
    savings: t("premium.pricing.yearly.savings"),
  },
  {
    id: "lifetime",
    name: t("premium.pricing.lifetime.name"),
    price: "$299.99",
    period: t("premium.pricing.lifetime.period"),
    savings: t("premium.pricing.lifetime.savings"),
  },
];

const PREMIUM_FEATURES = [
  t("premium.features.unlimitedChat"),
  t("premium.features.advancedAnalysis"),
  t("premium.features.timeFinderPremium"),
  t("premium.features.compatibilityReports"),
  t("premium.features.prioritySupport"),
  t("premium.features.adFree"),
];

export function PremiumLanding() {
  const navigate = useNavigate();
  const { isPremium } = usePreferences();
  const [selectedTier, setSelectedTier] = React.useState<string>("yearly");

  function handlePurchase() {
    navigate(`/purchase?plan=${selectedTier}`);
  }

  if (isPremium) {
    return (
      <Page>
        <PageCard className="revamp-innerPage">
          <InnerTopBar title={t("premium.title")} />

          <div className="revamp-premiumHero">
            <div className="revamp-premiumBadge">
              {t("premium.statusActive")}
            </div>
            <h1 className="revamp-premiumHeroTitle">
              {t("premium.alreadyPremium")}
            </h1>
            <p className="revamp-premiumHeroSubtitle">
              {t("premium.enjoyFeatures")}
            </p>
            <Button variant="secondary" size="lg" onClick={() => navigate("/daily")}>
              {t("common.backToHome")}
            </Button>
          </div>
        </PageCard>
        <FloatingRadialNav />
      </Page>
    );
  }

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar title={t("premium.title")} />

        <div className="revamp-innerPageContent" style={{ padding: "var(--s-6)" }}>
          {/* Hero Section */}
          <div className="revamp-premiumHero">
            <div className="revamp-premiumBadge">
              {t("premium.badge")}
            </div>
            <h1 className="revamp-premiumHeroTitle">
              {t("premium.heroTitle")}
            </h1>
            <p className="revamp-premiumHeroSubtitle">
              {t("premium.heroSubtitle")}
            </p>
          </div>

          {/* Features */}
          <div className="revamp-premiumFeatures">
            {PREMIUM_FEATURES.map((feature, index) => (
              <div key={index} className="revamp-premiumFeatureCard">
                <div className="revamp-premiumFeatureIcon">✓</div>
                <div className="revamp-premiumFeatureText">{feature}</div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="revamp-premiumPricing">
            <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: 700, marginBottom: "var(--s-4)" }}>
              {t("premium.choosePlan")}
            </h2>

            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`revamp-premiumPricingCard ${
                  selectedTier === tier.id ? "revamp-premiumPricingCard--selected" : ""
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {/* Left: name + period + savings */}
                <div>
                  <div className="revamp-premiumPricingName">
                    {tier.name}
                    {tier.id === "yearly" && (
                      <span style={{
                        marginLeft: "8px",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "999px",
                        background: "var(--c-accent)",
                        color: "#0b0c2a",
                        verticalAlign: "middle",
                      }}>
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="revamp-premiumPricingPeriod">{tier.period}</div>
                  {tier.savings && (
                    <div className="revamp-premiumPricingSavings">{tier.savings}</div>
                  )}
                </div>
                {/* Right: price */}
                <div className="revamp-premiumPricingPrice">{tier.price}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            onClick={handlePurchase}
            className="revamp-premiumCTA"
          >
            {t("premium.cta")}
          </Button>
        </div>
      </PageCard>

      <FloatingRadialNav />
    </Page>
  );
}
