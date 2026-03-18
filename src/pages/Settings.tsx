import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- ASSETS ---
import backgroundImage from "@/assets/images/ui/background_002.png";
import avatarImage from "@/assets/images/general icons/profile_icon.png";
import timezonesManifest from "@assets/data/timezones.json";
import { resolveImage } from "@/utils/imageResolver";

// --- COMPONENTS ---
import AppShell from "@/components/AppShell";
import BackgroundScreen from "@/components/BackgroundScreen";
import GlassCard from "@/components/GlassCard";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/Button";
import ErrorBox from "@/components/ErrorBox";

// --- SERVICES ---
import { useSession } from "@/hooks/useSession";
import { setSession, clearSession } from "@services/sessionStore";
import { updateProfile } from "@services/endpoints/profile";
import { extractCountryOptions, extractPlaceOptions } from "@/utils/timezones";
import { TIME_RANGE_OPTIONS, type CoarseTimeRange } from "@/utils/timeRanges";

type ProfileData = {
  name?: string;
  gender?: string;
  dob?: string;
  dateOfBirth?: string;
  exactTime?: string | null;
  birthTime?: string;
  timeRange?: CoarseTimeRange | "midnight" | null;
  country?: string;
  language?: string;
  timeZoneId?: string;
};

type ChineseHour = { value: string; label: string };

function buildShiChen(manifest: typeof timezonesManifest): ChineseHour[] {
  const rows = Array.isArray((manifest as any)?.shiChen) ? (manifest as any).shiChen : [];
  return rows
    .filter((row: any) => row && typeof row.start === "string" && typeof row.end === "string" && typeof row.key === "string")
    .map((row: any) => ({ value: row.start as string, label: `${row.start} - ${row.end} (${row.key} Hour)` }));
}

function loadLocalProfile(): ProfileData | null {
  const sources = ["profile_data", "localProfile.v1", "dev_profile_data"];
  for (const key of sources) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      return JSON.parse(raw) as ProfileData;
    } catch (err) {
      console.warn("Failed to parse local profile data", err);
    }
  }
  return null;
}

export default function Settings() {
  const navigate = useNavigate();
  const [session] = useSession();
  const isPremium = !!session?.isPremium;
  const badgeIcon = resolveImage(isPremium ? "badges/premium.png" : "badges/free_logo.png");

  // --- LOCAL STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState(session?.name || "");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [exactTime, setExactTime] = useState("");
  const [timeRange, setTimeRange] = useState<CoarseTimeRange | "">("");
  const [isTimeKnown, setIsTimeKnown] = useState(true);
  const [country, setCountry] = useState("HK");
  const [language, setLanguage] = useState("en");
  const [timeZoneId, setTimeZoneId] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({});

  const placeOptions = useMemo(() => extractPlaceOptions(timezonesManifest), []);
  const countryOptions = useMemo(() => extractCountryOptions(timezonesManifest), []);
  const shichenOptions = useMemo(() => buildShiChen(timezonesManifest), []);
  const filteredPlaces = useMemo(() => {
    const matches = placeOptions.filter((option) => option.countryCode === country);
    return matches.length ? matches : placeOptions;
  }, [placeOptions, country]);

  // Load initial values (Mocking "Get Profile" from session/local storage)
  useEffect(() => {
    if (!session) return;
    setName(session.name || "");
  }, [session]);

  useEffect(() => {
    setProfileData(loadLocalProfile() ?? {});
  }, []);

  useEffect(() => {
    if (!profileData) return;
    setName(profileData.name || session?.name || "");
    setGender(profileData.gender || "");
    const resolvedDob = profileData.dob || profileData.dateOfBirth || "";
    const resolvedExactTime = profileData.exactTime || profileData.birthTime || "";
    const resolvedRange = profileData.timeRange === "midnight" ? "night" : profileData.timeRange;
    const resolvedCountry = profileData.country || "HK";
    const resolvedTimeZoneId = profileData.timeZoneId || "";
    const matchedPlace =
      placeOptions.find((option) => option.countryCode === resolvedCountry && option.timeZoneId === resolvedTimeZoneId) ||
      placeOptions.find((option) => option.timeZoneId === resolvedTimeZoneId);
    setDob(resolvedDob);
    setExactTime(resolvedExactTime || "");
    setTimeRange((resolvedRange as CoarseTimeRange) || "");
    setIsTimeKnown(!!resolvedExactTime);
    setCountry(resolvedCountry);
    setLanguage(profileData.language || "en");
    setTimeZoneId(resolvedTimeZoneId);
    setPlaceId(matchedPlace?.id || "");
  }, [profileData, session, placeOptions]);

  // --- HANDLERS ---

  const handleSave = async () => {
    setError(null);
    setMessage(null);

    // 1. Check Quota for Free Users (Birth Data Changes)
    // Note: In a real app, the server enforces this. Here we mock the check.
    const isBirthDataChanged = dob !== "" || exactTime !== "" || timeRange !== "" || country !== "HK";

    if (isBirthDataChanged && !isPremium) {
      const editsUsed = parseInt(localStorage.getItem("birth_edit_quota") || "0");
      if (editsUsed >= 1) {
        setError("Free users can only update birth details once. Please upgrade to edit.");
        return;
      }
      // Increment quota
      localStorage.setItem("birth_edit_quota", (editsUsed + 1).toString());
    }

    // 2. Call API
    try {
      // We only send Name for session update in this MVP, but we'd send all fields to backend
      const res = await updateProfile({
        name,
        dob: dob || undefined,
        exactTime: isTimeKnown ? (exactTime || undefined) : undefined,
        timeRange: isTimeKnown ? undefined : (timeRange || undefined),
        country: country || undefined,
        timeZoneId: timeZoneId || undefined,
      });

      if (res.ok) {
        // Update Session Client-Side
        if (session) setSession({ ...session, name });
        const nextProfile: ProfileData = {
          name,
          gender,
          dob,
          dateOfBirth: dob,
          exactTime: isTimeKnown ? (exactTime || null) : null,
          birthTime: isTimeKnown ? exactTime : "",
          timeRange: isTimeKnown ? null : (timeRange || null),
          country,
          language,
          timeZoneId,
        };
        localStorage.setItem("profile_data", JSON.stringify(nextProfile));
        setProfileData(nextProfile);

        setMessage("Profile updated successfully.");
        setIsEditing(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setError(res.error?.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      clearSession();
      navigate("/login", { replace: true });
    }
  };

  const handlePlaceChange = (nextPlaceId: string) => {
    setPlaceId(nextPlaceId);
    const selected = placeOptions.find((option) => option.id === nextPlaceId);
    setCountry(selected?.countryCode ?? "");
    setTimeZoneId(selected?.timeZoneId ?? "");
  };

  const handleCountryChange = (nextCountry: string) => {
    setCountry(nextCountry);
    const matches = placeOptions.filter((option) => option.countryCode === nextCountry);
    const selected = matches[0];
    setPlaceId(selected?.id ?? "");
    setTimeZoneId(selected?.timeZoneId ?? "");
  };

  return (
    <AppShell>
      <style>{`
        .settings-screen {
          padding-bottom: 90px;
          overflow-y: auto;
          color: #fff;
        }
        .content-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .page-title { font-size: 24px; font-weight: 700; margin: 0 0 10px 0; }

        .settings-card {
          background: rgba(29, 35, 47, 0.6);
          border-color: rgba(70, 98, 112, 0.3);
        }
        .section-title {
          color: #F4D73E; font-size: 13px; text-transform: uppercase;
          letter-spacing: 1px; margin: 0 0 16px 0; font-weight: 700;
        }

        .avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .avatar-img {
          width: 64px; height: 64px; border-radius: 50%;
          border: 2px solid #F4D73E; padding: 4px; background: rgba(0,0,0,0.3); object-fit: contain;
        }
        .user-info { display: flex; flex-direction: column; gap: 6px; }
        .user-name { font-size: 18px; font-weight: 700; }
        .status-row { display: flex; align-items: center; gap: 10px; }
        .status-badge-icon { width: 22px; height: 22px; object-fit: contain; }

        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .label { font-size: 13px; color: rgba(255,255,255,0.7); }
        .input {
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 12px; color: #fff; font-size: 15px; outline: none;
          width: 100%;
        }
        .input:disabled { opacity: 0.5; cursor: not-allowed; border-color: transparent; background: rgba(255,255,255,0.05); }
        .input:focus { border-color: #F4D73E; }

        .btn-row { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 14px;
          border-radius: 14px;
        }
        .toggle-label { font-weight: 700; letter-spacing: 0.3px; }
        .switch {
          width: 50px;
          height: 26px;
          background: rgba(255,255,255,0.15);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .switch:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .switch[data-on="true"] { background: rgba(244, 215, 62, 0.5); border-color: rgba(244, 215, 62, 0.7); }
        .switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0b0c2a;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          transition: transform 0.2s ease;
        }
        .switch[data-on="true"] .switch-thumb { transform: translateX(24px); }
        .helper-text {
          font-size: 12px;
          opacity: 0.7;
        }
        .version-text { text-align: center; font-size: 12px; opacity: 0.4; margin-top: 20px; }
      `}</style>

      <BackgroundScreen
        backgroundImage={backgroundImage}
        className="settings-screen"
        contentClassName="content-container"
      >
        <h1 className="page-title">Settings</h1>

        {message && (
          <ErrorBox
            tone="success"
            message={message}
            onClose={() => setMessage(null)}
            dismissible
          />
        )}
        {error && (
          <ErrorBox tone="error" message={error} onClose={() => setError(null)} dismissible />
        )}

        {/* Account Status */}
        <GlassCard className="glass-card settings-card">
          <div className="avatar-row">
            <img src={avatarImage} className="avatar-img" alt="Avatar" />
            <div className="user-info">
              <div className="user-name">{session?.name || "Fate User"}</div>
              <div className="status-row">
                <img src={badgeIcon} className="status-badge-icon" alt={isPremium ? "Premium" : "Free"} />
                <StatusBadge status={isPremium ? "premium" : "free"} />
              </div>
            </div>
          </div>
          {!isPremium && (
            <Button variant="primary" onClick={() => navigate("/upgrade")} style={{ width: "100%" }}>
              Upgrade to Premium
            </Button>
          )}
        </GlassCard>

        {/* Profile Form */}
        <GlassCard className="glass-card settings-card">
          <div className="section-title">Profile Information</div>

          {/* Display Name */}
          <div className="form-group">
            <label className="label">Display Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </div>

            {/* Gender */}
            <div className="form-group">
              <label className="label">Gender</label>
              <select
                className="input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditing}
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Language */}
            <div className="form-group">
              <label className="label">Language</label>
              <select
                className="input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={!isEditing}
              >
                <option value="en">English</option>
              </select>
            </div>

            <div style={{ height: 16 }} />
            <div className="section-title" style={{ fontSize: 12, opacity: 0.8 }}>
              Birth Data
            </div>

            {/* Country of Birth */}
            <div className="form-group">
              <label className="label">Country of Birth</label>
              <select
                className="input"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                disabled={!isEditing}
              >
                <option value="">Select country</option>
                {countryOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City of Birth */}
            <div className="form-group">
              <label className="label">City of Birth (time zone)</label>
              <select
                className="input"
                value={placeId}
                onChange={(e) => handlePlaceChange(e.target.value)}
                disabled={!isEditing}
              >
                <option value="">Select city</option>
                {filteredPlaces.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="label">Date of Birth</label>
              <input
                type="date"
                className="input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <div className="toggle-row">
                <div className="toggle-label">I know my birth time</div>
                <button
                  type="button"
                  className="switch"
                  data-on={isTimeKnown}
                  aria-pressed={isTimeKnown}
                  onClick={() => {
                    if (!isEditing) return;
                    const next = !isTimeKnown;
                    setIsTimeKnown(next);
                    if (next) {
                      setTimeRange("");
                    } else {
                      setExactTime("");
                    }
                  }}
                  disabled={!isEditing}
                >
                  <span className="switch-thumb" />
                </button>
              </div>
            </div>

            {isTimeKnown ? (
              <div className="form-group">
                <label className="label">Birth Time Range (Chinese 2-hour)</label>
                <select
                  className="input"
                  value={exactTime}
                  onChange={(e) => {
                    setExactTime(e.target.value);
                    if (e.target.value) setTimeRange("");
                  }}
                  disabled={!isEditing}
                >
                  <option value="">Select time window</option>
                  {shichenOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="label">Approximate Time Range</label>
                  <select
                    className="input"
                    value={timeRange}
                    onChange={(e) => {
                      setTimeRange(e.target.value as CoarseTimeRange);
                      if (e.target.value) setExactTime("");
                    }}
                    disabled={!isEditing}
                  >
                    <option value="">Select a range</option>
                    {TIME_RANGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="helper-text">Not sure? Use the premium Time Finder to refine your birth time.</div>
                </div>
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(isPremium ? "/timefinder" : "/upgrade")}
                  >
                    Use Time Finder
                  </Button>
                )}
              </>
            )}

            {/* Actions */}
            {isEditing ? (
              <div className="btn-row">
                <Button variant="primary" size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
        </GlassCard>

        {/* System */}
        <GlassCard className="glass-card settings-card">
          <div className="section-title">System</div>
          <div className="btn-row">
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </GlassCard>

        <div className="version-text">v1.0.0 Beta</div>
      </BackgroundScreen>
    </AppShell>
  );
}
