import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlans, validateAppleReceipt, type Plan } from "@services/endpoints/payments";
import { useSession } from "@/hooks/useSession";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { AlertDialog } from "../components/AlertDialog";
import { t } from "../i18n/t";

export function PremiumRegisterPage() {
  const navigate = useNavigate();
  const [session, setSession] = useSession();
  const isPremium = !!session?.isPremium;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      const res = await getPlans();
      if (res.ok && res.data) {
        setPlans(res.data.plans);
      } else {
        setError(res.error?.message || t("common.errorUnknownDetail"));
      }
      setLoading(false);
    }

    loadPlans();
  }, []);

  const handleBack = () => {
    if (!session?.isPremium) {
      setShowExitConfirm(true);
    } else {
      navigate(-1);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    navigate(-1);
  };

  const handlePurchase = (plan: Plan) => {
    setPendingPlan(plan);
  };

  const confirmPurchase = async () => {
    if (!pendingPlan || isPurchasing) return;
    setIsPurchasing(true);
    setError(null);

    const mockReceipt = `mock-receipt-${Date.now()}`;
    const res = await validateAppleReceipt(mockReceipt);

    if (res.ok && res.data) {
      setSession({ ...session, isPremium: true });
      if (pendingPlan?.id) {
        localStorage.setItem("subscribed_plan_id", pendingPlan.id);
      }
      setPendingPlan(null);
      setShowPurchaseSuccess(true);
    } else {
      setError(t("premiumRegister.purchaseError"));
    }
    setIsPurchasing(false);
  };

  if (loading) {
    return (
      <Page>
        <PageCard className="revamp-planShell">
          <PageContent>
            <Text>{t("common.loading")}</Text>
          </PageContent>
        </PageCard>
      </Page>
    );
  }

  return (
    <Page>
      <PageCard className="revamp-planShell">
        <PageContent>
          <Stack gap="lg">
            <div className="revamp-planHeader">
              <Button variant="ghost" size="sm" pill onClick={handleBack}>
                {t("common.close")}
              </Button>
              <Text className="revamp-planHeaderTitle">{t("premiumRegister.headerLabel")}</Text>
              <span className="revamp-planHeaderSpacer" aria-hidden="true" />
            </div>

            <PageHeader
              title={t("premiumRegister.title")}
              subtitle={t("premiumRegister.subtitle")}
            />

            {error ? <div className="revamp-inlineError">{error}</div> : null}

            {/* TODO: extract PlanCard + feature list so both premium flows share one component. */}
            <div className="revamp-planList">
              {plans.map((plan) => {
                const isYearly = plan.id.includes("yearly");
                return (
                  <article
                    key={plan.id}
                    className={[
                      "revamp-planCard",
                      isYearly ? "is-featured" : null,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isYearly ? (
                      <span className="revamp-planBadge">{t("premiumRegister.bestValue")}</span>
                    ) : null}
                    <div className="revamp-planName">{plan.name}</div>
                    <div className="revamp-planPrice">
                      ${(plan.price / 100).toFixed(2)}
                      <span className="revamp-planInterval">
                        /{isYearly ? t("premiumRegister.year") : t("premiumRegister.month")}
                      </span>
                    </div>
                    <ul className="revamp-planFeatures">
                      {plan.features?.map((feature, index) => (
                        <li key={`${plan.id}-${index}`}>{feature}</li>
                      ))}
                    </ul>
                    <Button
                      pill
                      variant={isYearly ? "primary" : "secondary"}
                      onClick={() => handlePurchase(plan)}
                    >
                      {isYearly
                        ? t("premiumRegister.startYearly")
                        : t("premiumRegister.startMonthly")}
                    </Button>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              className="revamp-planRestore"
              onClick={() => alert(t("premiumRegister.restoreAlert"))}
            >
              {t("premiumRegister.restore")}
            </button>
          </Stack>
        </PageContent>
      </PageCard>

      <AlertDialog
        open={showExitConfirm}
        title={t("premiumRegister.exitTitle")}
        message={t("premiumRegister.exitMessage")}
        onClose={() => setShowExitConfirm(false)}
        actions={[
          {
            key: "stay",
            label: t("premiumRegister.exitStay"),
            variant: "primary",
            onPress: () => setShowExitConfirm(false),
          },
          {
            key: "leave",
            label: t("premiumRegister.exitLeave"),
            variant: "secondary",
            onPress: confirmExit,
          },
        ]}
      />

      <AlertDialog
        open={Boolean(pendingPlan)}
        title={t("premiumRegister.confirmTitle")}
        message={
          pendingPlan
            ? t("premiumRegister.confirmMessage", {
                plan: pendingPlan.name,
                price: (pendingPlan.price / 100).toFixed(2),
              })
            : ""
        }
        onClose={() => {
          if (!isPurchasing) setPendingPlan(null);
        }}
        blocking={isPurchasing}
        actions={[
          {
            key: "confirm",
            label: isPurchasing
              ? t("premiumRegister.processing")
              : t("premiumRegister.confirmAction"),
            variant: "primary",
            onPress: confirmPurchase,
          },
          {
            key: "cancel",
            label: t("premiumRegister.cancel"),
            variant: "secondary",
            onPress: () => setPendingPlan(null),
          },
        ]}
      />

      <AlertDialog
        open={showPurchaseSuccess}
        title={t("premiumRegister.successTitle")}
        message={t("premiumRegister.successMessage")}
        onClose={() => setShowPurchaseSuccess(false)}
        actions={[
          {
            key: "dashboard",
            label: t("premiumRegister.successAction"),
            variant: "primary",
            onPress: () => navigate("/daily", { replace: true }),
          },
        ]}
      />
    </Page>
  );
}
