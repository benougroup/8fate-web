import React, { useState } from "react";

import Popup from "@/components/Popup";
import { DEFINITIONS } from "@/assets/data/definitions";

export type DefinitionKey = keyof typeof DEFINITIONS.en;

interface InfoTriggerProps {
  defKey: DefinitionKey;
  style?: React.CSSProperties;
  color?: string;
}

export default function InfoTrigger({ defKey, style, color = "#F4D73E" }: InfoTriggerProps) {
  const [open, setOpen] = useState(false);

  const def = DEFINITIONS.en[defKey];

  if (!def) return null;

  return (
    <>
      <button
        type="button"
        aria-label={`Info about ${def.title}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        style={{
          background: "transparent",
          border: `1px solid ${color}`,
          color,
          borderRadius: "50%",
          width: "16px",
          height: "16px",
          fontSize: "10px",
          fontWeight: "bold",
          fontFamily: "serif",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginLeft: "6px",
          opacity: 0.8,
          padding: 0,
          lineHeight: 1,
          ...style,
        }}
      >
        i
      </button>

      <Popup
        open={open}
        title={def.title}
        message={(
          <div style={{ textAlign: "left", lineHeight: 1.6, fontSize: "14px", whiteSpace: "pre-wrap" }}>
            {def.text}
          </div>
        )}
        tone="info"
        onClose={() => setOpen(false)}
        dismissLabel="Close"
        closeOnBackdrop
      />
    </>
  );
}
