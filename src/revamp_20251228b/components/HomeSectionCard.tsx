import { t } from "../i18n/t";
import { Stack } from "./Stack";
import { Text } from "./Text";

type HomeSectionCardProps = {
  titleEn: string;
  titleZh?: string;
  summary?: string;
  summaryClassName?: string;
  action?: string;
  avoid?: string;
  statusIconSrc?: string;
  statusLabel?: string;
};

export function HomeSectionCard({
  titleEn,
  titleZh,
  summary,
  summaryClassName,
  action,
  avoid,
  statusIconSrc,
  statusLabel,
}: HomeSectionCardProps) {
  const hasStatus = Boolean(statusIconSrc && statusLabel);

  return (
    <Stack gap="xs" align="start">
      <Text>
        <strong>{titleEn}</strong>
        {titleZh ? <span className="revamp-cn"> ({titleZh})</span> : null}
      </Text>
      {hasStatus ? (
        <div className="revamp-todayStatus">
          <img
            className="revamp-todayStatusIcon"
            src={statusIconSrc}
            alt={statusLabel}
          />
          <span className="revamp-todayStatusLabel">{statusLabel}</span>
        </div>
      ) : null}
      {summary ? <Text className={summaryClassName}>{summary}</Text> : null}
      {action ? (
        <Text>
          {t("common.labelValue", {
            label: t("home.card.action"),
            value: action,
          })}
        </Text>
      ) : null}
      {avoid ? (
        <Text>
          {t("common.labelValue", {
            label: t("home.card.avoid"),
            value: avoid,
          })}
        </Text>
      ) : null}
    </Stack>
  );
}
