import * as React from "react";

export type ThemeMode = "yang" | "yin";

export function useThemeMode(defaultTheme: ThemeMode = "yang") {
  const [theme, setTheme] = React.useState<ThemeMode>(defaultTheme);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((current) => (current === "yang" ? "yin" : "yang"));
  }, []);

  return { theme, setTheme, toggleTheme };
}
