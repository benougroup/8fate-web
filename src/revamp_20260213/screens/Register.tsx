import * as React from "react";
import { useNavigate } from "react-router-dom";
import timezonesManifest from "@/assets/data/timezones.json";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import {
  extractCountryOptions,
  extractPlaceOptions,
  extractShiChen,
  type PlaceOption,
  type ShiChenEntry,
} from "../utils/timezones";
import { useProfile } from "../stores/profileStore";

function formatTimeZoneLabel(timeZoneId: string): string {
  const date = new Date();
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timeZoneId,
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value || "UTC";
  return `${timeZoneId} (${offset})`;
}

export function Register() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const countries = React.useMemo(() => extractCountryOptions(timezonesManifest), []);
  const places = React.useMemo(() => extractPlaceOptions(timezonesManifest), []);
  const shiChenList = React.useMemo(() => extractShiChen(timezonesManifest), []);

  const [name, setName] = React.useState(profile.name || "");
  const [birthCountry, setBirthCountry] = React.useState("");
  const [livingCountry, setLivingCountry] = React.useState(profile.livingCountry || "");
  const [birthPlaceKey, setBirthPlaceKey] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [isTimeKnown, setIsTimeKnown] = React.useState(true);
  // Index into shiChenList (0–11), or "" when not selected
  const [shiChenIndex, setShiChenIndex] = React.useState<string>("");
  const [marketingConsent, setMarketingConsent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const birthPlaces = React.useMemo(() => {
    if (!birthCountry) return [];
    return places.filter((place) => place.countryCode === birthCountry);
  }, [birthCountry, places]);

  const selectedBirthPlace = birthPlaces.find((place) => place.id === birthPlaceKey);

  const isFormValid =
    name.trim() &&
    birthCountry &&
    livingCountry &&
    birthPlaceKey &&
    dateOfBirth &&
    (!isTimeKnown || shiChenIndex !== "");

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const blockIndex = isTimeKnown && shiChenIndex !== "" ? Number(shiChenIndex) : null;
      setProfile({
        name: name.trim(),
        dateOfBirthISO: dateOfBirth,
        placeOfBirth: selectedBirthPlace?.label ?? "",
        livingCountry,
        birthTimeBlockIndex: blockIndex,
        marketingConsent,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      navigate("/daily", { replace: true });
    } catch {
      setError("Failed to save profile. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Page>
      {/* Fixed-position screen — header + scrollable body + sticky footer */}
      <div className="revamp-registerScreen">

        {/* ── Header ── */}
        <div className="revamp-registerHeader">
          <button
            type="button"
            className="revamp-registerBackBtn"
            onClick={() => navigate("/login")}
            aria-label="Back"
          >
            ←
          </button>
          <div className="revamp-registerHeaderText">
            <h1 className="revamp-registerTitle">Create your profile</h1>
            <p className="revamp-registerSubtitle">Your birth details power your readings.</p>
          </div>
        </div>

        {/* ── Scrollable form body ── */}
        <form
          id="register-form"
          onSubmit={handleSubmit}
          className="revamp-registerBody"
        >

          {/* Name */}
          <div className="revamp-registerField">
            <label className="revamp-registerFieldLabel" htmlFor="reg-name">Name *</label>
            <input
              id="reg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="revamp-formInput"
              placeholder="How should we call you?"
              autoComplete="given-name"
            />
          </div>

          {/* Current country of residence */}
          <div className="revamp-registerField">
            <label className="revamp-registerFieldLabel" htmlFor="reg-living">Current country of residence *</label>
            <select
              id="reg-living"
              value={livingCountry}
              onChange={(e) => setLivingCountry(e.target.value)}
              className="revamp-formInput"
            >
              <option value="">Select where you currently live</option>
              {countries.map((option) => (
                <option key={`living-${option.code}`} value={option.name}>{option.name}</option>
              ))}
            </select>
            <span className="revamp-registerFieldHint">Used for local annual and macro-environment overlays.</span>
          </div>

          {/* Birth details section */}
          <div className="revamp-registerSection">
            <h2 className="revamp-registerSectionTitle">Birth details</h2>

            {/* Country of birth */}
            <div className="revamp-registerField">
              <label className="revamp-registerFieldLabel" htmlFor="reg-birth-country">Country of birth *</label>
              <select
                id="reg-birth-country"
                value={birthCountry}
                onChange={(e) => {
                  setBirthCountry(e.target.value);
                  setBirthPlaceKey("");
                }}
                className="revamp-formInput"
              >
                <option value="">Select country of birth</option>
                {countries.map((option) => (
                  <option key={option.code} value={option.code}>{option.name}</option>
                ))}
              </select>
            </div>

            {/* City / place of birth */}
            <div className="revamp-registerField">
              <label className="revamp-registerFieldLabel" htmlFor="reg-birth-city">City / place of birth *</label>
              <select
                id="reg-birth-city"
                value={birthPlaceKey}
                onChange={(e) => setBirthPlaceKey(e.target.value)}
                className="revamp-formInput"
                disabled={!birthCountry}
              >
                <option value="">{birthCountry ? "Select your birth city/place" : "Select country first"}</option>
                {birthPlaces.map((place: PlaceOption) => (
                  <option key={place.id} value={place.id}>{place.placeName}</option>
                ))}
              </select>
            </div>

            {/* Timezone — auto-filled, read-only */}
            {selectedBirthPlace && (
              <div className="revamp-registerField">
                <label className="revamp-registerFieldLabel">Birth timezone</label>
                <input
                  className="revamp-formInput revamp-formInput--readonly"
                  value={formatTimeZoneLabel(selectedBirthPlace.timeZoneId)}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            )}

            {/* Date of birth */}
            <div className="revamp-registerField">
              <label className="revamp-registerFieldLabel" htmlFor="reg-dob">Date of birth *</label>
              <input
                id="reg-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="revamp-formInput"
              />
            </div>

            {/* Know birth time toggle */}
            <div className="revamp-registerToggleRow">
              <span className="revamp-registerFieldLabel">I know my birth time</span>
              <label className="revamp-toggleSwitch" aria-label="Toggle birth time known">
                <input
                  type="checkbox"
                  checked={isTimeKnown}
                  onChange={(e) => {
                    setIsTimeKnown(e.target.checked);
                    setShiChenIndex("");
                  }}
                />
                <span className="revamp-toggleTrack" />
              </label>
            </div>

            {/* Shi-Chen selector or Time Finder */}
            {isTimeKnown ? (
              <div className="revamp-registerField">
                <label className="revamp-registerFieldLabel" htmlFor="reg-shichen">Birth hour (Shi-Chen) *</label>
                <select
                  id="reg-shichen"
                  value={shiChenIndex}
                  onChange={(e) => setShiChenIndex(e.target.value)}
                  className="revamp-formInput"
                >
                  <option value="">Select your birth hour</option>
                  {shiChenList.map((sc: ShiChenEntry, idx: number) => (
                    <option key={sc.key} value={String(idx)}>
                      {sc.char} {sc.key} · {sc.start}–{sc.end}
                    </option>
                  ))}
                </select>
                <span className="revamp-registerFieldHint">
                  Each Shi-Chen is a 2-hour window in the Chinese calendar.
                </span>
              </div>
            ) : (
              <div className="revamp-registerFinderWrap">
                <p className="revamp-registerFieldHint">Not sure about your birth time? Use Time Finder to narrow it down.</p>
                <Button type="button" variant="secondary" onClick={() => navigate("/timefinder?mode=onboarding")}>
                  Open Time Finder
                </Button>
              </div>
            )}
          </div>

          {/* Marketing consent */}
          <div className="revamp-registerToggleRow">
            <span className="revamp-registerFieldLabel" style={{ flex: 1, paddingRight: "12px" }}>
              Receive updates and offers (optional)
            </span>
            <label className="revamp-toggleSwitch" aria-label="Marketing consent">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
              />
              <span className="revamp-toggleTrack" />
            </label>
          </div>

        </form>

        {/* ── Sticky footer ── */}
        <div className="revamp-registerFooter">
          {error && (
            <p className="revamp-registerError">{error}</p>
          )}
          <Button
            type="submit"
            form="register-form"
            variant="primary"
            size="lg"
            disabled={!isFormValid || submitting}
            style={{ width: "100%" }}
          >
            {submitting ? "Saving…" : "Continue →"}
          </Button>
        </div>

      </div>
    </Page>
  );
}
