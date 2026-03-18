// v1 = partner/current UI preserved for demo
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/styles/global.css";
import { useSyncOnResume } from "./hooks/useSyncOnResume";
import { PageLoading } from "@/components/PageState";

// --- PAGES (Lazy Load) ---

// Onboarding
const Splash = lazy(() => import("@/pages/Splash"));
const Login = lazy(() => import("@/pages/Login"));
const Terms = lazy(() => import("@/pages/Terms"));
const ProfileSetup = lazy(() => import("@/pages/ProfileSetup"));
const Profile = lazy(() => import("@/pages/Profile"));
const Register = lazy(() => import("@/pages/Register"));
const Timefinder = lazy(() => import("@/pages/Timefinder"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));

// Core App
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Chat = lazy(() => import("@/pages/Chat"));
const Settings = lazy(() => import("@/pages/Settings"));

// Commerce & Upgrade
const Payments = lazy(() => import("@/pages/Payments")); // List of plans
const Upgrade = lazy(() => import("@/pages/Upgrade")); // The "Golden Ticket" sales page

// Details
const YinYangDetail = lazy(() => import("@/pages/YinYangDetail"));
const ZodiacDetail = lazy(() => import("@/pages/ZodiacDetail"));
const DayMasterDetail = lazy(() => import("@/pages/DayMasterDetail"));
const InsightDetail = lazy(() => import("@/pages/InsightDetail"));

// Utilities
const Diagnostics = lazy(() => import("@/pages/Diagnostics"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Simple sanity check component
function Sanity() {
  return (
    <div>
      <div style={{ padding: 24 }}>✅ App mounted</div>
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <span className="subtitle">Loading…</span>
      </div>
    </div>
  );
}

function Loading() {
  return <PageLoading label="Loading…" minHeight="100vh" />;
}

export default function AppV1() {
  // Sync logic on resume
  useSyncOnResume();

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* --- ONBOARDING --- */}
          <Route path="/" element={<Splash />} />
          <Route path="/sanity" element={<Sanity />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/timefinder" element={<Timefinder />} />
          <Route path="/time-finder" element={<Timefinder />} />

          {/* --- MAIN TABS --- */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/plans" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />

          {/* --- MEMBERSHIP / UPGRADE --- */}
          <Route path="/upgrade" element={<Upgrade />} />
          {/* Alias /membership to /upgrade so existing links work */}
          <Route path="/membership" element={<Navigate to="/upgrade" replace />} />

          {/* --- DETAIL PAGES --- */}
          <Route path="/yin-yang-detail" element={<YinYangDetail />} />
          <Route path="/zodiac-detail" element={<ZodiacDetail />} />
          <Route path="/day-master-detail" element={<DayMasterDetail />} />

          <Route path="/insight/:category" element={<InsightDetail />} />

          {/* --- UTILS --- */}
          <Route path="/diagnostics" element={<Diagnostics />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
