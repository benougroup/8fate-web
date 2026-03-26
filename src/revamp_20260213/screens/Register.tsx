/**
 * Register.tsx
 *
 * User profile registration screen.
 *
 * Changes from original:
 *  - Submit button renamed from "Continue →" to "Register"
 *  - Per-field validation: each required field shows an inline error when the
 *    user tries to submit without filling it in (instead of a single generic error)
 *  - Birth time selection replaced with a 4-slot time-of-day picker:
 *      Midnight  00:00–06:00  (3 Shi-Chen: Zi, Chou, Yin)
 *      Morning   06:00–12:00  (3 Shi-Chen: Mao, Chen, Si)
 *      Afternoon 12:00–18:00  (3 Shi-Chen: Wu, Wei, Shen)
 *      Night     18:00–00:00  (3 Shi-Chen: You, Xu, Hai)
 *    Each slot shows AI-generated personality traits to help users identify
 *    their birth window. Selecting a slot navigates to Time Finder for the
 *    final 3-slot confirmation.
 *  - "I don't know my birth time" → Time Finder button (menu hidden there)
 */

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

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTimeZoneLabel(timeZoneId: string): string {
  const date = new Date();
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timeZoneId,
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value || "UTC";
  return `${timeZoneId} (${offset})`;
}

// ── Field error type ───────────────────────────────────────────────────────

type FieldErrors = {
  name?: string;
  livingCountry?: string;
  birthCountry?: string;
  birthPlaceKey?: string;
  dateOfBirth?: string;
  timeSlot?: string;
};

// ── Component ──────────────────────────────────────────────────────────────

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
  // If user knows exact Shi-Chen
  const [isTimeKnown, setIsTimeKnown] = React.useState(false);
  const [shiChenIndex, setShiChenIndex] = React.useState<string>("");
  const [marketingConsent, setMarketingConsent] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const birthPlaces = React.useMemo(() => {
    if (!birthCountry) return [];
    return places.filter((place) => place.countryCode === birthCountry);
  }, [birthCountry, places]);

  const selectedBirthPlace = birthPlaces.find((place) => place.id === birthPlaceKey);

  // Clear field error when user fills in the field
  function clearError(field: keyof FieldErrors) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Please enter your name.";
    if (!livingCountry) errors.livingCountry = "Please select your current country of residence.";
    if (!birthCountry) errors.birthCountry = "Please select your country of birth.";
    if (!birthPlaceKey) errors.birthPlaceKey = "Please select your birth city or place.";
    if (!dateOfBirth) errors.dateOfBirth = "Please enter your date of birth.";
    if (isTimeKnown && shiChenIndex === "") {
      errors.timeSlot = "Please select your birth Shi-Chen.";
    }
    return errors;
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstErrorEl = document.querySelector(".revamp-fieldError");
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      let blockIndex: number | null = null;
      if (isTimeKnown && shiChenIndex !== "") {
        blockIndex = Number(shiChenIndex);
      }

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
      setFieldErrors({ name: "Failed to save profile. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <div className="revamp-registerScreen">

        {/* ── Header ── */}
        <div className="revamp-registerHeader">
          <button
            type="button"
            className="revamp-registerBackBtn"
            onClick={() => navigate("/terms?mode=onboarding")}
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
              onChange={(e) => { setName(e.target.value); clearError("name"); }}
              className={`revamp-formInput${fieldErrors.name ? " revamp-formInput--error" : ""}`}
              placeholder="How should we call you?"
              autoComplete="given-name"
            />
            {fieldErrors.name && <span className="revamp-fieldError">{fieldErrors.name}</span>}
          </div>

          {/* Current country of residence */}
          <div className="revamp-registerField">
            <label className="revamp-registerFieldLabel" htmlFor="reg-living">Current country of residence *</label>
            <select
              id="reg-living"
              value={livingCountry}
              onChange={(e) => { setLivingCountry(e.target.value); clearError("livingCountry"); }}
              className={`revamp-formInput${fieldErrors.livingCountry ? " revamp-formInput--error" : ""}`}
            >
              <option value="">Select where you currently live</option>
              {countries.map((option) => (
                <option key={`living-${option.code}`} value={option.name}>{option.name}</option>
              ))}
            </select>
            {fieldErrors.livingCountry && <span className="revamp-fieldError">{fieldErrors.livingCountry}</span>}
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
                  clearError("birthCountry");
                  clearError("birthPlaceKey");
                }}
                className={`revamp-formInput${fieldErrors.birthCountry ? " revamp-formInput--error" : ""}`}
              >
                <option value="">Select country of birth</option>
                {countries.map((option) => (
                  <option key={option.code} value={option.code}>{option.name}</option>
                ))}
              </select>
              {fieldErrors.birthCountry && <span className="revamp-fieldError">{fieldErrors.birthCountry}</span>}
            </div>

            {/* City / place of birth */}
            <div className="revamp-registerField">
              <label className="revamp-registerFieldLabel" htmlFor="reg-birth-city">City / place of birth *</label>
              <select
                id="reg-birth-city"
                value={birthPlaceKey}
                onChange={(e) => { setBirthPlaceKey(e.target.value); clearError("birthPlaceKey"); }}
                className={`revamp-formInput${fieldErrors.birthPlaceKey ? " revamp-formInput--error" : ""}`}
                disabled={!birthCountry}
              >
                <option value="">{birthCountry ? "Select your birth city/place" : "Select country first"}</option>
                {birthPlaces.map((place: PlaceOption) => (
                  <option key={place.id} value={place.id}>{place.placeName}</option>
                ))}
              </select>
              {fieldErrors.birthPlaceKey && <span className="revamp-fieldError">{fieldErrors.birthPlaceKey}</span>}
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
                onChange={(e) => { setDateOfBirth(e.target.value); clearError("dateOfBirth"); }}
                className={`revamp-formInput${fieldErrors.dateOfBirth ? " revamp-formInput--error" : ""}`}
              />
              {fieldErrors.dateOfBirth && <span className="revamp-fieldError">{fieldErrors.dateOfBirth}</span>}
            </div>

            {/* Birth time section */}
            <div className="revamp-registerField">
              <div className="revamp-registerToggleRow" style={{ marginBottom: "12px" }}>
                <span className="revamp-registerFieldLabel">I know my exact birth time</span>
                <label className="revamp-toggleSwitch" aria-label="Toggle birth time known">
                  <input
                    type="checkbox"
                    checked={isTimeKnown}
                    onChange={(e) => {
                      setIsTimeKnown(e.target.checked);
                      setShiChenIndex("");
                      clearError("timeSlot");
                    }}
                  />
                  <span className="revamp-toggleTrack" />
                </label>
              </div>

              {isTimeKnown ? (
                /* Exact Shi-Chen selector */
                <>
                  <select
                    id="reg-shichen"
                    value={shiChenIndex}
                    onChange={(e) => { setShiChenIndex(e.target.value); clearError("timeSlot"); }}
                    className={`revamp-formInput${fieldErrors.timeSlot ? " revamp-formInput--error" : ""}`}
                  >
                    <option value="">Select your birth Shi-Chen (2-hour window)</option>
                    {shiChenList.map((sc: ShiChenEntry, idx: number) => (
                      <option key={sc.key} value={String(idx)}>
                        {sc.char} {sc.key} · {sc.start}–{sc.end}
                      </option>
                    ))}
                  </select>
                  <span className="revamp-registerFieldHint">
                    Each Shi-Chen is a 2-hour window in the Chinese calendar.
                  </span>
                </>
              ) : (
                /* Unknown birth time — send to Time Finder to narrow it down */
                <>
                  <p className="revamp-registerFieldHint" style={{ marginBottom: "12px" }}>
                    Not sure of your exact birth time? Use Time Finder to narrow it down.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    style={{ width: "100%" }}
                    onClick={() => {
                      setProfile({
                        name: name.trim(),
                        dateOfBirthISO: dateOfBirth,
                        placeOfBirth: birthPlaces.find((p) => p.id === birthPlaceKey)?.label ?? "",
                        livingCountry,
                        marketingConsent,
                      });
                      navigate("/timefinder?mode=onboarding");
                    }}
                  >
                    Use Time Finder →
                  </Button>
                </>
              )}

              {fieldErrors.timeSlot && (
                <span className="revamp-fieldError">{fieldErrors.timeSlot}</span>
              )}
            </div>
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
          <Button
            type="submit"
            form="register-form"
            variant="primary"
            size="lg"
            disabled={submitting}
            style={{ width: "100%" }}
          >
            {submitting ? "Saving…" : "Register"}
          </Button>
        </div>

      </div>
    </Page>
  );
}
