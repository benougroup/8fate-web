import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_002.png";
import iconLock from "@/assets/images/general icons/lock_icon.png";

// --- SERVICES ---
import { finalizeTime, getTimeCandidates } from "@services/endpoints/timefinder";
import { getSession, updateSession } from "@services/sessionStore";
import BackgroundScreen from "@/components/BackgroundScreen";
import LockedOverlay from "@/components/LockedOverlay";

interface TimeOption {
  id: string;
  hourLabel: string;
  description: string;
  keywords: string[];
  isLocked?: boolean;
}

type StoredProfile = {
  dateOfBirth?: string;
  timeRange?: string | null;
  timeZoneId?: string;
  country?: string;
};

function loadProfileForTimefinder(): StoredProfile | null {
  try {
    const raw =
      localStorage.getItem("profile_data") ||
      localStorage.getItem("dev_profile_data") ||
      localStorage.getItem("localProfile.v1");
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

function normalizeTimeRange(range?: string | null): "morning" | "afternoon" | "evening" | "night" {
  if (range === "afternoon") return "afternoon";
  if (range === "evening") return "evening";
  if (range === "night" || range === "midnight") return "night";
  return "morning";
}

export default function TimeFinder() {
  const navigate = useNavigate();
  const session = getSession();
  const isPremium = !!session?.isPremium;

  const [options, setOptions] = useState<TimeOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      const profile = loadProfileForTimefinder();
      const dob = profile?.dateOfBirth || new Date().toISOString().slice(0, 10);
      const timeRange = normalizeTimeRange(profile?.timeRange);
      const timeZoneId = profile?.timeZoneId || "UTC";

      const response = await getTimeCandidates({
        dob,
        timeRange,
        timeZoneId,
        location: profile?.country,
        locale: "en",
      });

      if (response.ok && response.data) {
        const mapped = response.data.windows.map((window) => ({
          id: window.id,
          hourLabel: window.title,
          description: window.description,
          keywords: window.shiChen.map((range) => range.key),
          isLocked: window.locked && !isPremium,
        }));
        setOptions(mapped);
      }

      setLoading(false);
    }
    loadOptions();
  }, [isPremium]);

  async function handleConfirm() {
    if (!selectedId || submitting) return;
    setSubmitting(true);
    const response = await finalizeTime(selectedId);
    if (response.ok) {
      updateSession({ requiresTimeSelection: false });
      navigate("/dashboard", { replace: true });
      return;
    }
    setSubmitting(false);
  }

  if (loading) return <div style={{ background: "#0B0C2A", height: "100vh" }} />;

  return (
    <BackgroundScreen
      backgroundImage={backgroundImage}
      className="tf-screen"
      contentClassName="tf-container"
    >
      <style>{`
        .tf-screen {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          justify-content: center;
          padding: 20px 0;
          overflow-y: auto;
        }
        .tf-container {
          width: 100%;
          max-width: 480px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .header { text-align: center; color: #fff; }
        .title { font-size: 20px; font-weight: 700; margin: 0 0 8px; color: #F4D73E; }
        .subtitle { font-size: 14px; opacity: 0.8; line-height: 1.5; margin: 0; }

        .nav-row { display: flex; justify-content: flex-start; }
        .back-btn {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          background: rgba(29, 35, 47, 0.6);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .option-card {
          position: relative;
          background: rgba(29, 35, 47, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          overflow: hidden;
        }
        .option-card.selected {
          background: rgba(244, 215, 62, 0.15);
          border-color: #F4D73E;
          box-shadow: 0 0 12px rgba(244, 215, 62, 0.3);
        }

        /* Locked State */
        .option-card.locked {
          cursor: pointer;
          border-color: rgba(255,255,255,0.05);
        }
        .option-card .locked-overlay__mask {
          background: rgba(11, 12, 42, 0.4);
        }

        .opt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .opt-label { color: #F4D73E; font-size: 13px; font-weight: 700; text-transform: uppercase; }
        .check-circle { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: grid; place-items: center; }
        .option-card.selected .check-circle { border-color: #F4D73E; background: #F4D73E; }
        .check-icon { font-size: 12px; color: #000; display: none; }
        .option-card.selected .check-icon { display: block; }

        .opt-desc { font-size: 14px; color: #fff; line-height: 1.4; margin: 0 0 12px; }
        .tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 11px; color: rgba(255,255,255,0.8); }

        .confirm-btn {
          width: 100%;
          height: 50px;
          border-radius: 25px;
          background: #F4D73E;
          color: #0B0C2A;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(244, 215, 62, 0.3);
          margin-top: 10px;
        }
        .confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="nav-row">
        <button type="button" className="back-btn" onClick={() => navigate("/profile-setup")}>
          Back
        </button>
      </div>

      <div className="header">
        <h1 className="title">Find Your Birth Time</h1>
        <p className="subtitle">
          Select the profile that best describes your personality. {!isPremium && "Upgrade to see all options."}
        </p>
      </div>

      <div className="cards-list">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`option-card ${selectedId === opt.id ? "selected" : ""} ${opt.isLocked ? "locked" : ""}`}
            onClick={() => {
              if (opt.isLocked) {
                navigate("/membership");
              } else {
                setSelectedId(opt.id);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              if (opt.isLocked) {
                navigate("/membership");
              } else {
                setSelectedId(opt.id);
              }
            }}
          >
            <LockedOverlay
              isLocked={!!opt.isLocked}
              lockIcon={iconLock}
              message="Premium Option"
              onUpgrade={opt.isLocked ? () => navigate("/membership") : undefined}
            >
              <div className="opt-header">
                <span className="opt-label">{opt.hourLabel}</span>
                <div className="check-circle">
                  <span className="check-icon">✓</span>
                </div>
              </div>
              <p className="opt-desc">{opt.description}</p>
              <div className="tags">
                {opt.keywords.map((keyword) => (
                  <span key={keyword} className="tag">
                    {keyword}
                  </span>
                ))}
              </div>
            </LockedOverlay>
          </div>
        ))}
      </div>

      <button className="confirm-btn" disabled={!selectedId || submitting} onClick={handleConfirm}>
        {submitting ? "Saving..." : "Confirm & Continue"}
      </button>
    </BackgroundScreen>
  );
}
