import React from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@services/sessionStore";
import iconStart from "@/assets/images/general icons/start_icon.png";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { t } from "../i18n/t";
import { useProfile } from "../stores/profileStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const session = getSession();
  const { profile, setProfile } = useProfile();
  const initialName = session?.name || profile.name || "";
  const [displayName, setDisplayName] = React.useState(initialName);

  const handleStart = () => {
    setProfile({ name: displayName.trim() || initialName || undefined });
    navigate("/timefinder?mode=onboarding");
  };

  const heading = displayName.trim()
    ? t("register.title", { name: displayName.trim() })
    : "Welcome";

  return (
    <Page className="revamp-page--auth">
      <PageCard className="revamp-authCard">
        <PageContent className="revamp-content--full revamp-registerOriginalContent">
          <Stack gap="lg" align="center" className="revamp-registerOriginalStack">
            <div className="revamp-authIconWrap">
              <img src={iconStart} className="revamp-authIcon" alt={t("register.iconAlt")} />
            </div>

            <Stack gap="sm" align="center" className="revamp-authHero">
              <h1 className="revamp-registerOriginalTitle">{heading}</h1>
              <Text muted>{t("register.subtitle")}</Text>
              <Text className="revamp-authBody">{t("register.body")}</Text>
            </Stack>

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
            </div>

            <Button
              size="lg"
              pill
              onClick={handleStart}
              className="revamp-registerOriginalCta"
            >
              {t("register.cta")}
            </Button>

            <Button variant="ghost" onClick={() => navigate("/login")}>
              {t("register.back")}
            </Button>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
