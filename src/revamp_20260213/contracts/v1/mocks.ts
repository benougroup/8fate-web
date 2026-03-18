import type { DailyGuidanceResponse } from "./types";

// Mock data is used to unblock UI work before backend integration.
export function getMockDailyGuidance(): DailyGuidanceResponse {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateISO = `${yyyy}-${mm}-${dd}`;

  return {
    dateISO,
    forLocalDateISO: dateISO,
    theme: "yin",
    cards: [
      {
        id: "card-eating-god",
        slot: "today",
        title: {
          en: "Eating God",
          zhHant: "食神",
        },
        summary: "Nourish steady creativity with calm, simple routines.",
        action: "Cook or plan one satisfying meal.",
        avoid: "Overcommitting your energy.",
      },
      {
        id: "card-direct-wealth",
        slot: "luck",
        title: {
          en: "Direct Wealth",
          zhHant: "正財",
        },
        summary: "Prioritize consistent progress over quick wins.",
        action: "Review one recurring expense.",
        avoid: "Impulse spending today.",
      },
    ],
    sourceUpdatedAtISO: new Date().toISOString(),
    generatedFor: {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: "en",
    },
  };
}
