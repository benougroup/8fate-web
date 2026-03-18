import * as React from "react";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { AlertDialog } from "../components/AlertDialog";
import { t } from "../i18n/t";
import { useServices } from "../services";
import { usePreferences } from "../stores/preferencesStore";

type PurchasePlan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  badge?: string;
  featured?: boolean;
};

export function Purchase() {
  const navigate = useNavigate();
  const services = useServices();
  const { setPremium } = usePreferences();
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [pendingPlan, setPendingPlan] = React.useState<PurchasePlan | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const plans: PurchasePlan[] = [
    {
      id: "monthly",
      name: t("purchase.plans.monthly.title"),
      price: 9.99,
      interval: t("purchase.plans.monthly.interval"),
      features: [
        t("purchase.plans.monthly.features.0"),
        t("purchase.plans.monthly.features.1"),
        t("purchase.plans.monthly.features.2"),
      ],
    },
    {
      id: "yearly",
      name: t("purchase.plans.yearly.title"),
      price: 69.99,
      interval: t("purchase.plans.yearly.interval"),
      features: [
        t("purchase.plans.yearly.features.0"),
        t("purchase.plans.yearly.features.1"),
        t("purchase.plans.yearly.features.2"),
      ],
      badge: t("purchase.plans.yearly.badge"),
      featured: true,
    },
  ];

  async function handlePurchase() {
    setLoading(true);
    const result = await services.purchase.purchasePremium();
    if (result.success) {
      setPremium(true);
      setStatus(t("purchase.success"));
      setShowSuccess(true);
    } else {
      setStatus(result.message ?? t("purchase.failure"));
    }
    setLoading(false);
  }

  async function handleRestore() {
    setLoading(true);
    const result = await services.purchase.restorePurchase();
    if (result.success) {
      setPremium(true);
      setStatus(t("purchase.success"));
      navigate("/premium", { replace: true });
    } else {
      setStatus(result.message ?? t("purchase.failure"));
    }
    setLoading(false);
  }

  return (
    <Page>
      <PageCard className="revamp-planShell">
        <PageContent>
          <Stack gap="lg">
            <div className="revamp-planHeader">
              <Button variant="ghost" size="sm" pill onClick={() => navigate(-1)}>
                {t("common.close")}
              </Button>
              <Text className="revamp-planHeaderTitle">{t("purchase.title")}</Text>
              <span className="revamp-planHeaderSpacer" aria-hidden="true" />
            </div>

            <PageHeader
              title={t("purchase.headline")}
              subtitle={t("purchase.subtitle")}
            />
            <div className="revamp-planList">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={[
                    "revamp-planCard",
                    plan.featured ? "is-featured" : null,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {plan.badge ? <span className="revamp-planBadge">{plan.badge}</span> : null}
                  <div className="revamp-planName">{plan.name}</div>
                  <div className="revamp-planPrice">
                    ${plan.price.toFixed(2)}
                    <span className="revamp-planInterval">/{plan.interval}</span>
                  </div>
                  <ul className="revamp-planFeatures">
                    {plan.features.map((feature, index) => (
                      <li key={`${plan.id}-${index}`}>• {feature}</li>
                    ))}
                  </ul>
                  <div className="revamp-planActions">
                    <Button
                      pill
                      variant={plan.featured ? "primary" : "secondary"}
                      onClick={() => setPendingPlan(plan)}
                      disabled={loading}
                    >
                      {t("purchase.selectPlan", { plan: plan.name })}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="revamp-planRestore"
              onClick={handleRestore}
              disabled={loading}
            >
              {t("purchase.restore")}
            </button>
            {status ? <Text>{status}</Text> : null}
          </Stack>
        </PageContent>
      </PageCard>

      <AlertDialog
        open={Boolean(pendingPlan)}
        title={t("purchase.confirmTitle")}
        message={
          pendingPlan
            ? t("purchase.confirmMessage", {
                plan: pendingPlan.name,
                price: pendingPlan.price.toFixed(2),
              })
            : ""
        }
        onClose={() => setPendingPlan(null)}
        actions={[
          {
            key: "confirm",
            label: loading ? t("purchase.processing") : t("purchase.confirm"),
            variant: "primary",
            onPress: () => {
              if (!loading) {
                setPendingPlan(null);
                void handlePurchase();
              }
            },
          },
          {
            key: "cancel",
            label: t("purchase.cancel"),
            variant: "secondary",
            onPress: () => setPendingPlan(null),
          },
        ]}
      />

      <AlertDialog
        open={showSuccess}
        title={t("purchase.successTitle")}
        message={t("purchase.successMessage")}
        onClose={() => setShowSuccess(false)}
        actions={[
          {
            key: "premium",
            label: t("purchase.successAction"),
            variant: "primary",
            onPress: () => navigate("/premium", { replace: true }),
          },
        ]}
      />
      <FloatingRadialNav />
    </Page>
  );
}
