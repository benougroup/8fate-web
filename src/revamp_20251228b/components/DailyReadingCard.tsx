import { getIconSrc, type IconKey } from "../assets/assetMap";
import type { DailyReadingMeta, LuckLevel } from "../contracts/v1/homeMeta";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { Stack } from "./Stack";
import { Text } from "./Text";

type DailyReadingCardProps = {
  meta: DailyReadingMeta;
};

const LUCK_LEVEL_META: Record<
  LuckLevel,
  { iconKey: IconKey; labelKey: string }
> = {
  strong: { iconKey: "upup", labelKey: "home.daily.luckLevel.strong" },
  good: { iconKey: "up", labelKey: "home.daily.luckLevel.good" },
  steady: { iconKey: "middle", labelKey: "home.daily.luckLevel.steady" },
  caution: { iconKey: "down", labelKey: "home.daily.luckLevel.caution" },
  low: { iconKey: "downdown", labelKey: "home.daily.luckLevel.low" },
};

export function DailyReadingCard({ meta }: DailyReadingCardProps) {
  const { theme } = usePreferences();
  const metaInfo = LUCK_LEVEL_META[meta.luckLevel];
  const statusLabel = t(metaInfo.labelKey);
  const statusIconSrc = getIconSrc(theme, metaInfo.iconKey);

  return (
    <Stack gap="xs" align="start">
      <div className="revamp-todayStatus">
        <img
          className="revamp-todayStatusIcon"
          src={statusIconSrc}
          alt={statusLabel}
        />
        <span className="revamp-todayStatusLabel">{statusLabel}</span>
      </div>
      <Text className="revamp-quote">{meta.quote}</Text>
    </Stack>
  );
}
