import React, { useEffect } from "react";
import AppV1 from "./App.v1";
import App20251228b from "./App.20251228b";
import App20260213 from "./App.20260213";
import { getUiVariant } from "./app/runtimeConfig";
import { usePreferences } from "./revamp_20251228b/stores/preferencesStore";

export default function App() {
  const variant = getUiVariant();
  const { theme, locale } = usePreferences();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dataset.skin = theme;
    document.documentElement.lang = locale;
  }, [theme, locale]);

  // Route to the correct app variant — preview routes respect the variant setting
  if (variant === "20260213") {
    return <App20260213 />;
  }

  if (variant === "20251228b") {
    return <App20251228b />;
  }

  return <AppV1 />;
}
