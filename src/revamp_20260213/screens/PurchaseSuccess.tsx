import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { t } from "../i18n/t";

export function PurchaseSuccess() {
  const navigate = useNavigate();

  return (
    <Page>
      <PageCard>
        <div className="revamp-paymentSuccess">
          {/* Success Icon */}
          <div className="revamp-paymentSuccessIcon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="4" />
              <path
                d="M25 40 L35 50 L55 30"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="revamp-paymentSuccessTitle">
            {t("purchase.success.title")}
          </h1>
          <p className="revamp-paymentSuccessMessage">
            {t("purchase.success.message")}
          </p>

          {/* Actions */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/daily", { replace: true })}
            style={{ width: "100%", maxWidth: "320px" }}
          >
            {t("purchase.success.cta")}
          </Button>
        </div>
      </PageCard>
    </Page>
  );
}
