// 20251228b = new UI revamp entry point.
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/global.20251228b.css";
import { RevampRoutes } from "./revamp_20251228b/routes";
import { ServicesProvider } from "./revamp_20251228b/services";
import {
  applyPortfolioPreferences,
} from "./revamp_20251228b/stores/preferencesStore";
import {
  getPortfolioPreferences,
} from "./revamp_20251228b/services/providers/portfolioPreferences";

export default function App20251228b() {
  React.useEffect(() => {
    let isActive = true;
    const syncPortfolioPreferences = async () => {
      const preferences = await getPortfolioPreferences();
      if (preferences && isActive) {
        applyPortfolioPreferences(preferences);
      }
    };
    syncPortfolioPreferences();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <ServicesProvider>
        <RevampRoutes />
      </ServicesProvider>
    </BrowserRouter>
  );
}
