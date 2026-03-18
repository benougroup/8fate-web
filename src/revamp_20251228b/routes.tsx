import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Chat } from "./screens/Chat";
import { ComponentsPreview } from "./screens/ComponentsPreview";
import { Home } from "./screens/Home";
import { Login } from "./screens/Login";
import { LoginPreview } from "./screens/LoginPreview";
import { Monthly } from "./screens/Monthly";
import { PortfolioPage } from "./screens/PortfolioPage";
import { Premium } from "./screens/Premium";
import { ProfilePreview } from "./screens/ProfilePreview";
import { ProfileSettings } from "./screens/ProfileSettings";
import { Purchase } from "./screens/Purchase";
import { RegisterPage } from "./screens/RegisterPage";
import { Splash } from "./screens/Splash";
import { SplashPreview } from "./screens/SplashPreview";
import { Terms } from "./screens/Terms";
import { TermsPreview } from "./screens/TermsPreview";
import { TimeFinder } from "./screens/TimeFinder";
import { YearlyPage } from "./screens/YearlyPage";

export function RevampRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/daily" element={<Home />} />
      <Route path="/__preview" element={<Navigate to="/__preview/home" replace />} />
      <Route path="/__preview/home" element={<Home preview />} />
      <Route path="/__preview/login" element={<LoginPreview />} />
      <Route path="/__preview/terms" element={<TermsPreview />} />
      <Route path="/__preview/splash" element={<SplashPreview />} />
      <Route path="/__preview/profile" element={<ProfilePreview />} />
      <Route path="/__preview/components" element={<ComponentsPreview />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<Navigate to="/tnc" replace />} />
      <Route path="/tnc" element={<Terms />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<Navigate to="/profile" replace />} />
      <Route path="/timefinder" element={<TimeFinder />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/monthly" element={<Monthly />} />
      <Route path="/flow-month" element={<Navigate to="/monthly" replace />} />
      <Route path="/yearly" element={<YearlyPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="*" element={<Navigate to="/splash" replace />} />
    </Routes>
  );
}
