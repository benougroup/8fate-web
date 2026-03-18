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

export function Settings() {
  const navigate = useNavigate();
  const services = useServices();
  const {
    locale,
    theme,
    setLocale,
    userId,
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

            <div className="revamp-settingsInfoRow">
              <span className="revamp-settingsFieldLabel">{t("settings.status")}</span>
              <span className={`revamp-settingsBadge ${isPremium ? "revamp-settingsBadge--premium" : ""}`}>
                {isPremium ? t("settings.premium") : t("settings.free")}
              </span>
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
