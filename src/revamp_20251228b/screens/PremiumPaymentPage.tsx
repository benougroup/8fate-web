import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlans, type Plan } from "@services/endpoints/payments";
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

export function PremiumPaymentPage() {
  const navigate = useNavigate();
  const [session, setSession] = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [activePlanId, setActivePlanId] = useState(
    () => localStorage.getItem("subscribed_plan_id") || "",
  );
  const isPremium = !!session?.isPremium;

  const currentPlan = useMemo(() => {
    if (!activePlanId) return plans.find((plan) => plan.id.includes("yearly")) ?? plans[0];
    return plans.find((plan) => plan.id === activePlanId) ?? plans[0];
  }, [activePlanId, plans]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPlans();
        if (res.ok && res.data) {
          setPlans(res.data.plans);
        } else {
          setError(res.error?.message || t("common.errorUnknownDetail"));
        }
      } catch {
        setError(t("common.errorUnknownDetail"));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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
              <Button variant="ghost" size="sm" pill onClick={() => navigate(-1)}>
                {t("common.close")}
              </Button>
              <Text className="revamp-planHeaderTitle">{t("premiumPayment.title")}</Text>
              <span className="revamp-planHeaderSpacer" aria-hidden="true" />
            </div>

            <PageHeader
              title={t("premiumPayment.title")}
              subtitle={t("premiumPayment.subtitle")}
            />

            {error ? <div className="revamp-inlineError">{error}</div> : null}

            {/* TODO: extract ActivePlan + PlanList to shared billing components for reuse. */}
            {isPremium && currentPlan ? (
              <section className="revamp-planCard revamp-planCard--active">
                <span className="revamp-planChip">{t("premiumPayment.activePlan")}</span>
                <div className="revamp-planName">{currentPlan.name}</div>
                <div className="revamp-planPrice">
                  ${(currentPlan.price / 100).toFixed(2)}
                </div>
                <ul className="revamp-planFeatures">
                  {currentPlan.features?.map((feature, index) => (
                    <li key={`${currentPlan.id}-${index}`}>• {feature}</li>
                  ))}
                </ul>
                <div className="revamp-planActions">
                  <Button pill variant="secondary" onClick={() => navigate("/upgrade")}>
                    {t("premiumPayment.changePlan")}
                  </Button>
                  <Button pill variant="ghost" onClick={() => setShowCancelConfirm(true)}>
                    {t("premiumPayment.cancelPlan")}
                  </Button>
                </div>
              </section>
            ) : null}

            <div className="revamp-planList">
              {plans.map((plan) => (
                <article key={plan.id} className="revamp-planCard">
                  <div className="revamp-planName">{plan.name}</div>
                  <div className="revamp-planPrice">${(plan.price / 100).toFixed(2)}</div>
                  <ul className="revamp-planFeatures">
                    {plan.trial ? <li>• {plan.trial}</li> : null}
                    {plan.features?.map((feature, index) => (
                      <li key={`${plan.id}-${index}`}>• {feature}</li>
                    ))}
                  </ul>
                  <Button pill onClick={() => navigate("/upgrade")}>
                    {isPremium ? t("premiumPayment.viewOptions") : t("premiumPayment.managePlan")}
                  </Button>
                </article>
              ))}
            </div>
          </Stack>
        </PageContent>
      </PageCard>

      <AlertDialog
        open={showCancelConfirm}
        title={t("premiumPayment.cancelTitle")}
        message={t("premiumPayment.cancelMessage")}
        onClose={() => setShowCancelConfirm(false)}
        actions={[
          {
            key: "keep",
            label: t("premiumPayment.cancelKeep"),
            variant: "primary",
            onPress: () => setShowCancelConfirm(false),
          },
          {
            key: "cancel",
            label: t("premiumPayment.cancelConfirm"),
            variant: "secondary",
            onPress: () => {
              setShowCancelConfirm(false);
              setSession({ ...session, isPremium: false });
              setActivePlanId("");
              localStorage.removeItem("subscribed_plan_id");
              setShowCancelled(true);
            },
          },
        ]}
      />

      <AlertDialog
        open={showCancelled}
        title={t("premiumPayment.cancelledTitle")}
        message={t("premiumPayment.cancelledMessage")}
        onClose={() => setShowCancelled(false)}
        actions={[
          {
            key: "ok",
            label: t("premiumPayment.cancelledAction"),
            variant: "primary",
            onPress: () => setShowCancelled(false),
          },
        ]}
      />
    </Page>
  );
}
