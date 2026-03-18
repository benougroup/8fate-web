import React from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@services/sessionStore";
import iconStart from "@/assets/images/general icons/start_icon.png";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { useProfile } from "../stores/profileStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const session = getSession();
  const { profile, setProfile } = useProfile();
  const name = session?.name || profile.name || t("register.fallbackName");
  const email = t("register.fallbackEmail");
  const [displayName, setDisplayName] = React.useState(name);

  const handleStart = () => {
    // Flow: Register -> (Optional) Time Finder -> Success -> Daily
    setProfile({ name: displayName.trim() });
    navigate("/timefinder?mode=onboarding");
  };

  return (
    <Page>
      <PageCard className="revamp-authCard">
        <PageContent className="revamp-content--full">
          <Stack gap="lg" align="center">
            <div className="revamp-authIconWrap">
              <img src={iconStart} className="revamp-authIcon" alt={t("register.iconAlt")} />
            </div>

            <div className="revamp-authHero">
              <PageHeader
                title={t("register.title", { name: displayName || name })}
                subtitle={t("register.subtitle")}
              />
              <div className="revamp-authEmailTag">
                <Text className="revamp-authEmailValue">{email}</Text>
              </div>
              <Text className="revamp-authBody">{t("register.body")}</Text>
            </div>

            <div className="revamp-authActions">
              <label className="revamp-formField">
                <Text>{t("register.nameLabel")}</Text>
                <input
                  type="text"
                  className="revamp-input"
                  placeholder={t("register.namePlaceholder")}
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </label>
              {/* TODO: extract to a shared onboarding action footer once other auth screens move over. */}
              <Stack gap="sm">
                <Button
                  size="lg"
                  pill
                  onClick={handleStart}
                  disabled={!displayName.trim()}
                >
                  {t("register.cta")}
                </Button>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  {t("register.back")}
                </Button>
              </Stack>
            </div>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
