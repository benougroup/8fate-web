/**
 * SectionTitleRow — standard section header for all content pages.
 *
 * Layout (left → right):
 *   [leading icon?]  [Chinese name?]  English title  [? button → InfoPopup]
 *
 * Rules:
 *  - Help icon is ALWAYS "?" (question_mark). The old "exclamation" variant
 *    is kept for backwards compatibility but maps to question_mark.
 *  - `zhNameKey` shows the Chinese section name before the English title.
 *  - Popup shows section-specific information (placeholder until real copy written).
 */
import * as React from "react";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { InfoPopup } from "./InfoPopup";
type HelpIconVariant = "question" | "exclamation";
type SectionTitleHelp = {
  /** Both variants render "?" — kept for API compatibility */
  variant?: HelpIconVariant;
  titleKey: string;
  bodyKey: string;
};
type SectionTitleRowProps = {
  /** i18n key for the English section title */
  titleKey: string;
  /** Optional i18n key for the Chinese section name shown before the English title */
  zhNameKey?: string;
  iconKey?: IconKey;
  secondaryIconKey?: IconKey;
  help?: SectionTitleHelp;
  className?: string;
};
export function SectionTitleRow({
  titleKey,
  zhNameKey,
  iconKey,
  secondaryIconKey,
  help,
  className,
}: SectionTitleRowProps) {
  const { theme } = usePreferences();
  const [isOpen, setIsOpen] = React.useState(false);
  const classes = ["revamp-sectionTitleRow", className].filter(Boolean).join(" ");
  const leadingIconSrc = iconKey ? getIconSrc(theme, iconKey) : null;
  const secondaryIconSrc = secondaryIconKey ? getIconSrc(theme, secondaryIconKey) : null;
  // Always use question_mark regardless of variant
  const helpIconSrc = help ? getIconSrc(theme, "question_mark") : null;

  return (
    <div className={classes}>
      {leadingIconSrc && (
        <img className="revamp-sectionTitleIcon" src={leadingIconSrc} alt="" aria-hidden="true" />
      )}
      {secondaryIconSrc && (
        <img className="revamp-sectionTitleIcon" src={secondaryIconSrc} alt="" aria-hidden="true" />
      )}
      {/* Chinese name (optional) */}
      {zhNameKey && (
        <span className="revamp-sectionTitleZhName">{t(zhNameKey)}</span>
      )}
      {/* English title */}
      <span className="revamp-sectionTitleLabel">{t(titleKey)}</span>
      {/* ? help button */}
      {help && helpIconSrc && (
        <>
          <button
            type="button"
            className="revamp-sectionTitleHelpButton"
            aria-label={t("common.open_info")}
            onClick={() => setIsOpen(true)}
          >
            <img
              className="revamp-sectionTitleHelpIcon"
              src={helpIconSrc}
              alt=""
              aria-hidden="true"
            />
          </button>
          <InfoPopup
            open={isOpen}
            title={t(help.titleKey)}
            body={t(help.bodyKey)}
            onClose={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
