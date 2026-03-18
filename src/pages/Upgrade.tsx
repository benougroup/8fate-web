import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import { resolveImage } from "@/utils/imageResolver";

// --- SERVICES ---
import { getPlans, validateAppleReceipt, type Plan } from "@services/endpoints/payments";
import { useSession } from "@/hooks/useSession";
import AppShell from "@/components/AppShell";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";
import Button from "@/components/Button";
import Popup from "@/components/Popup"; // Reusing your Popup component

export default function Upgrade() {
  const navigate = useNavigate();
  const [session, setSession] = useSession();
  const isPremium = !!session?.isPremium;
  const badgeIcon = resolveImage(isPremium ? "badges/premium.png" : "badges/free_logo.png");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);

  // Load Plans
  useEffect(() => {
    async function load() {
      const res = await getPlans();
      if (res.ok && res.data) {
        setPlans(res.data.plans);
      } else {
        setError(res.error?.message || "Failed to load plans");
      }
      setLoading(false);
    }
    load();
  }, []);

  // Handle Back / Exit
  const handleBack = () => {
    // If not premium yet, show exit intent
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

  // Handle Purchase (Mock Logic for MVP)
  const handlePurchase = async (plan: Plan) => {
    setPendingPlan(plan);
  };

  const confirmPurchase = async () => {
    if (!pendingPlan || isPurchasing) return;
    setIsPurchasing(true);
    setError(null);

    const mockReceipt = "mock-receipt-" + Date.now();
    const res = await validateAppleReceipt(mockReceipt);

    if (res.ok && res.data) {
      setSession({ ...session, isPremium: true });
      if (pendingPlan?.id) {
        localStorage.setItem("subscribed_plan_id", pendingPlan.id);
      }
      setPendingPlan(null);
      setShowPurchaseSuccess(true);
    } else {
      setError("Purchase validation failed.");
    }
    setIsPurchasing(false);
  };

  if (loading) return <AppShell hideNav>
    <Loader label="Loading plans..." />
  </AppShell>;

  return (
    <AppShell hideNav>
      <style>{`
        .upgrade-screen {
          min-height: 100vh;
          position: relative;
          background-color: #0B0C2A;
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        .upgrade-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .close-btn { 
          background: rgba(255,255,255,0.1); border: none; color: #fff; 
          width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; 
        }

        .hero-text { text-align: center; margin-bottom: 32px; }
        .hero-title { font-size: 24px; font-weight: 700; color: #F4D73E; margin: 0 0 8px; }
        .hero-sub { opacity: 0.8; font-size: 15px; line-height: 1.5; }

        .plans-list { display: flex; flex-direction: column; gap: 16px; }

        .plan-card {
          background: rgba(29, 35, 47, 0.8);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .plan-card.popular {
          border: 1px solid #F4D73E;
          background: linear-gradient(145deg, rgba(29, 35, 47, 0.9), rgba(40, 30, 10, 0.6));
        }
        .pop-badge {
          position: absolute;
          top: 0; right: 0;
          background: #F4D73E;
          color: #000;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 12px;
          border-bottom-left-radius: 12px;
        }

        .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .plan-price { font-size: 20px; color: #F4D73E; font-weight: 600; margin-bottom: 12px; }
        .features { list-style: none; padding: 0; margin: 0 0 16px; opacity: 0.8; font-size: 13px; }
        .features li { margin-bottom: 6px; display: flex; gap: 8px; }
        .features li::before { content: "✓"; color: #F4D73E; }

        .restore-link {
          margin-top: auto;
          text-align: center;
          padding: 20px;
          font-size: 13px;
          opacity: 0.6;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>

      <img src={backgroundImage} className="upgrade-bg" alt="bg" />

      <div className="upgrade-screen">
        <div className="content">
          <div className="header">
            <button className="close-btn" onClick={handleBack}>✕</button>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Unlock Destiny</span>
            <div style={{ width: 32 }} />
          </div>

          <div className="hero-text">
            <img src={badgeIcon} style={{ width: 48, marginBottom: 16 }} alt={isPremium ? "Premium" : "Free"} />
            <h1 className="hero-title">Upgrade to Premium</h1>
            <p className="hero-sub">Get detailed insights, future forecasts, and unlimited AI guidance.</p>
          </div>

          {error && <ErrorBox message={error} style={{ marginBottom: 16 }} />}

          <div className="plans-list">
            {plans.map((plan) => {
              const isYearly = plan.id.includes("yearly");
              return (
                <div key={plan.id} className={`plan-card ${isYearly ? "popular" : ""}`}>
                  {isYearly && <div className="pop-badge">BEST VALUE</div>}
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">
                    ${(plan.price / 100).toFixed(2)}{" "}
                    <span style={{ fontSize: 14, color: "#fff", opacity: 0.5 }}>
                      /{isYearly ? "year" : "mo"}
                    </span>
                  </div>
                  <ul className="features">
                    {plan.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <Button
                    variant={isYearly ? "primary" : "secondary"}
                    style={{ width: "100%" }}
                    onClick={() => handlePurchase(plan)}
                  >
                    Start {isYearly ? "Yearly" : "Monthly"} Plan
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="restore-link" onClick={() => alert("Restore Purchase Mock Triggered")}>
            Restore Purchases
          </div>
        </div>
      </div>

      <Popup
        open={showExitConfirm}
        title="Wait! Your destiny awaits."
        message="Are you sure you want to leave?"
        tone="warning"
        actions={[
          { label: "Stay & Upgrade", onSelect: () => setShowExitConfirm(false), variant: "primary" },
          { label: "Leave Anyway", onSelect: confirmExit, variant: "ghost" },
        ]}
        onClose={() => setShowExitConfirm(false)}
      />

      <Popup
        open={Boolean(pendingPlan)}
        title="Confirm your plan"
        message={pendingPlan ? `Buy ${pendingPlan.name} for $${(pendingPlan.price / 100).toFixed(2)}?` : ""}
        tone="confirm"
        actions={[
          { label: isPurchasing ? "Processing..." : "Confirm purchase", onSelect: confirmPurchase, variant: "primary", disabled: isPurchasing },
          { label: "Cancel", onSelect: () => setPendingPlan(null), variant: "ghost", disabled: isPurchasing },
        ]}
        onClose={() => {
          if (!isPurchasing) setPendingPlan(null);
        }}
      />

      <Popup
        open={showPurchaseSuccess}
        title="Welcome to Premium!"
        message="Your purchase is complete and your premium access is now active."
        tone="info"
        actions={[
          { label: "Go to dashboard", onSelect: () => navigate("/dashboard", { replace: true }), variant: "primary" },
        ]}
        onClose={() => setShowPurchaseSuccess(false)}
      />
    </AppShell>
  );
}
