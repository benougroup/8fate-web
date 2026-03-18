import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PillLink } from "../components/PillButton";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { ENV } from "../config/env";
import { t } from "../i18n/t";
import { useServices } from "../services";
import { usePreferences } from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";

export function Login() {
  const navigate = useNavigate();
  const services = useServices();
  const { setAuthUser, setPremium, hasAcceptedTnc } = usePreferences();
  const { setProfile } = useProfile();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);

      if (!ENV.useMock) {
        await services.auth.startGoogleLogin();
        return;
      }

      const user = await services.auth.devMockLogin();

      setAuthUser({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        lastLoginProvider: ENV.useMock ? "dev" : "google",
      });
      setPremium(user.isPremium);
      setProfile({ name: user.name });

      if (!hasAcceptedTnc) {
        navigate("/tnc?mode=onboarding", { replace: true });
      } else {
        navigate("/daily", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.unknownError"));
      setLoading(false);
    }
  }

  return (
    <Page>
      <PageCard className="revamp-authCard">
        <PageContent className="revamp-content--full">
          <Stack gap="lg" align="center">
            <Stack gap="xs" align="center">
              <h1 className="title">{t("auth.login.title")}</h1>
              <Text muted>{t("auth.login.subtitle")}</Text>
            </Stack>
            <Stack gap="sm" align="center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleLogin}
                disabled={loading}
              >
                {ENV.useMock ? t("auth.login.dev") : t("auth.login.google")}
              </Button>
              {loading ? (
                <Text muted>{t("auth.login.loading")}</Text>
              ) : null}
              {error ? <Text>{error}</Text> : null}
              <Text className="revamp-loginLegal">
                {t("auth.login.legal")}{" "}
                <PillLink to="/tnc?mode=viewOnly">
                  {t("auth.login.legalLink")}
                </PillLink>
              </Text>
            </Stack>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
