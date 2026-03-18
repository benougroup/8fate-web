import { getDataMode } from "../../../app/runtimeConfig";
import portfolioMock from "../mock/portfolio.json";

type PortfolioMock = {
  generatedFor?: {
    locale?: string;
  };
  preferences?: {
    locale?: string;
    theme?: string;
    skin?: string;
    backgroundKey?: string;
  };
};

export type PortfolioPreferences = {
  locale?: string;
  theme?: string;
  backgroundKey?: string;
};

export async function getPortfolioPreferences(): Promise<PortfolioPreferences | null> {
  if (getDataMode() !== "mock") {
    return null;
  }

  const data = portfolioMock as PortfolioMock;
  const locale = data.preferences?.locale ?? data.generatedFor?.locale;
  const theme = data.preferences?.theme ?? data.preferences?.skin;
  const backgroundKey = data.preferences?.backgroundKey;

  return {
    locale,
    theme,
    backgroundKey,
  };
}
