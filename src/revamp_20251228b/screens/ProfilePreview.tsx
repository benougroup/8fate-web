import * as React from "react";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { PageSection } from "../components/PageSection";
import { PillButton, PillLink } from "../components/PillButton";
import { SkinToggleIcon } from "../components/SkinToggleIcon";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TopBar } from "../components/TopBar";
import { UiIcon } from "../components/UiIcon";
import { NotificationCenter } from "../components/NotificationCenter";
import type { UserLevel, UpdateProfileRequest } from "../contracts/v1/types";
import { t } from "../i18n/t";
import { toUserErrorMessage } from "../services/api/errorMessage";
import { getMeApi, updateProfileApi } from "../services/providers/apiProfileProvider";
import { usePreferences } from "../stores/preferencesStore";

type Status = {
  isLoading: boolean;
  error: string | null;
  updatedAtISO: string | null;
};

function isValidDateOfBirth(dateOfBirthISO: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirthISO);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

export function ProfilePreview() {
  const { theme } = usePreferences();
  const [name, setName] = React.useState("");
  const [dateOfBirthISO, setDateOfBirthISO] = React.useState("");
  const [placeOfBirth, setPlaceOfBirth] = React.useState("");
  const [level, setLevel] = React.useState<UserLevel>("beginner");
  const [status, setStatus] = React.useState<Status>({
    isLoading: false,
    error: null,
    updatedAtISO: null,
  });
  const profileBadge = name.trim();

  async function handleLoad() {
    setStatus({ isLoading: true, error: null, updatedAtISO: null });
    try {
      const response = await getMeApi();
      const profile = response.profile;
      setName(profile.name ?? "");
      setDateOfBirthISO(profile.dateOfBirthISO ?? "");
      setPlaceOfBirth(profile.placeOfBirth ?? "");
      setLevel(profile.level ?? "beginner");
      setStatus({ isLoading: false, error: null, updatedAtISO: null });
    } catch (caught) {
      setStatus({
        isLoading: false,
        error: toUserErrorMessage(caught),
        updatedAtISO: null,
      });
    }
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setStatus({
        isLoading: false,
        error: t("profile.errors.nameRequired"),
        updatedAtISO: null,
      });
      return;
    }

    const payload: UpdateProfileRequest = {
      name: trimmedName,
      level,
    };

    const trimmedDob = dateOfBirthISO.trim();
    if (trimmedDob) {
      if (!isValidDateOfBirth(trimmedDob)) {
        setStatus({
          isLoading: false,
          error: t("profile.errors.invalidDate"),
          updatedAtISO: null,
        });
        return;
      }
      payload.dateOfBirthISO = trimmedDob;
    }

    const trimmedPlace = placeOfBirth.trim();
    if (trimmedPlace) {
      payload.placeOfBirth = trimmedPlace;
    }

    setStatus({ isLoading: true, error: null, updatedAtISO: null });
    try {
      const response = await updateProfileApi(payload);
      setStatus({ isLoading: false, error: null, updatedAtISO: response.updatedAtISO });
    } catch (caught) {
      setStatus({
        isLoading: false,
        error: toUserErrorMessage(caught),
        updatedAtISO: null,
      });
    }
  }

  return (
    <Page>
      <PageCard>
        <TopBar
          left={
            <>
              <UiIcon name="brand" size="sm" alt={t("icons.brandAlt")} />
              <span className="revamp-topBarTitle">{t("brand.geonLogoAlt")}</span>
            </>
          }
          center={t("preview.banner.title")}
          right={
            <>
              <NotificationCenter />
              <SkinToggleIcon />
              {profileBadge ? (
                <span className="revamp-topBarProfile">
                  <UiIcon name="profile" size="sm" />
                  {profileBadge}
                </span>
              ) : null}
            </>
          }
        />
        <PageContent>
          <Stack gap="md">
            <PageHeader title={t("profile.preview.title")} />
            <PageSection>
              <Stack gap="sm" align="start">
                <label>
                  <Text>{t("profile.fields.name")}</Text>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
                <label>
                  <Text>{t("profile.fields.dateOfBirth")}</Text>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={dateOfBirthISO}
                    onChange={(event) => setDateOfBirthISO(event.target.value)}
                  />
                </label>
                <label>
                  <Text>{t("profile.fields.placeOfBirth")}</Text>
                  <input
                    type="text"
                    value={placeOfBirth}
                    onChange={(event) => setPlaceOfBirth(event.target.value)}
                  />
                </label>
                <label>
                  <Text>{t("profile.fields.level")}</Text>
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value as UserLevel)}
                  >
                    <option value="beginner">{t("profile.levels.beginner")}</option>
                    <option value="intermediate">{t("profile.levels.intermediate")}</option>
                    <option value="advanced">{t("profile.levels.advanced")}</option>
                  </select>
                </label>
                <Stack gap="sm" align="start">
                  <PillButton type="button" onClick={handleLoad} disabled={status.isLoading}>
                    {t("profile.preview.load")}
                  </PillButton>
                  <PillButton type="button" onClick={handleSave} disabled={status.isLoading}>
                    {t("profile.preview.save")}
                  </PillButton>
                </Stack>
                {status.updatedAtISO && (
                  <Text>
                    {t("profile.preview.updatedAt", {
                      updatedAt: status.updatedAtISO,
                    })}
                  </Text>
                )}
                {status.error && <Text>{status.error}</Text>}
                <PillLink to="/__preview/home">
                  {t("profile.preview.backToHome")}
                </PillLink>
              </Stack>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
