// 20260213 = new UI revamp entry point (based on 20251228b).
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/global.20260213.css";
import { RevampRoutes } from "./revamp_20260213/routes";
import { ServicesProvider } from "./revamp_20260213/services";
import {
  applyPortfolioPreferences,
} from "./revamp_20260213/stores/preferencesStore";
import {
  getPortfolioPreferences,
} from "./revamp_20260213/services/providers/portfolioPreferences";

export default function App20260213() {
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
