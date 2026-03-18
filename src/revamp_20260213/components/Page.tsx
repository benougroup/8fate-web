import React from "react";
import { getBackgroundSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

type PageProps = React.HTMLAttributes<HTMLElement>;

export function Page({ className, ...props }: PageProps) {
  // NOTE:
  // Page owns the global background layer for the revamp theme.
  // Avoid per-page overrides so the background stays consistent.
  const classes = ["revamp-page", className].filter(Boolean).join(" ");
  const { theme, backgroundKey } = usePreferences();
  const backgroundSrc = getBackgroundSrc(
    theme,
    backgroundKey ?? "background001",
  );
  const style = {
    ...props.style,
    ["--revamp-page-bg" as `--${string}`]: `url(${backgroundSrc})`,
  } as React.CSSProperties;

  return <main className={classes} {...props} style={style} />;
}
