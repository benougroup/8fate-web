import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ComponentsPreview } from "./screens/ComponentsPreview";
import { Home } from "./screens/Home";
import { LoginPreview } from "./screens/LoginPreview";
import { Monthly } from "./screens/Monthly";
import { PortfolioPage } from "./screens/PortfolioPage";
import { ProfilePreview } from "./screens/ProfilePreview";
import { SplashPreview } from "./screens/SplashPreview";
import { TermsPreview } from "./screens/TermsPreview";
import { TimeFinder } from "./screens/TimeFinder";
import { YearlyPage } from "./screens/YearlyPage";
import { BaziChart } from "./screens/BaziChart";
import { DailyFortune } from "./screens/DailyFortune";
import { LuckPillars } from "./screens/LuckPillars";
import { Compatibility } from "./screens/Compatibility";
import { YearlyForecast } from "./screens/YearlyForecast";
import { AuspiciousDates } from "./screens/AuspiciousDates";
import { MonthlyNew } from "./screens/MonthlyNew";
import { YearlyNew } from "./screens/YearlyNew";

// NEW v20260213 screens
import { Splash } from "./screens/Splash";
import { Login } from "./screens/Login";
import { Terms } from "./screens/Terms";
import { Register } from "./screens/Register";
import { Settings } from "./screens/Settings";
import { PremiumLanding } from "./screens/PremiumLanding";
import { PurchasePage } from "./screens/PurchasePage";
import { PurchaseSuccess } from "./screens/PurchaseSuccess";
import { ChatPage } from "./screens/ChatPage";

export function RevampRoutes() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Splash />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/tnc" element={<Terms />} />
      <Route path="/register" element={<Register />} />
      <Route path="/daily" element={<Home />} />
      
      {/* Settings & Profile */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Settings />} />
      
      {/* Premium & Payment */}
      <Route path="/premium" element={<PremiumLanding />} />
      <Route path="/purchase" element={<PurchasePage />} />
      <Route path="/purchase/success" element={<PurchaseSuccess />} />
      
      {/* Chat */}
      <Route path="/chat" element={<ChatPage />} />
      
      {/* TimeFinder */}
      <Route path="/timefinder" element={<TimeFinder />} />
      
      {/* Core Features */}
      <Route path="/monthly" element={<MonthlyNew />} />
      <Route path="/monthly-old" element={<Monthly />} />
      <Route path="/flow-month" element={<Navigate to="/monthly" replace />} />
      <Route path="/yearly" element={<YearlyForecast />} />
      <Route path="/yearly-new" element={<YearlyNew />} />
      <Route path="/yearly-old" element={<YearlyPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/bazi-chart" element={<BaziChart />} />
      <Route path="/daily-fortune" element={<DailyFortune />} />
      <Route path="/luck-pillars" element={<LuckPillars />} />
      <Route path="/compatibility" element={<Compatibility />} />
      <Route path="/auspicious-dates" element={<AuspiciousDates />} />
      
      {/* Preview Routes */}
      <Route path="/__preview" element={<Navigate to="/__preview/home" replace />} />
      <Route path="/__preview/home" element={<Home preview />} />
      <Route path="/__preview/login" element={<LoginPreview />} />
      <Route path="/__preview/terms" element={<TermsPreview />} />
      <Route path="/__preview/splash" element={<SplashPreview />} />
      <Route path="/__preview/profile" element={<ProfilePreview />} />
      <Route path="/__preview/components" element={<ComponentsPreview />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/splash" replace />} />
    </Routes>
  );
}
