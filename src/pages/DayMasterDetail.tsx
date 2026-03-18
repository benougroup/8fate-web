import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconBack from "@/assets/images/general icons/back_page_icon.png";

// Services
import { getDayMasterDetail } from "@services/endpoints/zodiac";
import { getSession } from "@services/sessionStore";
import AppShell from "@/components/AppShell";
import BackgroundScreen from "@/components/BackgroundScreen";
import DetailHeader from "@/components/DetailHeader";
import GlassCard from "@/components/GlassCard";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";

type DayMasterData = any; // TODO: Type properly

function getAssetPath(folder: string, name: string) {
  if (!name) return "";
  const cleanName = name.toLowerCase().trim().replace(/ /g, "_");
  return new URL(`../assets/images/${folder}/${cleanName}.png`, import.meta.url).href;
}

function getElementFromText(text: string) {
  const t = text.toLowerCase();
  if (t.includes("wood")) return "wood";
  if (t.includes("fire")) return "fire";
  if (t.includes("earth")) return "earth";
  if (t.includes("metal") || t.includes("gold")) return "gold";
  if (t.includes("water")) return "water";
  return "fire";
}

export default function DayMasterDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const session = getSession();
  const { isPremium } = session || {};

  const queryKey = params.get("key") || params.get("stem");

  const [data, setData] = useState<DayMasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getDayMasterDetail({
          key: queryKey,
          detailLevel: isPremium ? "advanced" : "beginner",
        });

        if (res.ok) {
          setData(res.data);
        } else {
          setError(res.error?.message || "Details currently unavailable for this Day Master.");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load details.");
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
        .dm-screen { padding: 20px 20px 100px; color: #fff; }
        .dm-content { display: flex; flex-direction: column; gap: 20px; }
        .section-head { color: #F4D73E; font-size: 13px; text-transform: uppercase; font-weight: 700; margin-bottom: 10px; }

        .main-icon { width: 64px; height: 64px; object-fit: contain; margin: 0 auto 12px; display: block; }
        .center-text { text-align: center; }
        .big-name { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .sub-text { font-size: 14px; opacity: 0.8; }

        .list-item { margin-bottom: 6px; font-size: 14px; line-height: 1.4; display: flex; gap: 8px; }
        .bullet { color: #F4D73E; }
      `}</style>

      <BackgroundScreen
        backgroundImage={backgroundImage}
        className="dm-screen"
        contentClassName="dm-content"
      >
        <DetailHeader title={data?.name || "Day Master"} backIcon={iconBack} onBack={() => navigate(-1)} />

        {error && <ErrorBox message={error} />}

        {data && (
          <>
            <GlassCard className="glass-card center-text">
              <img src={getAssetPath("elements", getElementFromText(data?.element || ""))} className="main-icon" alt={data?.element} />
              <div className="big-name">{data?.name}</div>
              <div className="sub-text">{data?.yinYang} {data?.element}</div>
              <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.5 }}>
                {data?.summary}
              </p>
            </GlassCard>

            {data?.traits && (
              <GlassCard>
                <div className="section-head">Key Traits</div>
                {data?.traits?.map((t: string, i: number) => (
                  <div key={i} className="list-item"><span className="bullet">•</span> {t}</div>
                ))}
              </GlassCard>
            )}

            {data?.favorable && (
              <GlassCard>
                <div className="section-head">Favorable Elements</div>
                {data?.favorable?.map((t: string, i: number) => (
                  <div key={i} className="list-item"><span className="bullet">✓</span> {t}</div>
                ))}
              </GlassCard>
            )}

            {data?.cautions && (
              <GlassCard>
                <div className="section-head" style={{ color: "#FF6B6B" }}>Weaknesses</div>
                {data?.cautions?.map((t: string, i: number) => (
                  <div key={i} className="list-item"><span className="bullet" style={{ color: "#FF6B6B" }}>!</span> {t}</div>
                ))}
              </GlassCard>
            )}

            {isPremium && data?.advanced?.notes && (
              <GlassCard className="glass-card" style={{ borderColor: "#F4D73E" }}>
                <div className="section-head">Advanced Analysis</div>
                {data.advanced.notes.map((t: string, i: number) => (
                  <div key={i} className="list-item"><span className="bullet">★</span> {t}</div>
                ))}
              </GlassCard>
            )}
          </>
        )}
      </BackgroundScreen>
    </AppShell>
  );
}
