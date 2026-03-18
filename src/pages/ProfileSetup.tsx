import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "@/assets/images/ui/background_002.png";
import avatarImage from "@/assets/images/general icons/profile_icon.png";
import timezonesManifest from "@assets/data/timezones.json";
import BackgroundScreen from "@/components/BackgroundScreen";

import { initProfile } from "@services/endpoints/profile";
import { getSession, updateSession } from "@services/sessionStore";
import { extractCountryOptions, extractPlaceOptions, extractTimeZones } from "@/utils/timezones";
import { TIME_RANGE_OPTIONS, type CoarseTimeRange } from "@/utils/timeRanges";

type ChineseHour = { value: string; label: string };

function buildShiChen(manifest: typeof timezonesManifest): ChineseHour[] {
  const rows = Array.isArray((manifest as any)?.shiChen) ? (manifest as any).shiChen : [];
  return rows
    .filter((row: any) => row && typeof row.start === "string" && typeof row.end === "string" && typeof row.key === "string")
    .map((row: any) => ({ value: row.start as string, label: `${row.start} - ${row.end} (${row.key} Hour)` }));
}

export default function ProfileSetup() {
  const navigate = useNavigate();
  const tzOptions = useMemo(() => extractTimeZones(timezonesManifest), []);
  const countryOptions = useMemo(() => extractCountryOptions(timezonesManifest), []);
  const placeOptions = useMemo(() => extractPlaceOptions(timezonesManifest), []);
  const shichenOptions = useMemo(() => buildShiChen(timezonesManifest), []);
  const defaultTz = tzOptions.includes("Asia/Hong_Kong") ? "Asia/Hong_Kong" : tzOptions[0] || "";
  const defaultPlace = useMemo(() => {
    return (
      placeOptions.find((opt) => opt.timeZoneId === defaultTz && opt.countryCode === "HK") ??
      placeOptions.find((opt) => opt.timeZoneId === defaultTz) ??
      placeOptions[0] ??
      null
    );
  }, [placeOptions, defaultTz]);
  const defaultCountry = defaultPlace?.countryCode ?? countryOptions[0]?.code ?? "";

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [placeId, setPlaceId] = useState(defaultPlace?.id ?? "");
  const [country, setCountry] = useState(defaultCountry);
  const [timeZoneId, setTimeZoneId] = useState(defaultPlace?.timeZoneId ?? defaultTz);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isTimeKnown, setIsTimeKnown] = useState(true);
  const [exactTime, setExactTime] = useState(shichenOptions[0]?.value || "");
  const [timeRange, setTimeRange] = useState<CoarseTimeRange | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredPlaces = useMemo(() => {
    const matches = placeOptions.filter((opt) => opt.countryCode === country);
    return matches.length ? matches : placeOptions;
  }, [placeOptions, country]);

  function persistLocalProfile(profile: {
    name: string;
    gender: string;
    country: string;
    timeZoneId: string;
    dateOfBirth: string;
    exactTime: string | null;
    timeRange: CoarseTimeRange | "" | null;
  }) {
    try {
      localStorage.setItem("profile_data", JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to save profile locally", err);
    }
  }

  function completeRegistration(needsTimeFinder: boolean, isPremium?: boolean) {
    updateSession({
      name: name.trim(),
      requiresProfile: false,
      requiresTimeSelection: needsTimeFinder,
      ...(isPremium !== undefined ? { isPremium } : {}),
    });

    navigate(needsTimeFinder ? "/timefinder" : "/dashboard", { replace: true });
  }

  function handleBack() {
    navigate(-1);
  }

  function handlePlaceChange(next: string) {
    setPlaceId(next);
    const selected = placeOptions.find((opt) => opt.id === next) ?? null;
    setCountry(selected?.countryCode ?? "");
    setTimeZoneId(selected?.timeZoneId ?? "");
  }

  function handleCountryChange(next: string) {
    setCountry(next);
    const matches = placeOptions.filter((opt) => opt.countryCode === next);
    const selected = matches[0] ?? null;
    setPlaceId(selected?.id ?? "");
    setTimeZoneId(selected?.timeZoneId ?? "");
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!country) return setError("Please select your country of birth.");
    if (!placeId) return setError("Please select your place of birth.");
    if (!timeZoneId) return setError("Please select a time zone.");
    if (!dateOfBirth) return setError("Please choose your birth date.");
    if (isTimeKnown && !exactTime) return setError("Select your birth time window.");
    if (!isTimeKnown && !timeRange) return setError("Select an approximate time range.");

    setSubmitting(true);
    const localProfile = {
      name: name.trim(),
      gender,
      country: country.trim(),
      timeZoneId,
      dateOfBirth,
      exactTime: isTimeKnown ? exactTime : null,
      timeRange: isTimeKnown ? null : timeRange,
    };

    try {
      const res = await initProfile({
        name: name.trim(),
        gender: gender || undefined,
        country: country.trim(),
        timeZoneId,
        dob: dateOfBirth,
        exactTime: isTimeKnown ? exactTime : undefined,
        timeRange: !isTimeKnown ? timeRange : undefined,
        language: "English",
      });

      if (!res.ok || !res.data) {
        throw new Error(res.error?.message || "Profile setup failed. Please try again.");
      }

      const needsTimeFinder = !isTimeKnown || !!res.data.needsTimeFinder;
      persistLocalProfile(localProfile);
      completeRegistration(needsTimeFinder, res.data.isPremium);
    } catch (err) {
      console.error("Profile setup error", err);
      persistLocalProfile(localProfile);
      completeRegistration(!isTimeKnown, true);
    } finally {
      setSubmitting(false);
    }
  }

  const userName = name || getSession()?.name || "";

  return (
    <BackgroundScreen
      backgroundImage={backgroundImage}
      className="profile-setup-screen"
      contentClassName="profile-setup-content"
    >
      <style>{`
        .profile-setup-screen {
          color: #fce9c7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .profile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11,12,42,0.85) 0%, rgba(11,12,42,0.9) 60%, rgba(11,12,42,0.96) 100%);
          z-index: 0;
        }
        .profile-setup-content {
          position: relative;
          z-index: 1;
        }
        .profile-card {
          position: relative;
          z-index: 1;
          max-width: 520px;
          margin: 0 auto;
          padding: 28px 20px 48px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .back-button {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fce9c7;
          padding: 8px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .back-button:hover { border-color: rgba(244, 215, 62, 0.35); }
        .back-button:active { transform: translateY(1px); }
        .title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.3px;
          color: #f9dfa6;
        }
        .subtitle { opacity: 0.82; line-height: 1.5; }
        .avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 2px solid rgba(244, 215, 62, 0.6);
          background: rgba(255,255,255,0.08);
          display: grid;
          place-items: center;
          overflow: hidden;
          box-shadow: 0 12px 24px rgba(0,0,0,0.35);
          align-self: center;
        }
        .avatar img { width: 82%; height: 82%; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.45)); }
        form { display: grid; gap: 14px; position: relative; z-index: 1; }
        label.field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          color: #fce9c7;
        }
        .field span { opacity: 0.72; letter-spacing: 0.2px; font-size: 13px; }
        .input, .select {
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(247, 216, 148, 0.24);
          background: rgba(7, 12, 28, 0.7);
          color: #fce9c7;
          padding: 0 12px;
          font-size: 15px;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(247, 216, 148, 0.18);
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
        .help-text { color: rgba(252, 233, 199, 0.75); font-size: 13px; line-height: 1.5; }
        .error {
          background: rgba(255, 107, 107, 0.12);
          border: 1px solid rgba(255, 107, 107, 0.4);
          color: #ffcdd2;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
        }
        .submit-btn {
          margin-top: 4px;
          height: 48px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(90deg, #f7d894, #f4c43e);
          color: #0b0c2a;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.3px;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(244, 215, 62, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .submit-btn:active { transform: translateY(1px); box-shadow: 0 6px 18px rgba(244, 215, 62, 0.25); }
        .subdued { opacity: 0.7; font-size: 14px; }
        .card-surface {
          background: rgba(29, 35, 47, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 16px 32px rgba(0,0,0,0.35);
          display: grid;
          gap: 12px;
        }
      `}</style>

      <div className="profile-overlay" />

      <div className="profile-card">
        <button className="back-button" type="button" onClick={handleBack} aria-label="Back">
          <span aria-hidden>‹</span>
          <span>Back</span>
        </button>

        <div className="title">Profile Setup</div>
        <p className="subtitle">Tell us a bit about you so we can generate your BaZi chart.</p>

        <div className="avatar">
          <img src={avatarImage} alt={userName ? `${userName} avatar placeholder` : "Profile avatar"} />
        </div>

        {error && <div className="error" role="alert">{error}</div>}

        <div className="card-surface">
          <form onSubmit={handleSubmit}>
            <label className="field"> <span>Name</span>
              <input className="input" value={name} onChange={(evt) => setName(evt.target.value)} placeholder="e.g., Alex Chan" />
            </label>

            <label className="field"> <span>Gender (optional)</span>
              <select className="select" value={gender} onChange={(evt) => setGender(evt.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>

            <label className="field"> <span>Country of birth</span>
              <select className="select" value={country} onChange={(evt) => handleCountryChange(evt.target.value)}>
                <option value="">Select country</option>
                {countryOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </label>

            <label className="field"> <span>City of birth (time zone)</span>
              <select className="select" value={placeId} onChange={(evt) => handlePlaceChange(evt.target.value)}>
                <option value="">Select city</option>
                {filteredPlaces.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <div className="help-text">Your time zone is tied to the place of birth selection.</div>
            </label>

            <label className="field"> <span>Date of birth</span>
              <input className="input" type="date" value={dateOfBirth} onChange={(evt) => setDateOfBirth(evt.target.value)} />
            </label>

            <div className="toggle-row">
              <div className="toggle-label">I know my birth time</div>
              <button type="button" className="switch" data-on={isTimeKnown} aria-pressed={isTimeKnown} onClick={() => {
                const next = !isTimeKnown;
                setIsTimeKnown(next);
                if (next) { setTimeRange(""); }
                else { setExactTime(""); }
              }}>
                <span className="switch-thumb" />
              </button>
            </div>

            {isTimeKnown ? (
              <label className="field"> <span>Exact birth time (Chinese 2-hour)</span>
                <select className="select" value={exactTime} onChange={(evt) => setExactTime(evt.target.value)}>
                  <option value="">Select time window</option>
                  {shichenOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="field"> <span>Approximate time</span>
                <select
                  className="select"
                  value={timeRange}
                  onChange={(evt) => setTimeRange(evt.target.value as CoarseTimeRange)}
                >
                  <option value="">Select a period</option>
                  {TIME_RANGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            )}

            <p className="help-text subdued">We use your birth details to generate the most accurate BaZi chart.</p>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Confirm"}
            </button>
          </form>
        </div>
      </div>
    </BackgroundScreen>
  );
}
