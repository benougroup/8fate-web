import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconBack from "@/assets/images/general icons/back_page_icon.png";
import iconLock from "@/assets/images/general icons/lock_icon.png";
import imgYin from "@/assets/images/yin_yang/yin.png";
import imgYang from "@/assets/images/yin_yang/yang.png";
import imgBalance from "@/assets/images/yin_yang/yin_yang_balance.png";

// --- SERVICES ---
import { getYinYangDetail } from "@services/endpoints/zodiac";
import { getSession } from "@services/sessionStore";
import AppShell from "@/components/AppShell";
import BackgroundScreen from "@/components/BackgroundScreen";
import DetailHeader from "@/components/DetailHeader";
import GlassCard from "@/components/GlassCard";
import LockedOverlay from "@/components/LockedOverlay";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";

// --- TYPES ---
interface YinYangData {
  title: string;
  subtitle: string;
  summary: string;
  percentages: { yin: number; yang: number };
  qualities: string[];
  balancingTips: string[];
  period: { label: string; range: string; focus: string };
  advanced?: { notes: string[] };
}

export default function YinYangDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const session = getSession();
  const { isPremium } = session || {};

  const queryKey = params.get("key") || "balance";

  const [data, setData] = useState<YinYangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await getYinYangDetail({
          key: queryKey,
          detailLevel: isPremium ? "advanced" : "beginner",
        });

        if (res.ok && res.data) {
          setData(res.data);
        } else {
          throw new Error(res.error?.message || "Failed to load details");
        }
      } catch (e: any) {
        setError(e?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [queryKey, isPremium]);

  if (loading) return <AppShell><Loader /></AppShell>;

  return (
    <AppShell>
      <style>{`
        .yy-screen {
          padding: 20px 20px 100px;
          color: #fff;
        }
        .yy-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Hero Section */
        .hero-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .main-icon { width: 64px; height: 64px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
        .hero-title { font-size: 22px; font-weight: 700; margin-bottom: 4px; color: #fff; }
        .hero-sub { font-size: 13px; opacity: 0.8; margin-bottom: 20px; font-style: italic; }

        /* Balance Bar */
        .balance-container { width: 100%; margin-bottom: 20px; }
        .bar-labels { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; font-weight: 600; }
        .bar-track { width: 100%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; display: flex; }
        .bar-yin { background: #111; height: 100%; }
        .bar-yang { background: #fff; height: 100%; }
        
        .hero-desc { font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.9); }

        .section-head { color: #F4D73E; font-size: 13px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        
        .list-item { margin-bottom: 8px; font-size: 14px; line-height: 1.4; display: flex; gap: 8px; }
        .bullet { color: #F4D73E; font-weight: bold; }

        /* Icons Row */
        .icons-row { display: flex; justify-content: center; gap: 32px; margin-bottom: 16px; }
        .icon-col { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; opacity: 0.8; }
        .mini-icon { width: 32px; height: 32px; opacity: 0.9; }

      `}</style>

      <BackgroundScreen
        backgroundImage={backgroundImage}
        className="yy-screen"
        contentClassName="yy-content"
      >
        <DetailHeader title="Energy Balance" backIcon={iconBack} onBack={() => navigate(-1)} />

        {error && <ErrorBox message={error} />}

        {data && (
          <>
            {/* Hero: Balance Chart */}
            <GlassCard className="glass-card hero-card">
              <img src={imgBalance} className="main-icon" alt="Yin Yang" />
              <h1 className="hero-title">{data.title}</h1>
              <div className="hero-sub">{data.subtitle}</div>

              <div className="balance-container">
                <div className="bar-labels">
                  <span>YIN {data.percentages.yin}%</span>
                  <span>YANG {data.percentages.yang}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-yin"
                    style={{ width: `${data.percentages.yin}%` }}
                  />
                  <div
                    className="bar-yang"
                    style={{ width: `${data.percentages.yang}%` }}
                  />
                </div>
              </div>

              <p className="hero-desc">{data.summary}</p>
            </GlassCard>

            {/* Qualities */}
            <GlassCard>
              <div className="section-head">Key Qualities</div>
              <div className="icons-row">
                <div className="icon-col">
                  <img src={imgYin} className="mini-icon" alt="Yin" />
                  <span>Receptive</span>
                </div>
                <div className="icon-col">
                  <img src={imgYang} className="mini-icon" alt="Yang" />
                  <span>Active</span>
                </div>
              </div>
              {data.qualities.map((t, i) => (
                <div key={i} className="list-item">
                  <span className="bullet">•</span> {t}
                </div>
              ))}
            </GlassCard>

            {/* Balancing Tips */}
            <GlassCard>
              <div className="section-head">How to Balance</div>
              {data.balancingTips.map((t, i) => (
                <div key={i} className="list-item">
                  <span className="bullet">✓</span> {t}
                </div>
              ))}
            </GlassCard>

            {/* Advanced (Premium) */}
            {data.advanced && (
              <GlassCard
                className="glass-card"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <div className="section-head">
                  Advanced Notes
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
                  message="Unlock Advanced Analysis"
                  onUpgrade={!isPremium ? () => navigate("/membership") : undefined}
                >
                  {isPremium ? (
                    data.advanced.notes.map((n, i) => (
                      <div key={i} className="list-item">
                        <span className="bullet">★</span> {n}
                      </div>
                    ))
                  ) : (
                    <>
                      <p>Your energy chart indicates a shift in the coming months...</p>
                      <p>Focus on grounding exercises to prevent burnout...</p>
                    </>
                  )}
                </LockedOverlay>
              </GlassCard>
            )}
          </>
        )}
      </BackgroundScreen>
    </AppShell>
  );
}
