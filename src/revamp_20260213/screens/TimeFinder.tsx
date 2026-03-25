/**
 * TimeFinder.tsx
 *
 * Helps users identify their birth Shi-Chen (2-hour window) when they don't
 * know their exact birth time.
 *
 * Flow:
 *  Step 1 — Select time-of-day block (4 options):
 *    Midnight  00:00–06:00  (Zi, Chou, Yin)
 *    Morning   06:00–12:00  (Mao, Chen, Si)
 *    Afternoon 12:00–18:00  (Wu, Wei, Shen)
 *    Night     18:00–00:00  (You, Xu, Hai)
 *
 *  Step 2 — Show 5 Shi-Chen cards:
 *    • 3 central slots (free to select)
 *    • 1 slot before + 1 slot after (premium, blurred)
 *    This covers borderline cases (e.g. born at 11:50 → shown in both
 *    Morning and Afternoon boundary slots).
 *
 * Rules:
 *  - No Skip button (birth time is required for accurate readings)
 *  - No FloatingRadialNav (prevents users from bypassing the step)
 *  - After premium purchase, user returns here to continue
 *  - URL param ?tod=midnight|morning|afternoon|night pre-selects step 1
 *    (used when navigating from Register's 4-slot picker)
 *
 * Premium blur:
 *  - The outer 2 slots (position 0 and 4) are blurred for free users
 *  - Clicking them navigates to /purchase?returnTo=/timefinder
 */

import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import timezonesManifest from "@/assets/data/timezones.json";
import { AlertDialog } from "../components/AlertDialog";
import { Button } from "../components/Button";
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

// ── Shi-Chen index mapping ─────────────────────────────────────────────────
// Index 0 = Zi (23:00–01:00), ..., Index 11 = Hai (21:00–23:00)

/** 4-slot time-of-day blocks, each covering 3 Shi-Chen */
const TOD_BLOCKS = {
  midnight:  [0, 1, 2],   // Zi, Chou, Yin   (00:00–06:00)
  morning:   [3, 4, 5],   // Mao, Chen, Si   (06:00–12:00)
  afternoon: [6, 7, 8],   // Wu, Wei, Shen   (12:00–18:00)
  night:     [9, 10, 11], // You, Xu, Hai    (18:00–00:00)
} as const;

type TODKey = keyof typeof TOD_BLOCKS;

const TOD_META: Record<TODKey, { label: string; range: string; emoji: string }> = {
  midnight:  { label: "Midnight", range: "00:00 – 06:00", emoji: "🌑" },
  morning:   { label: "Morning",  range: "06:00 – 12:00", emoji: "🌅" },
  afternoon: { label: "Afternoon", range: "12:00 – 18:00", emoji: "☀️" },
  night:     { label: "Night",    range: "18:00 – 00:00", emoji: "🌙" },
};

// ── Shi-Chen personality descriptions ─────────────────────────────────────

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

// ── Helpers ────────────────────────────────────────────────────────────────

function normalizeTOD(value: string | null): TODKey | null {
  if (value === "midnight" || value === "morning" || value === "afternoon" || value === "night") {
    return value;
  }
  // Legacy support: "day" → "morning", "night" → "night"
  if (value === "day") return "morning";
  return null;
}

/** Wrap index 0–11 circularly */
function wrapIdx(i: number): number {
  return ((i % 12) + 12) % 12;
}

// ── Component ──────────────────────────────────────────────────────────────

export function TimeFinder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get("mode") === "onboarding";
  const initialTOD = normalizeTOD(searchParams.get("tod"));
  const { isPremium } = usePreferences();

  const [tod, setTod] = React.useState<TODKey | null>(initialTOD);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const shiChenList = React.useMemo(() => extractShiChen(timezonesManifest), []);

  /**
   * Build 5 Shi-Chen options for the selected TOD block.
   * Layout: [block[-1], block[0], block[1], block[2], block[+1]]
   *   - block[0..2] = the 3 core slots for this TOD (free)
   *   - block[-1]   = the last slot of the previous TOD (premium, blurred)
   *   - block[+1]   = the first slot of the next TOD (premium, blurred)
   * This covers borderline births (e.g. 11:50 shown in both Morning & Afternoon).
   */
  const options = React.useMemo<TimeMatchOption[]>(() => {
    if (!tod || shiChenList.length < 12) return [];

    const core = TOD_BLOCKS[tod]; // [idx0, idx1, idx2]
    const borderBefore = wrapIdx(core[0] - 1); // last slot of previous block
    const borderAfter  = wrapIdx(core[2] + 1); // first slot of next block

    const fiveIndices = [borderBefore, core[0], core[1], core[2], borderAfter];

    return fiveIndices.map((rawIdx, position) => {
      const sc: ShiChenEntry = shiChenList[rawIdx];
      const meta = SHICHEN_META[sc.key] ?? { description: "", tags: [] };
      // Outer 2 positions are premium (borderline slots)
      const isLocked = !isPremium && (position === 0 || position === 4);
      return {
        id: sc.key,
        hourLabel: `${sc.char} ${sc.key.toUpperCase()} · ${sc.start}–${sc.end}`,
        description: meta.description,
        keywords: meta.tags,
        isLocked,
      };
    });
  }, [tod, shiChenList, isPremium]);

  function handleComplete() {
    setShowSuccess(true);
  }

  function handleBack() {
    // Go back to step 1 (TOD selection)
    setTod(null);
    setSelectedId(null);
  }

  function handleTODSelect(key: TODKey) {
    setTod(key);
    setSelectedId(null);
  }

  return (
    <Page>
      <PageCard className="revamp-timeMatchCardShell">
        <PageContent>
          <Stack gap="lg">

            {/* ── Step 1: Time-of-day selection (4 options) ── */}
            {tod === null && (
              <>
                {/* Back to register (no skip) */}
                <div className="revamp-timeMatchActions">
                  {isOnboarding && (
                    <Button
                      variant="ghost"
                      size="sm"
                      pill
                      onClick={() => navigate("/register")}
                    >
                      {t("timeFinder.back")}
                    </Button>
                  )}
                </div>

                <PageHeader
                  title="When were you born?"
                  subtitle="Select the time window that best matches your birth time."
                />

                <Stack gap="md">
                  {(Object.keys(TOD_META) as TODKey[]).map((key) => {
                    const meta = TOD_META[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        className="revamp-todButton"
                        onClick={() => handleTODSelect(key)}
                      >
                        <span className="revamp-todIcon">{meta.emoji}</span>
                        <div>
                          <div className="revamp-todLabel">{meta.label}</div>
                          <div className="revamp-todRange">{meta.range}</div>
                        </div>
                      </button>
                    );
                  })}
                </Stack>
              </>
            )}

            {/* ── Step 2: 5 Shi-Chen slots ── */}
            {tod !== null && (
              <>
                {/* Back to step 1 (no skip) */}
                <div className="revamp-timeMatchActions">
                  <Button variant="ghost" size="sm" pill onClick={handleBack}>
                    {t("timeFinder.back")}
                  </Button>
                </div>

                <PageHeader
                  title={t("timeFinder.title")}
                  subtitle={`${TOD_META[tod].emoji} ${TOD_META[tod].label} · ${TOD_META[tod].range}`}
                />

                <Text muted>
                  Select the Shi-Chen (2-hour window) that best matches your personality.
                  The outer two slots cover borderline times — they require Premium to unlock.
                </Text>

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
                      onLockedClick={() =>
                        navigate(`/purchase?returnTo=/timefinder?mode=${isOnboarding ? "onboarding" : "standalone"}&tod=${tod}`)
                      }
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

      {/* Success dialog — navigates to daily after confirming */}
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

      {/* FloatingRadialNav intentionally removed — users must complete this step */}
    </Page>
  );
}
