import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconLock from "@/assets/images/general icons/lock_icon.png";

// --- COMPONENTS ---
import AppShell from "@/components/AppShell";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";
import Button from "@/components/Button";
import Popup from "@/components/Popup";

// --- SERVICES ---
import { getPlans, type Plan } from "@services/endpoints/payments";
import { useSession } from "@/hooks/useSession";

export default function Payments() {
  const navigate = useNavigate();
  const [session, setSession] = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const [activePlanId, setActivePlanId] = useState(() => localStorage.getItem("subscribed_plan_id") || "");
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
          setError(res.error?.message || "Failed to load plans");
        }
      } catch (e) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <AppShell hideNav>
        <Loader label="Loading plans..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <style>{`
        .plans-screen { padding: 20px; color: #fff; min-height: 100vh; }
        .bg-fixed { position: fixed; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 20px; }
        .page-title { font-size: 22px; font-weight: 700; margin: 0 0 10px 0; text-align: center; }
        .plan-card {
          background: rgba(29, 35, 47, 0.8); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 20px; position: relative; overflow: hidden;
        }
        .active-plan {
          border: 1px solid rgba(244, 215, 62, 0.7);
          background: linear-gradient(145deg, rgba(29, 35, 47, 0.95), rgba(40, 30, 10, 0.7));
        }
        .plan-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: #0B0C2A;
          background: #F4D73E;
          border-radius: 999px;
          padding: 4px 10px;
          margin-bottom: 12px;
        }
        .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .plan-price { font-size: 20px; color: #F4D73E; font-weight: 600; margin-bottom: 12px; }
        .features { list-style: none; padding: 0; margin: 0 0 16px; opacity: 0.8; font-size: 13px; }
        .features li { margin-bottom: 6px; }
        .plan-actions { display: grid; gap: 10px; }
      `}</style>
      <img src={backgroundImage} className="bg-fixed" alt="bg" />

      <div className="plans-screen">
        <div className="content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <img src={iconLock} style={{ width: 24 }} alt="Back" onClick={() => navigate(-1)} />
            <h1 className="page-title" style={{ margin: 0 }}>
              Plans & Billing
            </h1>
          </div>

          {error && <ErrorBox message={error} />}

          {isPremium && currentPlan && (
            <div className="plan-card active-plan">
              <div className="plan-chip">Current Plan</div>
              <div className="plan-name">{currentPlan.name}</div>
              <div className="plan-price">${(currentPlan.price / 100).toFixed(2)}</div>
              <ul className="features">
                {currentPlan.features?.map((feature, index) => (
                  <li key={`${currentPlan.id}-${index}`}>• {feature}</li>
                ))}
              </ul>
              <div className="plan-actions">
                <Button variant="secondary" onClick={() => navigate("/upgrade")}>
                  Change Plan
                </Button>
                <Button variant="ghost" onClick={() => setShowCancelConfirm(true)}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}

          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">${(plan.price / 100).toFixed(2)}</div>
              <ul className="features">
                {plan.trial && <li>• {plan.trial}</li>}
                {plan.features?.map((feature, index) => (
                  <li key={`${plan.id}-${index}`}>• {feature}</li>
                ))}
              </ul>
              <Button style={{ width: "100%" }} onClick={() => navigate("/upgrade")}>
                {isPremium ? "View Plan Options" : "Manage Plan"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Popup
        open={showCancelConfirm}
        title="Cancel your subscription?"
        message="You will keep premium access until the end of the billing period."
        tone="warning"
        actions={[
          { label: "Keep Premium", onSelect: () => setShowCancelConfirm(false), variant: "primary" },
          {
            label: "Cancel Subscription",
            onSelect: () => {
              setShowCancelConfirm(false);
              setSession({ ...session, isPremium: false });
              setActivePlanId("");
              localStorage.removeItem("subscribed_plan_id");
              setShowCancelled(true);
            },
            variant: "ghost",
          },
        ]}
        onClose={() => setShowCancelConfirm(false)}
      />

      <Popup
        open={showCancelled}
        title="Subscription cancelled"
        message="Your premium benefits remain active until the current period ends."
        tone="info"
        actions={[{ label: "Got it", onSelect: () => setShowCancelled(false), variant: "primary" }]}
        onClose={() => setShowCancelled(false)}
      />
    </AppShell>
  );
}
