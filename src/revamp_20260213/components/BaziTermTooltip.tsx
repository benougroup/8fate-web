import type React from "react";
import { InfoPopup } from "./InfoPopup";

type BaziTermTooltipProps = {
  term: string;
  definition: string;
  children?: React.ReactNode;
};

export function BaziTermTooltip({ term, definition, children }: BaziTermTooltipProps) {
  return (
    <InfoPopup
      variant="question"
      title={term}
      body={definition}
    >
      {children}
    </InfoPopup>
  );
}
