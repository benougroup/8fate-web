import React, { useEffect, useState } from "react";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { useNavigate } from "react-router-dom";
import { finalizeTime, getTimeCandidates } from "@services/endpoints/timefinder";
import { getSession, updateSession } from "@services/sessionStore";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import {
  TimeMatchOptionCard,
  type TimeMatchOption,
} from "../components/TimeMatchOptionCard";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

type StoredProfile = {
  dateOfBirth?: string;
  timeRange?: string | null;
  timeZoneId?: string;
  country?: string;
};

function loadProfileForTimeMatch(): StoredProfile | null {
  try {
    // NOTE: keep dev/local profile keys for non-prod environments.
    const raw =
      localStorage.getItem("profile_data") ||
      localStorage.getItem("dev_profile_data") ||
      localStorage.getItem("localProfile.v1");
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

function normalizeTimeRange(range?: string | null): "morning" | "afternoon" | "evening" | "night" {
  if (range === "afternoon") return "afternoon";
  if (range === "evening") return "evening";
  if (range === "night" || range === "midnight") return "night";
  return "morning";
}

export function TimeMatchPage() {
  const navigate = useNavigate();
  const session = getSession();
  const isPremium = !!session?.isPremium;
  const { locale } = usePreferences();

  const [options, setOptions] = useState<TimeMatchOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      const profile = loadProfileForTimeMatch();
      const dob = profile?.dateOfBirth || new Date().toISOString().slice(0, 10);
      const timeRange = normalizeTimeRange(profile?.timeRange);
      const timeZoneId = profile?.timeZoneId || "UTC";

      const response = await getTimeCandidates({
        dob,
        timeRange,
        timeZoneId,
        location: profile?.country,
        locale,
      });

      if (response.ok && response.data) {
        const mapped = response.data.windows.map((window) => ({
          id: window.id,
          hourLabel: window.title,
          description: window.description,
          keywords: window.shiChen.map((range) => range.key),
          isLocked: window.locked && !isPremium,
        }));
        setOptions(mapped);
      }

      setLoading(false);
    }

    loadOptions();
  }, [isPremium]);

  async function handleConfirm() {
    if (!selectedId || submitting) return;
    setSubmitting(true);
    const response = await finalizeTime(selectedId);
    if (response.ok) {
      updateSession({ requiresTimeSelection: false });
      navigate("/daily", { replace: true });
      return;
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <Page>
        <PageCard className="revamp-authCard">
          <PageContent>
            <Text>{t("common.loading")}</Text>
          </PageContent>
        </PageCard>
        <FloatingRadialNav />
    </Page>
    );
  }

  return (
    <Page>
      <PageCard className="revamp-timeMatchCardShell">
        <PageContent>
          <Stack gap="lg">
            <div className="revamp-timeMatchActions">
              <Button variant="ghost" size="sm" pill onClick={() => navigate("/profile-setup")}>
                {t("timeMatch.back")}
              </Button>
            </div>

            <PageHeader
              title={t("timeMatch.title")}
              subtitle={
                isPremium
                  ? t("timeMatch.subtitle")
                  : `${t("timeMatch.subtitle")} ${t("timeMatch.upgradePrompt")}`
              }
            />

            <div className="revamp-timeMatchList">
              {options.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                  <TimeMatchOptionCard
                    key={option.id}
                    option={option}
                    isSelected={isSelected}
                    lockedTitle={t("timeMatch.lockedTitle")}
                    lockedBody={t("timeMatch.lockedBody")}
                    lockedCta={t("timeMatch.lockedCta")}
                    onSelect={(id) => setSelectedId(id)}
                    onLockedClick={() => navigate("/upgrade")}
                  />
                );
              })}
            </div>

            <Button
              size="lg"
              pill
              onClick={handleConfirm}
              disabled={!selectedId || submitting}
            >
              {submitting ? t("timeMatch.saving") : t("timeMatch.confirm")}
            </Button>
          </Stack>
        </PageContent>
      </PageCard>
      <FloatingRadialNav />
    </Page>
  );
}
