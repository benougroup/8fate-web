export type CoarseTimeRange = "night" | "morning" | "afternoon" | "evening";

export const TIME_RANGE_OPTIONS: Array<{ value: CoarseTimeRange; label: string }> = [
  { value: "night", label: "Night (00:00–06:00)" },
  { value: "morning", label: "Morning (06:00–12:00)" },
  { value: "afternoon", label: "Afternoon (12:00–18:00)" },
  { value: "evening", label: "Evening (18:00–24:00)" },
];

export function resolveTimeRangeLabel(value?: string | null): string {
  if (!value) return "";
  return TIME_RANGE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
