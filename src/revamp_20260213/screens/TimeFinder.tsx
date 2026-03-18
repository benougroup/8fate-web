import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import timezonesManifest from "@/assets/data/timezones.json";
import { AlertDialog } from "../components/AlertDialog";
import { Button } from "../components/Button";
import { FloatingRadialNav } from "../components/FloatingRadialNav";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageHeader } from "../components/PageHeader";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TimeMatchOptionCard, type TimeMatchOption } from "../components/TimeMatchOptionCard";
import { t } from "../i18n/t";
import { extractShiChen, type ShiChenEntry } from "../utils/timezones";
import { usePreferences } from "../stores/preferencesStore";

// The 12 Shi-Chen in order (index 0 = Zi 23:00-01:00, ..., index 11 = Hai 21:00-23:00)
// Daytime = roughly 06:00–18:00 → Mao(3), Chen(4), Si(5), Wu(6), Wei(7), Shen(8)
// Night-time = roughly 18:00–06:00 → You(9), Xu(10), Hai(11), Zi(0), Chou(1), Yin(2)
const DAYTIME_INDICES = [3, 4, 5, 6, 7, 8];   // Mao, Chen, Si, Wu, Wei, Shen
const NIGHTTIME_INDICES = [9, 10, 11, 0, 1, 2]; // You, Xu, Hai, Zi, Chou, Yin

// Descriptions and trait tags for each Shi-Chen
const SHICHEN_META: Record<string, { description: string; tags: string[] }> = {
  Zi:   { description: "The Rat hour — deep night, stillness, hidden potential.", tags: ["Intuitive", "Mysterious", "Resourceful"] },
  Chou: { description: "The Ox hour — quiet determination before dawn.", tags: ["Patient", "Grounded", "Persistent"] },
  Yin:  { description: "The Tiger hour — first light, bold beginnings.", tags: ["Brave", "Ambitious", "Energetic"] },
  Mao:  { description: "The Rabbit hour — gentle morning, creativity flows.", tags: ["Creative", "Gentle", "Perceptive"] },
  Chen: { description: "The Dragon hour — rising energy, power and vitality.", tags: ["Dynamic", "Confident", "Visionary"] },
  Si:   { description: "The Snake hour — mid-morning clarity and wisdom.", tags: ["Wise", "Analytical", "Focused"] },
  Wu:   { description: "The Horse hour — peak energy, action and passion.", tags: ["Passionate", "Active", "Charismatic"] },
  Wei:  { description: "The Goat hour — warm afternoon, nurturing and artistic.", tags: ["Artistic", "Caring", "Harmonious"] },
  Shen: { description: "The Monkey hour — late afternoon, quick wit and adaptability.", tags: ["Clever", "Adaptable", "Playful"] },
  You:  { description: "The Rooster hour — dusk, precision and refinement.", tags: ["Precise", "Organised", "Observant"] },
  Xu:   { description: "The Dog hour — early evening, loyalty and reflection.", tags: ["Loyal", "Sincere", "Protective"] },
  Hai:  { description: "The Pig hour — night falls, warmth and generosity.", tags: ["Generous", "Compassionate", "Sincere"] },
};

type TOD = "day" | "night";

export function TimeFinder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get("mode") === "onboarding";
  const { isPremium, locale } = usePreferences();

  const [tod, setTod] = React.useState<TOD | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const shiChenList = React.useMemo(() => extractShiChen(timezonesManifest), []);

  // Build the 5-slot list from the selected time-of-day
  const options = React.useMemo<TimeMatchOption[]>(() => {
    if (!tod || shiChenList.length < 12) return [];

    const pool = tod === "day" ? DAYTIME_INDICES : NIGHTTIME_INDICES;
    // pool has 6 entries; we show the middle 3 free + 1 before + 1 after (locked)
    // Locked = first and last of the 5 shown
    const fiveIndices = [pool[1], pool[2], pool[3], pool[4], pool[5]];
    // Actually: show indices pool[0..4] where pool[0] and pool[4] are locked
    const showIndices = [pool[0], pool[1], pool[2], pool[3], pool[4]];

    return showIndices.map((rawIdx, position) => {
      const sc: ShiChenEntry = shiChenList[rawIdx];
      const meta = SHICHEN_META[sc.key] ?? { description: "", tags: [] };
      const isLocked = !isPremium && (position === 0 || position === 4);
      return {
        id: sc.key,
        hourLabel: `${sc.char} ${sc.key.toUpperCase()} · ${sc.start}–${sc.end}`,
        description: meta.description,
        keywords: meta.tags,
        isLocked,
      };
    });
  }, [tod, shiChenList, isPremium, locale]);

  const handleComplete = () => {
    setShowSuccess(true);
  };

  const handleBack = () => {
    setTod(null);
    setSelectedId(null);
  };

  return (
    <Page>
      <PageCard className="revamp-timeMatchCardShell">
        <PageContent>
          <Stack gap="lg">

            {/* ── Step 1: Time-of-day question ── */}
            {tod === null && (
              <>
                <div className="revamp-timeMatchActions">
                  <Button
                    variant="ghost"
                    size="sm"
                    pill
                    onClick={() => navigate(isOnboarding ? "/register" : -1 as any)}
                  >
                    {t("timeFinder.skip")}
                  </Button>
                </div>

                <PageHeader
                  title={t("timeFinder.todQuestion")}
                  subtitle={t("timeFinder.subtitle")}
                />

                <Stack gap="md">
                  <button
                    type="button"
                    className="revamp-todButton"
                    onClick={() => setTod("day")}
                  >
                    <span className="revamp-todIcon">☀️</span>
                    <div>
                      <div className="revamp-todLabel">{t("timeFinder.tod.morning")}</div>
                      <div className="revamp-todRange">06:00 – 18:00</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="revamp-todButton"
                    onClick={() => setTod("night")}
                  >
                    <span className="revamp-todIcon">🌙</span>
                    <div>
                      <div className="revamp-todLabel">{t("timeFinder.tod.night")}</div>
                      <div className="revamp-todRange">18:00 – 06:00</div>
                    </div>
                  </button>
                </Stack>
              </>
            )}

            {/* ── Step 2: 5 Shi-Chen slots ── */}
            {tod !== null && (
              <>
                <div className="revamp-timeMatchActions">
                  <Button variant="ghost" size="sm" pill onClick={handleBack}>
                    {t("timeFinder.back")}
                  </Button>
                  <Button variant="ghost" size="sm" pill onClick={handleComplete}>
                    {t("timeFinder.skip")}
                  </Button>
                </div>

                <PageHeader
                  title={t("timeFinder.title")}
                  subtitle={tod === "day" ? t("timeFinder.tod.morning") : t("timeFinder.tod.night")}
                />

                <Text muted>{t("timeFinder.slotsHelper")}</Text>

                <div className="revamp-timeMatchList">
                  {options.map((option) => (
                    <TimeMatchOptionCard
                      key={option.id}
                      option={option}
                      isSelected={selectedId === option.id}
                      lockedTitle={t("timeFinder.lockedTitle")}
                      lockedBody={t("timeFinder.lockedBody")}
                      lockedCta={t("timeFinder.lockedCta")}
                      onSelect={(id) => setSelectedId(id)}
                      onLockedClick={() => navigate("/purchase")}
                    />
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleComplete}
                  disabled={!selectedId}
                >
                  {t("timeFinder.finish")}
                </Button>
              </>
            )}

          </Stack>
        </PageContent>
      </PageCard>

      <AlertDialog
        open={showSuccess}
        title={t("timeFinder.successTitle")}
        message={t("timeFinder.successMessage")}
        onClose={() => setShowSuccess(false)}
        actions={[
          {
            key: "daily",
            label: t("timeFinder.successAction"),
            variant: "primary",
            onPress: () => navigate("/daily", { replace: true }),
          },
        ]}
      />
      <FloatingRadialNav />
    </Page>
  );
}
