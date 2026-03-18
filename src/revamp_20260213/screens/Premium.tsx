import * as React from "react";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { useServices } from "../services";
import { usePreferences } from "../stores/preferencesStore";

export function Premium() {
  const navigate = useNavigate();
  const services = useServices();
  const { isPremium, setPremium } = usePreferences();
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const user = await services.user.getUser();
        if (active) {
          setPremium(user.isPremium);
        }
      } catch (err) {
        if (active) {
          setStatusMessage(
            err instanceof Error ? err.message : t("common.unknownError"),
          );
        }
      }
    }

    void refresh();
    return () => {
      active = false;
    };
  }, [services.user, setPremium]);

  return (
    <Page>
      <PageCard className="revamp-planShell">
        <PageContent>
          <Stack gap="lg">
            <PageHeader
              title={t("premium.title")}
              subtitle={t("premium.subtitle")}
            />
            <section className="revamp-planCard revamp-planCard--active">
              <span className="revamp-planChip">
                {isPremium ? t("premium.statusActive") : t("premium.statusInactive")}
              </span>
              <div className="revamp-planName">{t("premium.planName")}</div>
              <Text muted>{t("premium.planDescription")}</Text>
              <ul className="revamp-planFeatures">
                {[0, 1, 2].map((index) => (
                  <li key={`premium-feature-${index}`}>
                    • {t(`premium.features.${index}`)}
                  </li>
                ))}
              </ul>
              {statusMessage ? <Text>{statusMessage}</Text> : null}
              <div className="revamp-planActions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/purchase")}
                >
                  {t("premium.cta")}
                </Button>
              </div>
            </section>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
