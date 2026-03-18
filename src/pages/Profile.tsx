import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import timezonesManifest from "@assets/data/timezones.json";
import { getProfile, updateProfile, type ProfileData } from "@services/endpoints/profile";
import { getSession } from "@services/sessionStore";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";
import Button from "@/components/Button";
import { useLocalCache } from "@/hooks/useLocalCache";
import { extractCountryOptions, extractTimeZones, normalizeCountryValue } from "@/utils/timezones";
import { TIME_RANGE_OPTIONS, type CoarseTimeRange } from "@/utils/timeRanges";

const LOCAL_PROFILE_KEY = "localProfile.v1" as const;

export default function Profile() {
  const navigate = useNavigate();
  const tzOptions = useMemo(() => extractTimeZones(timezonesManifest), []);
  const countryOptions = useMemo(() => extractCountryOptions(timezonesManifest), []);

  const [cached, setCached] = useLocalCache<ProfileData | null>(LOCAL_PROFILE_KEY, null);
  const [profile, setProfile] = useState<ProfileData | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [country, setCountry] = useState("");
  const [timeZoneId, setTimeZoneId] = useState("");
  const [dob, setDob] = useState("");
  const [exactTime, setExactTime] = useState("");
  const [timeRange, setTimeRange] = useState<CoarseTimeRange | "">("");

  function loadLegacyProfile(): ProfileData | null {
    try {
      const raw =
        localStorage.getItem("profile_data") ??
        localStorage.getItem("dev_profile_data");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as {
        name?: string;
        country?: string;
        timeZoneId?: string;
        dateOfBirth?: string;
        exactTime?: string | null;
        timeRange?: CoarseTimeRange | null;
      };
      const session = getSession();
      return {
        userKey: session?.userKey ?? "",
        name: session?.name ?? parsed?.name ?? "",
        country: parsed?.country ?? "",
        timeZoneId: parsed?.timeZoneId ?? "",
        dob: parsed?.dateOfBirth ?? "",
        exactTime: parsed?.exactTime ?? null,
        timeRange: parsed?.timeRange ?? null,
        isPremium: session?.isPremium ?? false,
      };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (profile) return;
    const legacy = loadLegacyProfile();
    if (!legacy) return;
    setProfile(legacy);
    setCached(legacy);
    setCountry(normalizeCountryValue(legacy.country, countryOptions));
    setTimeZoneId(legacy.timeZoneId);
    setDob(legacy.dob);
    setExactTime(legacy.exactTime ?? "");
    setTimeRange(legacy.timeRange ?? "");
  }, [profile, setCached, countryOptions]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(!profile);
      setError(null);
      const res = await getProfile();
      if (cancelled) return;
      if (res.ok && res.data) {
        const data = res.data;
        setProfile(data);
        setCached(data);
        setCountry(normalizeCountryValue(data.country, countryOptions));
        setTimeZoneId(data.timeZoneId);
        setDob(data.dob);
        setExactTime(data.exactTime ?? "");
        setTimeRange(data.timeRange ?? "");
      } else {
        setError(res.error?.message || "Unable to load profile");
      }
      setLoading(false);
    }

    load().catch((err: unknown) => {
      if (cancelled) return;
      setLoading(false);
      setError(err instanceof Error ? err.message : "Unexpected error");
    });

    return () => {
      cancelled = true;
    };
  }, [countryOptions]);

  async function onSave(evt: React.FormEvent) {
    evt.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    const partial = {
      country,
      timeZoneId,
      dob,
      exactTime: exactTime || undefined,
      timeRange: exactTime ? undefined : (timeRange || undefined),
    } as const;
    const res = await updateProfile(partial);
    if (res.ok) {
      const next: ProfileData = {
        ...(profile ?? {
          userKey: "", name: "", country: "", timeZoneId: "", dob: "", isPremium: false,
        }),
        country,
        timeZoneId,
        dob,
        exactTime: exactTime || null,
        timeRange: exactTime ? null : (timeRange || null),
      };
      setProfile(next);
      setCached(next);
    } else {
      setError(res.error?.message || "Could not save profile");
    }
    setSaving(false);
  }

  return (
    <AppShell>
      <div style={wrap}>
        <PageHeader
          sticky
          title={<div style={headerTitle}>Profile</div>}
          actions={<Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>}
        />

        {loading && !profile && (
          <div style={center}><Loader label="Loading profile…" /></div>
        )}

        {!loading && error && !profile && (
          <div style={center}><ErrorBox message={error} /></div>
        )}

        {profile && (
          <Card>
            {error && (
              <div style={{ marginBottom: 12 }}>
                <ErrorBox message={error} />
              </div>
            )}

            <form style={form} onSubmit={onSave}>
              <Field label="Place of birth">
                <select style={input} value={country} onChange={(evt) => setCountry(evt.target.value)}>
                  <option value="">Select a country</option>
                  {!countryOptions.some((opt) => opt.code === country) && country && (
                    <option value={country}>{country}</option>
                  )}
                  {countryOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>{opt.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Time zone">
                <select style={input} value={timeZoneId} onChange={(evt) => setTimeZoneId(evt.target.value)}>
                  {tzOptions.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </Field>

              <Field label="Date of birth">
                <input style={input} type="date" value={dob} onChange={(evt) => setDob(evt.target.value)} />
              </Field>

              <Field label="Exact birth time">
                <input style={input} type="time" value={exactTime} onChange={(evt) => setExactTime(evt.target.value)} />
              </Field>

              {!exactTime && (
                <Field label="Approximate period">
                  <select style={input} value={timeRange} onChange={(evt) => setTimeRange(evt.target.value as CoarseTimeRange)}>
                    <option value="">Select a range</option>
                    {TIME_RANGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>
              )}

              <div style={actions}>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button variant="ghost" type="button" onClick={() => navigate("/timefinder")}>Adjust in Timefinder</Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={field}>
      <span style={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

const wrap: React.CSSProperties = { padding: "18px 20px 48px", display: "flex", flexDirection: "column", gap: 20 };
const headerTitle: React.CSSProperties = { fontSize: "1.3rem", fontWeight: 700 };
const center: React.CSSProperties = { minHeight: "60vh", display: "grid", placeItems: "center" };
const form: React.CSSProperties = { display: "grid", gap: 16 };
const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const fieldLabel: React.CSSProperties = { fontSize: 12, letterSpacing: 0.3, textTransform: "uppercase", opacity: 0.7 };
const input: React.CSSProperties = {
  height: 42,
  borderRadius: 12,
  border: "1px solid rgba(247, 216, 148, 0.24)",
  background: "rgba(7, 12, 28, 0.7)",
  color: "#fce9c7",
  padding: "0 12px",
};
const actions: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
