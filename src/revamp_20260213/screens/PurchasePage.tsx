import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { t } from "../i18n/t";
import { useServices } from "../services";
import { usePreferences } from "../stores/preferencesStore";

type PlanDetails = {
  name: string;
  price: string;
  period: string;
};

const PLAN_DETAILS: Record<string, PlanDetails> = {
  monthly: {
    name: t("premium.pricing.monthly.name"),
    price: "$9.99",
    period: t("premium.pricing.monthly.period"),
  },
  yearly: {
    name: t("premium.pricing.yearly.name"),
    price: "$99.99",
    period: t("premium.pricing.yearly.period"),
  },
  lifetime: {
    name: t("premium.pricing.lifetime.name"),
    price: "$299.99",
    period: t("premium.pricing.lifetime.period"),
  },
};

export function PurchasePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const services = useServices();
  const { setPremium } = usePreferences();
  const planId = params.get("plan") || "yearly";
  const plan = PLAN_DETAILS[planId] || PLAN_DETAILS.yearly;
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleApplePay() {
    setProcessing(true);
    setError(null);

    try {
      // Dev mode: Simulate payment
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setPremium(true);
        navigate("/purchase/success", { replace: true });
        return;
      }

      // Production: Apple Pay integration
      // TODO: Implement actual Apple Pay flow
      // const paymentResult = await services.payment.processApplePay(planId);
      // if (paymentResult.success) {
      //   setPremium(true);
      //   navigate("/purchase/success", { replace: true });
      // }

      // Fallback for now
      setPremium(true);
      navigate("/purchase/success", { replace: true });
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || t("purchase.error.failed"));
      setProcessing(false);
    }
  }

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar title={t("purchase.title")} />

        <div className="revamp-purchaseCard revamp-innerPageContent">
          {/* Order Summary */}
          <div className="revamp-purchaseSummary">
            <h3 className="revamp-purchaseSummaryTitle">
              {t("purchase.orderSummary")}
            </h3>
            <div className="revamp-purchaseSummaryRow">
              <span className="revamp-purchaseSummaryLabel">{t("purchase.plan")}</span>
              <span className="revamp-purchaseSummaryValue">{plan.name}</span>
            </div>
            <div className="revamp-purchaseSummaryRow">
              <span className="revamp-purchaseSummaryLabel">{t("purchase.period")}</span>
              <span className="revamp-purchaseSummaryValue">{plan.period}</span>
            </div>
            <div className="revamp-purchaseSummaryRow">
              <span className="revamp-purchaseSummaryLabel">{t("purchase.total")}</span>
              <span className="revamp-purchaseSummaryValue">{plan.price}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "var(--s-3)",
                borderRadius: "var(--r-md)",
                background: "rgba(156, 47, 47, 0.1)",
                border: "1px solid rgba(156, 47, 47, 0.3)",
                color: "var(--c-red)",
                fontSize: "var(--fs-sm)",
              }}
            >
              {error}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <h3 style={{ fontSize: "var(--fs-md)", fontWeight: 700, marginBottom: "var(--s-3)" }}>
              {t("purchase.paymentMethod")}
            </h3>
            <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-text-muted)", marginBottom: "var(--s-4)" }}>
              {t("purchase.securePayment")}
            </p>
          </div>

          {/* Total */}
          <div className="revamp-purchaseTotal">
            <span className="revamp-purchaseTotalLabel">{t("purchase.total")}</span>
            <span className="revamp-purchaseTotalValue">{plan.price}</span>
          </div>

          {/* Actions */}
          <div className="revamp-purchaseActions">
            <Button
              variant="primary"
              size="lg"
              onClick={handleApplePay}
              disabled={processing}
              style={{ width: "100%" }}
            >
              {processing ? t("purchase.processing") : t("purchase.payWithApplePay")}
            </Button>

            <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-text-muted)", textAlign: "center" }}>
              {t("purchase.termsAgreement")}
            </p>
          </div>
        </div>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
