/**
 * Settings.tsx — User settings page (revamp_20260213)
 *
 * Birthday edit rules:
 *  - Free users: 1 lifetime free edit (tracked via birthdayFreeEditUsedAt)
 *  - Premium users: 1 edit per calendar month (tracked via birthdayPremiumEditMonth)
 *  - When edit is locked, show a message explaining why and how to unlock
 */
import * as React from "react";
import { useNavigate } from "react-router-dom";
import timezonesManifest from "@/assets/data/timezones.json";
import { Button } from "../components/Button";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { InnerTopBar } from "../components/InnerTopBar";
import { t } from "../i18n/t";
import { extractCountryOptions } from "../utils/timezones";
import { useProfile } from "../stores/profileStore";
import { useServices } from "../services";
import {
  clearAuthUser,
  setTheme,
  usePreferences,
} from "../stores/preferencesStore";

/** A row with a label on the left and a toggle switch on the right */
function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="revamp-settingsToggleRow">
      <div className="revamp-settingsToggleText">
        <span className="revamp-settingsFieldLabel">{label}</span>
        {hint && <span className="revamp-settingsFieldHint">{hint}</span>}
      </div>
      <label className="revamp-toggleSwitch" aria-label={label}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="revamp-toggleTrack" />
      </label>
    </div>
  );
}

/** A row with a label and a select dropdown */
function SelectRow({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="revamp-settingsSelectRow">
      <span className="revamp-settingsFieldLabel">{label}</span>
      <select
        className="revamp-formInput revamp-formInput--compact"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

/** Returns "YYYY-MM" for the current month */
function currentYearMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function Settings() {
  const navigate = useNavigate();
  const services = useServices();
  const {
    locale,
    theme,
    setLocale,
    userEmail,
    isPremium,
  } = usePreferences();
  const [loading, setLoading] = React.useState(false);
  const [timezone, setTimezone] = React.useState("UTC+8");
  const [notifications, setNotifications] = React.useState(true);
  const [sounds, setSounds] = React.useState(true);
  const [background, setBackground] = React.useState("default");
  const countries = React.useMemo(() => extractCountryOptions(timezonesManifest), []);
  const { profile, setProfile } = useProfile();

  // ── Username edit state ─────────────────────────────────────────────────
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(profile.name || "");
  const [nameError, setNameError] = React.useState("");

  function handleNameSave() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError(t("settings.nameErrorTooShort"));
      return;
    }
    if (trimmed.length > 40) {
      setNameError(t("settings.nameErrorTooLong"));
      return;
    }
    setProfile({ name: trimmed });
    setNameError("");
    setIsEditingName(false);
  }

  function handleNameCancel() {
    setNameInput(profile.name || "");
    setNameError("");
    setIsEditingName(false);
  }

  // ── Birthday edit state ──────────────────────────────────────────────────
  const [isEditingBirthday, setIsEditingBirthday] = React.useState(false);
  const [birthdayInput, setBirthdayInput] = React.useState(profile.dateOfBirthISO || "");
  const [birthdayError, setBirthdayError] = React.useState("");

  /**
   * Determine if the user can edit their birthday:
   *  - Free: canEdit = birthdayFreeEditUsedAt === null
   *  - Premium: canEdit = birthdayPremiumEditMonth !== currentYearMonth()
   */
  const canEditBirthday = React.useMemo(() => {
    if (isPremium) {
      return profile.birthdayPremiumEditMonth !== currentYearMonth();
    }
    return profile.birthdayFreeEditUsedAt === null;
  }, [isPremium, profile.birthdayFreeEditUsedAt, profile.birthdayPremiumEditMonth]);

  const birthdayEditHint = React.useMemo(() => {
    if (canEditBirthday) {
      return isPremium
        ? t("settings.birthdayPremiumEditAvailable")
        : t("settings.birthdayEditAvailable");
    }
    return isPremium
      ? t("settings.birthdayPremiumMonthlyUsed")
      : t("settings.birthdayFreeEditUsed");
  }, [canEditBirthday, isPremium]);

  function handleBirthdaySave() {
    // Validate YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthdayInput)) {
      setBirthdayError(t("profile.errors.invalidDate"));
      return;
    }
    const parsed = new Date(birthdayInput);
    if (isNaN(parsed.getTime())) {
      setBirthdayError(t("profile.errors.invalidDate"));
      return;
    }

    // Save the new birthday
    setProfile({ dateOfBirthISO: birthdayInput });

    // Record the edit usage
    if (isPremium) {
      setProfile({ birthdayPremiumEditMonth: currentYearMonth() });
    } else {
      setProfile({ birthdayFreeEditUsedAt: new Date().toISOString() });
    }

    setBirthdayError("");
    setIsEditingBirthday(false);
  }

  function handleBirthdayCancel() {
    setBirthdayInput(profile.dateOfBirthISO || "");
    setBirthdayError("");
    setIsEditingBirthday(false);
  }

  async function handleLogout() {
    setLoading(true);
    await services.auth.logout();
    clearAuthUser();
    setLoading(false);
    navigate("/login", { replace: true });
  }

  return (
    <Page>
      <PageCard className="revamp-innerPage">
        <InnerTopBar title={t("settings.title")} />

        <div className="revamp-settingsPage revamp-innerPageContent">

          {/* ── Profile section ── */}
          <section className="revamp-settingsSection">
            <h3 className="revamp-settingsSectionTitle">{t("settings.profileSection")}</h3>

            <div className="revamp-settingsInfoRow">
              <span className="revamp-settingsFieldLabel">{t("settings.email")}</span>
              <span className="revamp-settingsValue">{userEmail ?? "—"}</span>
            </div>

            {/* ── Username edit row ── */}
            <div className="revamp-settingsBirthdaySection">
              <div className="revamp-settingsInfoRow" style={{ alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <span className="revamp-settingsFieldLabel">{t("settings.nameLabel")}</span>
                  <div style={{ marginTop: 2 }}>
                    {isEditingName ? (
                      <div className="revamp-settingsBirthdayEdit">
                        <input
                          type="text"
                          className="revamp-formInput revamp-formInput--compact"
                          value={nameInput}
                          onChange={(e) => {
                            setNameInput(e.target.value);
                            setNameError("");
                          }}
                          placeholder={t("settings.namePlaceholder")}
                          maxLength={40}
                          style={{ maxWidth: 200 }}
                          autoFocus
                        />
                        {nameError && (
                          <span className="revamp-settingsBirthdayError">{nameError}</span>
                        )}
                        <div className="revamp-settingsBirthdayActions">
                          <button
                            type="button"
                            className="revamp-settingsBirthdaySave"
                            onClick={handleNameSave}
                          >
                            {t("settings.birthdayEditSave")}
                          </button>
                          <button
                            type="button"
                            className="revamp-settingsBirthdayCancel"
                            onClick={handleNameCancel}
                          >
                            {t("settings.birthdayEditCancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="revamp-settingsValue">
                        {profile.name || "—"}
                      </span>
                    )}
                  </div>
                </div>
                {!isEditingName && (
                  <button
                    type="button"
                    className="revamp-settingsBirthdayEditBtn"
                    onClick={() => {
                      setNameInput(profile.name || "");
                      setIsEditingName(true);
                    }}
                  >
                    {t("settings.birthdayEditCta")}
                  </button>
                )}
              </div>
            </div>

            <div className="revamp-settingsInfoRow">
              <span className="revamp-settingsFieldLabel">{t("settings.status")}</span>
              <span className={`revamp-settingsBadge ${isPremium ? "revamp-settingsBadge--premium" : ""}`}>
                {isPremium ? t("settings.premium") : t("settings.free")}
              </span>
            </div>

            {/* ── Birthday edit row ── */}
            <div className="revamp-settingsBirthdaySection">
              <div className="revamp-settingsInfoRow" style={{ alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <span className="revamp-settingsFieldLabel">{t("settings.birthdayLabel")}</span>
                  <div style={{ marginTop: 2 }}>
                    {isEditingBirthday ? (
                      <div className="revamp-settingsBirthdayEdit">
                        <input
                          type="date"
                          className="revamp-formInput revamp-formInput--compact"
                          value={birthdayInput}
                          onChange={(e) => {
                            setBirthdayInput(e.target.value);
                            setBirthdayError("");
                          }}
                          style={{ maxWidth: 180 }}
                        />
                        {birthdayError && (
                          <span className="revamp-settingsBirthdayError">{birthdayError}</span>
                        )}
                        <div className="revamp-settingsBirthdayActions">
                          <button
                            type="button"
                            className="revamp-settingsBirthdaySave"
                            onClick={handleBirthdaySave}
                          >
                            {t("settings.birthdayEditSave")}
                          </button>
                          <button
                            type="button"
                            className="revamp-settingsBirthdayCancel"
                            onClick={handleBirthdayCancel}
                          >
                            {t("settings.birthdayEditCancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="revamp-settingsValue">
                        {profile.dateOfBirthISO || "—"}
                      </span>
                    )}
                  </div>
                  <div className="revamp-settingsBirthdayHint">{birthdayEditHint}</div>
                </div>
                {!isEditingBirthday && (
                  <button
                    type="button"
                    className={`revamp-settingsBirthdayEditBtn ${canEditBirthday ? "" : "revamp-settingsBirthdayEditBtn--locked"}`}
                    onClick={() => {
                      if (canEditBirthday) {
                        setBirthdayInput(profile.dateOfBirthISO || "");
                        setIsEditingBirthday(true);
                      }
                    }}
                    disabled={!canEditBirthday}
                    title={canEditBirthday ? t("settings.birthdayEditCta") : birthdayEditHint}
                  >
                    {t("settings.birthdayEditCta")}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ── Preferences section ── */}
          <section className="revamp-settingsSection">
            <h3 className="revamp-settingsSectionTitle">{t("settings.preferencesSection")}</h3>

            <SelectRow
              label={t("settings.languageLabel")}
              value={locale}
              onChange={(v) => setLocale(v as "en" | "zh-Hant")}
            >
              <option value="en">{t("settings.languageOptions.en")}</option>
              <option value="zh-Hant">{t("settings.languageOptions.zhHant")}</option>
            </SelectRow>

            <SelectRow
              label={t("settings.skinLabel")}
              value={theme}
              onChange={(v) => setTheme(v as "yin" | "yang")}
            >
              <option value="yang">{t("settings.skinOptions.yang")}</option>
              <option value="yin">{t("settings.skinOptions.yin")}</option>
            </SelectRow>

            <SelectRow
              label={t("settings.backgroundLabel")}
              value={background}
              onChange={setBackground}
            >
              <option value="default">{t("settings.backgroundOptions.default")}</option>
              <option value="grey">{t("settings.backgroundOptions.grey")}</option>
              <option value="purple">{t("settings.backgroundOptions.purple")}</option>
            </SelectRow>

            <SelectRow
              label="Current country of residence"
              value={profile.livingCountry ?? ""}
              onChange={(v) => setProfile({ livingCountry: v })}
            >
              <option value="">Select current country</option>
              {countries.map((option) => (
                <option key={`settings-living-${option.code}`} value={option.name}>
                  {option.name}
                </option>
              ))}
            </SelectRow>

            <SelectRow
              label={t("settings.timezoneLabel")}
              value={timezone}
              onChange={setTimezone}
            >
              <option value="UTC+8">UTC+8 (Hong Kong / Singapore)</option>
              <option value="UTC+9">UTC+9 (Tokyo)</option>
              <option value="UTC+0">UTC+0 (London)</option>
              <option value="UTC-5">UTC-5 (New York)</option>
              <option value="UTC-8">UTC-8 (Los Angeles)</option>
            </SelectRow>

            <ToggleRow
              label={t("settings.notificationsLabel")}
              hint={t("settings.notificationsHint")}
              checked={notifications}
              onChange={setNotifications}
            />

            <ToggleRow
              label={t("settings.soundsLabel")}
              hint={t("settings.soundsHint")}
              checked={sounds}
              onChange={setSounds}
            />
          </section>

          {/* ── Account section ── */}
          <section className="revamp-settingsSection">
            <h3 className="revamp-settingsSectionTitle">{t("settings.accountSection")}</h3>

            <button
              type="button"
              className="revamp-settingsActionRow"
              onClick={() => navigate("/terms?mode=viewOnly")}
            >
              <span>{t("settings.viewTerms")}</span>
              <span className="revamp-settingsChevron">›</span>
            </button>

            <button
              type="button"
              className={`revamp-settingsActionRow ${isPremium ? "" : "revamp-settingsActionRow--accent"}`}
              onClick={() => navigate(isPremium ? "/premium/manage" : "/premium")}
            >
              <span>{isPremium ? t("settings.managePremium") : t("settings.upgradePremium")}</span>
              <span className="revamp-settingsChevron">›</span>
            </button>
          </section>

          {/* ── Logout ── */}
          <div className="revamp-settingsLogout">
            <Button
              variant="danger"
              size="md"
              onClick={handleLogout}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? t("settings.loggingOut") : t("settings.logout")}
            </Button>
          </div>

        </div>
      </PageCard>

      <FloatingRadialNav />
    </Page>
  );
}
