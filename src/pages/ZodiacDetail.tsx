import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconBack from "@/assets/images/general icons/back_page_icon.png";
import iconLock from "@/assets/images/general icons/lock_icon.png";

// --- SERVICES ---
import { getZodiacDetail } from "@services/endpoints/zodiac";
import { getSession } from "@services/sessionStore";
import AppShell from "@/components/AppShell";
import BackgroundScreen from "@/components/BackgroundScreen";
import DetailHeader from "@/components/DetailHeader";
import GlassCard from "@/components/GlassCard";
import LockedOverlay from "@/components/LockedOverlay";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";

// --- TYPES ---
// (Simplified for internal use)
interface ZodiacData {
  sign: string;
  subtitle?: string;
  summary: string;
  traits: string[];
  compatibility: {
    best: string[];
    avoid: string[];
  };
  lucky: {
    colors: string[];
    numbers: string[];
  };
  advanced?: {
    notes: string[];
  };
}

// --- HELPER ---
function getZodiacImage(sign: string) {
  if (!sign) return "";
  const cleanName = sign.toLowerCase().trim();
  // Maps "Dragon" -> ".../zodiac/dragon.png"
  return new URL(`../assets/images/zodiac/${cleanName}.png`, import.meta.url).href;
}

export default function ZodiacDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const session = getSession();
  const { isPremium } = session || {};

  // Get sign from query param or fallback to session defaults if available
  const signParam = params.get("sign");
  const resolvedSign = signParam || localStorage.getItem("last_zodiac_sign") || "";

  const [data, setData] = useState<ZodiacData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!resolvedSign) {
        setError("No zodiac sign specified.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await getZodiacDetail({
          sign: resolvedSign,
          detailLevel: isPremium ? "advanced" : "beginner",
        });

        if (res.ok && res.data) {
          setData(res.data);
        } else {
          throw new Error(res.error?.message || "Failed to load zodiac detail");
        }
      } catch (e: any) {
        setError(e?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [resolvedSign, isPremium]);

  if (loading) return <AppShell><Loader /></AppShell>;

  return (
    <AppShell>
      <style>{`
        .zod-screen {
          padding: 20px 20px 100px; /* Bottom padding for nav */
          color: #fff;
        }
        .zod-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .detail-header__title { text-transform: capitalize; }

        /* Hero Section */
        .hero-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px;
          background: radial-gradient(circle at center, rgba(244, 215, 62, 0.15) 0%, rgba(29, 35, 47, 0.4) 70%);
          border-radius: 20px;
          border: 1px solid rgba(244, 215, 62, 0.2);
          backdrop-filter: blur(10px);
        }
        .hero-img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 15px rgba(244, 215, 62, 0.3));
        }
        .hero-sign { font-size: 28px; font-weight: 800; color: #F4D73E; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .hero-sub { font-size: 14px; opacity: 0.8; margin-top: 4px; font-style: italic; }
        .hero-desc { font-size: 15px; line-height: 1.6; margin-top: 16px; color: rgba(255,255,255,0.9); }

        /* Info Cards */
        .section-head { color: #F4D73E; font-size: 13px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; }

        /* Traits Grid */
        .traits-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .trait-tag {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
        }

        /* Compatibility */
        .compat-row { display: flex; flex-direction: column; gap: 8px; }
        .compat-group { display: flex; align-items: center; gap: 10px; }
        .compat-label { font-size: 12px; width: 50px; opacity: 0.7; }
        .compat-vals { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
        .match-good { color: #8be8b6; border-color: #8be8b6; }
        .match-bad { color: #FF6B6B; border-color: #FF6B6B; }

      `}</style>

      <BackgroundScreen
        backgroundImage={backgroundImage}
        className="zod-screen"
        contentClassName="zod-content"
      >
        {/* Header */}
        <DetailHeader title={data?.sign || "Zodiac"} backIcon={iconBack} onBack={() => navigate(-1)} />

        {error && <ErrorBox message={error} />}

        {data && (
          <>
            {/* Hero */}
            <div className="hero-card">
              <img
                src={getZodiacImage(data.sign)}
                className="hero-img"
                alt={data.sign}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h1 className="hero-sign">{data.sign}</h1>
              <div className="hero-sub">{data.subtitle}</div>
              <p className="hero-desc">{data.summary}</p>
            </div>

            {/* Traits */}
            <GlassCard>
              <div className="section-head">Key Traits</div>
              <div className="traits-grid">
                {data.traits.map((t, i) => (
                  <span key={i} className="trait-tag">{t}</span>
                ))}
              </div>
            </GlassCard>

            {/* Compatibility */}
            <GlassCard>
              <div className="section-head">Compatibility</div>
              <div className="compat-row">
                <div className="compat-group">
                  <span className="compat-label">Best</span>
                  <div className="compat-vals">
                    {data.compatibility.best.map((s, i) => (
                      <span
                        key={i}
                        className="trait-tag match-good"
                        style={{ color: "#8be8b6", borderColor: "rgba(139, 232, 182, 0.3)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="compat-group" style={{ marginTop: 8 }}>
                  <span className="compat-label">Avoid</span>
                  <div className="compat-vals">
                    {data.compatibility.avoid.map((s, i) => (
                      <span
                        key={i}
                        className="trait-tag match-bad"
                        style={{ color: "#FF6B6B", borderColor: "rgba(255, 107, 107, 0.3)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Lucky Elements */}
            <GlassCard>
              <div className="section-head">Lucky Aspects</div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div><span style={{ opacity: 0.7 }}>Colors:</span> {data.lucky.colors.join(", ")}</div>
                <div><span style={{ opacity: 0.7 }}>Numbers:</span> {data.lucky.numbers.join(", ")}</div>
              </div>
            </GlassCard>

            {/* Advanced Forecast (Premium) */}
            <GlassCard className="glass-card" style={{ position: "relative", overflow: "hidden" }}>
              <div className="section-head" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Advanced Forecast
                {isPremium && (
                  <span
                    style={{
                      fontSize: 10,
                      background: "#F4D73E",
                      color: "#000",
                      padding: "1px 4px",
                      borderRadius: 4,
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>

              <LockedOverlay
                isLocked={!isPremium}
                lockIcon={iconLock}
                message="Unlock 2025 Forecast"
                onUpgrade={!isPremium ? () => navigate("/membership") : undefined}
              >
                {isPremium ? (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.5 }}>
                    {data.advanced?.notes.map((n, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p>2025 will be a year of significant change. Your career sector indicates...</p>
                    <p>Relationships may face a test in the summer months...</p>
                  </>
                )}
              </LockedOverlay>
            </GlassCard>
          </>
        )}
      </BackgroundScreen>
    </AppShell>
  );
}
