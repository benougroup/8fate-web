import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";

import iconLock from "@/assets/images/general icons/lock_icon.png";
import { resolveByFolderName } from "@/utils/imageResolver";

// --- SERVICES ---
import { getDashboard } from "@services/endpoints/dashboard";
import { getSession } from "@services/sessionStore";
import AppShell from "@/components/AppShell";
import InfoTrigger from "@/components/InfoTrigger";
import ProfileLink from "@/components/ProfileLink";
import { t } from "@/revamp_20251228b/i18n/t";

// --- TYPES ---
interface DashboardData {
  userName: string;
  isPremium: boolean;
  todayDate: string;
  focusQuote: string;
  zodiacSign: string;
  // Section 1: Lucky Elements
  luckyElements: {
    color: string;
    element: string;
    direction: string;
  };
  unluckyElements: {
    color: string;
    element: string;
    direction: string;
  };
  // Section 2: Yin Yang Balance (New)
  yinYang: {
    yin: number; // Percentage 0-100
    yang: number; // Percentage 0-100
  };
  // Section 3: Extended Fortune (New)
  fortune: {
    luckyNumber: string;
    compatibleSign: string;
    luckyTime: string;
  };
  misfortune: {
    unluckyNumber: string;
    challengingSign: string;
    avoidTime: string;
  };
  // Section 4: Flip Card
  flipCard: {
    front: string;
    back: string | null;
  };
  // Section 5: Destiny Insights
  destinyInsights: {
    id: string;
    label: string;
    isLocked: boolean;
  }[];
  // Section 6: Recommendation (New)
  recommendation: {
    text: string;
    isLocked: boolean;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const resolveDestinyIcon = (id: string) => resolveByFolderName("destiny icons", id);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const session = getSession();
        const response = await getDashboard({
          date: new Date().toISOString().split("T")[0],
        });

        if (response.ok && response.data) {
          const apiData = response.data;
          const resolvedName = session?.name?.trim() || apiData.userName || "User";
          setData({
            userName: resolvedName,
            isPremium: apiData.isPremium ?? !!session?.isPremium,
            todayDate: new Date(apiData.today ?? new Date()).toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "short",
            }),
            focusQuote: apiData.focusQuote || "Align your energy.",
            zodiacSign: apiData.luckyElements?.compatibleSign || "Ox",
            luckyElements: {
              color: apiData.luckyElements?.color || "#F4D73E",
              element: apiData.luckyElements?.element || "—",
              direction: apiData.luckyElements?.direction || "—",
            },
            unluckyElements: {
              color: "#5b6b7c",
              element: "Water",
              direction: "North",
            },
            yinYang: {
              yin: apiData.yinYangBalance?.yin ?? 50,
              yang: apiData.yinYangBalance?.yang ?? 50,
            },
            fortune: {
              luckyNumber: apiData.luckyElements?.number ? String(apiData.luckyElements.number) : "—",
              compatibleSign: apiData.luckyElements?.compatibleSign || "—",
              luckyTime: "09:00 - 11:00",
            },
            misfortune: {
              unluckyNumber: "4",
              challengingSign: "Goat",
              avoidTime: "13:00 - 15:00",
            },
            flipCard: {
              front: apiData.flipCard?.front || "Tip unavailable.",
              back: apiData.flipCard?.back || null,
            },
            destinyInsights: (apiData.destinyInsights || []).map((item: any) => ({
              id: item.categoryId || "career",
              label: item.label || "Insight",
              isLocked: !!item.isLocked,
            })),
            recommendation: {
              text: apiData.notices?.[0]?.text || "No recommendation today.",
              isLocked: !(apiData.isPremium ?? session?.isPremium),
            },
          });
        }
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AppShell hideNav>
        <div style={{ background: "#0B0C2A", height: "100vh", width: "100vw" }} />
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div style={{ padding: 20 }}>Unable to load dashboard.</div>
      </AppShell>
    );
  }

  return (
    <AppShell style={{ background: "#0B0C2A", color: "#fff" }}>
      <div className="dashboard-screen">
        <style>{`
          .dashboard-screen {
            min-height: 100vh;
            width: 100%;
            position: relative;
            background-color: #0B0C2A;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding-bottom: 90px;
            overflow-y: auto;
            color: #fff;
          }

        .dash-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1.0;
          z-index: 0;
        }

        .content-container {
          position: relative;
          z-index: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* HEADER */
        .header { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .header-actions { display: flex; align-items: center; gap: 10px; }
        .upgrade-btn { background: linear-gradient(90deg, #F4D73E 0%, #c7a006 100%); color: #0B0C2A; border: none; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .premium-badge { background: rgba(244, 215, 62, 0.2); color: #F4D73E; border: 1px solid #F4D73E; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .preview-btn { background: rgba(255, 255, 255, 0.12); color: #fff; border: 1px solid rgba(255, 255, 255, 0.3); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; }

        /* COMMON BOX STYLE */
        .glass-box {
          background: rgba(29, 35, 47, 0.6);
          border: 1px solid rgba(70, 98, 112, 0.3);
          border-radius: 16px;
          padding: 16px;
          backdrop-filter: blur(12px);
        }
        .section-title { color: #F4D73E; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; font-weight: 600; }
        .zodiac-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .zodiac-value { font-size: 18px; font-weight: 700; }

        /* YIN YANG BAR */
        .yy-bar-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; display: flex; }
        .yy-bar-yin { height: 100%; background: #000; }
        .yy-bar-yang { height: 100%; background: #fff; }
        .yy-labels { display: flex; justify-content: space-between; font-size: 12px; margin-top: 6px; opacity: 0.8; }

        /* LUCKY & FORTUNE */
        .lucky-row { display: flex; justify-content: space-around; align-items: center; }
        .lucky-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .lucky-label { font-size: 11px; opacity: 0.6; text-transform: uppercase; }
        .lucky-value { font-size: 14px; font-weight: 600; color: #fff; }
        .color-circle { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); }
        .locked-blur { filter: blur(4px); opacity: 0.5; }
        .flip-section { display: grid; gap: 8px; width: 100%; }
        .flip-section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.7); }
        .flip-note { font-size: 12px; opacity: 0.75; }
        .flip-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(11, 12, 42, 0.7);
          border-radius: 16px;
        }

        /* FLIP CARD */
        .flip-container { perspective: 1000px; height: 320px; cursor: pointer; }
        .flipper { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .flipper.flipped { transform: rotateY(180deg); }
        .front, .back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding: 20px; box-sizing: border-box; gap: 14px; }
        .front { background: linear-gradient(145deg, #1D232F 0%, #2A3B55 100%); border: 1px solid #466270; }
        .back { background: linear-gradient(145deg, #3E2020 0%, #552A2A 100%); border: 1px solid #ff6b6b; transform: rotateY(180deg); }
        .card-title { font-size: 14px; font-weight: 700; margin: 0 0 8px; text-transform: uppercase; color: #F4D73E; }
        .card-text { font-size: 16px; margin: 0; font-weight: 500; }

        /* GRID */
        .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-item { background: rgba(29, 35, 47, 0.7); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.05); position: relative; cursor: pointer; }
        .grid-item.locked { opacity: 0.6; }
        .grid-icon { width: 36px; height: 36px; object-fit: contain; }
        .lock-overlay { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.4); padding: 4px; border-radius: 6px; }
        .lock-icon { width: 14px; height: 14px; }

        `}</style>

        <img src={backgroundImage} className="dash-bg" alt="bg" />

        <div className="content-container">
        
        {/* Header */}
        <div className="header">
          <ProfileLink fullName={data?.userName} subtitle={data?.todayDate} />
          <div className="header-actions">
            <button
              type="button"
              className="preview-btn"
              onClick={() => navigate("/__preview/home")}
            >
              {t("preview.cta.home")}
            </button>
            {data?.isPremium ? (
              <div className="premium-badge">PREMIUM</div>
            ) : (
              <button onClick={() => navigate("/membership")} className="upgrade-btn">
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Today's Focus */}
        <div className="glass-box">
          <h3 className="section-title" style={{color: "#fff", opacity: 0.7}}>
            Today&apos;s Focus
            <InfoTrigger defKey="dailyElement" />
          </h3>
          <p style={{ fontSize: "18px", fontStyle: "italic", lineHeight: 1.5, margin: 0, color: "#F4D73E" }}>&quot;{data?.focusQuote}&quot;</p>
        </div>

        <div
          className="glass-box zodiac-card"
          onClick={() => {
            if (data?.zodiacSign) {
              localStorage.setItem("last_zodiac_sign", data.zodiacSign);
            }
            const signParam = data?.zodiacSign ? `?sign=${encodeURIComponent(data.zodiacSign)}` : "";
            navigate(`/zodiac-detail${signParam}`);
          }}
        >
          <div>
            <h3 className="section-title" style={{ marginBottom: 6 }}>
              Zodiac
              <InfoTrigger defKey="zodiac" />
            </h3>
            <div className="zodiac-value">{data?.zodiacSign}</div>
          </div>
          <span style={{ fontSize: 12, opacity: 0.7 }}>View details →</span>
        </div>

        {/* Yin Yang Balance (New Feature) */}
        <div className="glass-box">
          <h3 className="section-title">
            Yin Yang Balance
            <InfoTrigger defKey="yinYang" />
          </h3>
          <div className="yy-bar-bg">
            <div className="yy-bar-yin" style={{ width: `${data?.yinYang.yin}%` }} />
            <div className="yy-bar-yang" style={{ width: `${data?.yinYang.yang}%` }} />
          </div>
          <div className="yy-labels">
            <span>Yin {data?.yinYang.yin}%</span>
            <span>Yang {data?.yinYang.yang}%</span>
          </div>
        </div>

        {/* Flip Card */}
        <div className="flip-container" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`flipper ${isFlipped ? "flipped" : ""}`}>
            <div className="front">
              <div className="flip-section">
                <div className="flip-section-title">Daily Advice</div>
                <div>
                  <h4 className="card-title">✨ Daily Tip</h4>
                  <p className="card-text">{data?.flipCard.front}</p>
                  <span className="flip-note">(Tap to flip)</span>
                </div>
              </div>
              <div className="flip-section">
                <div className="flip-section-title">
                  Lucky Elements
                  <InfoTrigger defKey="luckyColor" />
                </div>
                <div className="lucky-row">
                  <div className="lucky-item">
                    <div className="color-circle" style={{ backgroundColor: data?.luckyElements.color }} />
                    <span className="lucky-label">Color</span>
                  </div>
                  <div className="lucky-item">
                    <span className="lucky-value">{data?.luckyElements.element}</span>
                    <span className="lucky-label">Element</span>
                  </div>
                  <div className="lucky-item">
                    <span className="lucky-value">{data?.luckyElements.direction}</span>
                    <span className="lucky-label">Direction</span>
                  </div>
                </div>
              </div>
              <div className="flip-section">
                <div className="flip-section-title">
                  Today&apos;s Fortune
                  <InfoTrigger defKey="fortuneInsight" />
                </div>
                <div className="lucky-row">
                  <div className="lucky-item">
                    <span className="lucky-value">{data?.fortune.luckyNumber}</span>
                    <span className="lucky-label">Number</span>
                  </div>
                  <div className="lucky-item">
                    <span className="lucky-value">{data?.fortune.compatibleSign}</span>
                    <span className="lucky-label">Sign</span>
                  </div>
                  <div className="lucky-item">
                    <span className="lucky-value" style={{ fontSize: "12px" }}>{data?.fortune.luckyTime}</span>
                    <span className="lucky-label">Time</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="back">
              <div className="flip-section">
                <div className="flip-section-title">Daily Warning</div>
                <div>
                  <h4 className="card-title" style={{ color: "#ffcccc" }}>⚠️ Warning</h4>
                  <p className="card-text" style={{ color: "#fff" }}>{data?.flipCard.back || "Take care today."}</p>
                </div>
              </div>
              <div className="flip-section">
                <div className="flip-section-title">Unlucky Elements</div>
                <div className="lucky-row">
                  <div className="lucky-item">
                    <div className={`color-circle ${!data?.isPremium ? "locked-blur" : ""}`} style={{ backgroundColor: data?.unluckyElements.color }} />
                    <span className="lucky-label">Color</span>
                  </div>
                  <div className="lucky-item">
                    <span className={`lucky-value ${!data?.isPremium ? "locked-blur" : ""}`}>{data?.unluckyElements.element}</span>
                    <span className="lucky-label">Element</span>
                  </div>
                  <div className="lucky-item">
                    <span className={`lucky-value ${!data?.isPremium ? "locked-blur" : ""}`}>{data?.unluckyElements.direction}</span>
                    <span className="lucky-label">Direction</span>
                  </div>
                </div>
              </div>
              <div className="flip-section">
                <div className="flip-section-title">Today&apos;s Misfortune</div>
                <div className="lucky-row">
                  <div className="lucky-item">
                    <span className={`lucky-value ${!data?.isPremium ? "locked-blur" : ""}`}>{data?.misfortune.unluckyNumber}</span>
                    <span className="lucky-label">Number</span>
                  </div>
                  <div className="lucky-item">
                    <span className={`lucky-value ${!data?.isPremium ? "locked-blur" : ""}`}>{data?.misfortune.challengingSign}</span>
                    <span className="lucky-label">Sign</span>
                  </div>
                  <div className="lucky-item">
                    <span className={`lucky-value ${!data?.isPremium ? "locked-blur" : ""}`} style={{ fontSize: "12px" }}>{data?.misfortune.avoidTime}</span>
                    <span className="lucky-label">Avoid</span>
                  </div>
                </div>
              </div>
               {!data?.isPremium && (
                 <div className="flip-overlay" onClick={(e) => { e.stopPropagation(); navigate("/membership"); }}>
                   <p className="card-text" style={{ marginBottom: "4px" }}>Locked for Free Users</p>
                   <button className="upgrade-btn">Unlock</button>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Destiny Insights Grid */}
        <div>
           <h3 className="section-title" style={{ marginLeft: 4 }}>Destiny Insights</h3>
           <div className="grid-container">
             {data?.destinyInsights.map((item) => (
               <div 
                 key={item.id} 
                 className={`grid-item ${item.isLocked ? "locked" : ""}`}
                 onClick={() => {
                   if (item.isLocked) navigate("/membership");
                   else navigate(`/insight/${item.id}`); 
                 }}
               >
                 {item.isLocked && <div className="lock-overlay"><img src={iconLock} className="lock-icon" alt="Locked" /></div>}
                 <img src={resolveDestinyIcon(item.id)} className="grid-icon" alt={item.label} />
                 <span className="grid-label">{item.label}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Recommendation (New Feature) */}
        <div className="glass-box">
          <h3 className="section-title">
            Daily Recommendation
            <InfoTrigger defKey="environment" />
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.5", margin: 0, filter: data?.isPremium ? "none" : "blur(4px)" }}>
            {data?.recommendation.text}
          </p>
          {!data?.isPremium && (
             <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button className="upgrade-btn" onClick={() => navigate("/membership")}>Upgrade to View</button>
             </div>
          )}
        </div>

        </div>
      </div>
    </AppShell>
  );
}
