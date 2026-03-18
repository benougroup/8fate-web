import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { getBrandLogoUrl } from "@/utils/brandAssets";

export type BrandSpinnerProps = {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  ariaHidden?: boolean;
};

const KEYFRAME_ID = "brand-spinner-keyframes";

function ensureSpinKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAME_ID;
  style.innerHTML = `@keyframes brand-spinner-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

export default function BrandSpinner({ size = 48, className, style, ariaHidden = true }: BrandSpinnerProps) {
  ensureSpinKeyframes();

  const [broken, setBroken] = useState(false);
  const logoSrc = useMemo(() => getBrandLogoUrl(), []);

  const dimension = typeof size === "number"
    ? { width: size, height: size }
    : { width: size, height: size };

  if (broken || !logoSrc) {
    return (
      <span
        className={className}
        aria-hidden={ariaHidden}
        style={{
          display: "inline-block",
          ...dimension,
          border: "2px solid rgba(252, 233, 199, 0.18)",
          borderTopColor: "#f0b64d",
          borderRadius: "50%",
          animation: "brand-spinner-rotate 1s linear infinite",
          boxShadow: "0 0 10px rgba(240, 182, 77, 0.35)",
          ...style,
        }}
      />
    );
  }

  return (
    <img
      src={logoSrc}
      alt=""
      aria-hidden={ariaHidden}
      className={className}
      onError={() => setBroken(true)}
      style={{
        display: "inline-block",
        objectFit: "contain",
        filter: "drop-shadow(0 14px 32px rgba(0, 0, 0, 0.45))",
        animation: "brand-spinner-rotate 2.4s linear infinite",
        ...dimension,
        ...style,
      }}
    />
  );
}
