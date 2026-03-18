import * as React from "react";
import { InfoPopup } from "./InfoPopup";
import { getUiSymbolSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

type SectionInfoButtonProps = {
  title: string;
  body: string;
};

/**
 * A small ⓘ icon button that opens an InfoPopup with an explanation.
 * Place it next to any section title.
 *
 * Usage:
 *   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
 *     <Text>Section Title</Text>
 *     <SectionInfoButton title="Section Title" body="Explanation text..." />
 *   </div>
 */
export function SectionInfoButton({ title, body }: SectionInfoButtonProps) {
  const [open, setOpen] = React.useState(false);
  const { theme } = usePreferences();
  const iconSrc = getUiSymbolSrc(theme, "question_mark");

  return (
    <>
      <button
        type="button"
        className="revamp-sectionInfoBtn"
        aria-label={`Info: ${title}`}
        onClick={() => setOpen(true)}
      >
        <img src={iconSrc} alt="" className="revamp-sectionInfoBtnIcon" aria-hidden="true" />
      </button>
      <InfoPopup
        open={open}
        title={title}
        body={body}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
