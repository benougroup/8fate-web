import * as React from "react";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { InfoPopup } from "./InfoPopup";

type HelpIconVariant = "question" | "exclamation";

type SectionTitleHelp = {
  variant: HelpIconVariant;
  titleKey: string;
  bodyKey: string;
};

type SectionTitleRowProps = {
  titleKey: string;
  iconKey?: IconKey;
  secondaryIconKey?: IconKey;
  help?: SectionTitleHelp;
  className?: string;
};

const helpVariantIconMap: Record<HelpIconVariant, IconKey> = {
  question: "question_mark",
  exclamation: "exclamation_mark",
};

export function SectionTitleRow({
  titleKey,
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
  const helpIconKey = help ? helpVariantIconMap[help.variant] : null;
  const helpIconSrc = helpIconKey ? getIconSrc(theme, helpIconKey) : null;

  return (
    <div className={classes}>
      {leadingIconSrc ? (
        <img
          className="revamp-sectionTitleIcon"
          src={leadingIconSrc}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      {secondaryIconSrc ? (
        <img
          className="revamp-sectionTitleIcon"
          src={secondaryIconSrc}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <span className="revamp-sectionTitleLabel">{t(titleKey)}</span>
      {help && helpIconSrc ? (
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
      ) : null}
    </div>
  );
}
