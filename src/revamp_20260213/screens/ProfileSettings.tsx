import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { useServices } from "../services";
import {
  clearAuthUser,
  setTheme,
  usePreferences,
} from "../stores/preferencesStore";

export function ProfileSettings() {
  const navigate = useNavigate();
  const services = useServices();
  const { locale, theme, setLocale, userId, userEmail } = usePreferences();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    setLoading(true);
    await services.auth.logout();
    clearAuthUser();
    setLoading(false);
    navigate("/login", { replace: true });
  }

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="lg">
            <PageHeader
              title={t("settings.title")}
              subtitle={t("settings.subtitle")}
            />
            <SectionCard>
              <Stack gap="sm" align="start">
                <Text>{t("settings.profileSection")}</Text>
                <Stack gap="xs" align="start">
                  <Text>
                    {t("settings.userId")}{" "}
                    <span className="revamp-mutedInline">{userId ?? "-"}</span>
                  </Text>
                  <Text>
                    {t("settings.email")}{" "}
                    <span className="revamp-mutedInline">{userEmail ?? "-"}</span>
                  </Text>
                </Stack>
                <Button variant="ghost" onClick={() => navigate("/tnc?mode=viewOnly")}>
                  {t("settings.termsLink")}
                </Button>
              </Stack>
            </SectionCard>
            <SectionCard>
              <Stack gap="sm" align="start">
                <Text>{t("settings.preferencesSection")}</Text>
                <label className="revamp-formField">
                  <Text>{t("settings.languageLabel")}</Text>
                  <select
                    className="revamp-select"
                    value={locale}
                    onChange={(event) =>
                      setLocale(event.target.value as "en" | "zh-Hant")
                    }
                  >
                    <option value="en">{t("settings.languageOptions.en")}</option>
                    <option value="zh-Hant">
                      {t("settings.languageOptions.zhHant")}
                    </option>
                  </select>
                </label>
                <label className="revamp-formField">
                  <Text>{t("settings.skinLabel")}</Text>
                  <select
                    className="revamp-select"
                    value={theme}
                    onChange={(event) =>
                      setTheme(event.target.value as "yin" | "yang")
                    }
                  >
                    <option value="yang">{t("settings.skinOptions.yang")}</option>
                    <option value="yin">{t("settings.skinOptions.yin")}</option>
                  </select>
                </label>
              </Stack>
            </SectionCard>
            <SectionCard>
              <Stack gap="sm" align="start">
                <Text>{t("settings.accountSection")}</Text>
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {t("settings.logout")}
                </Button>
              </Stack>
            </SectionCard>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
