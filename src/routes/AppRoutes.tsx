import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "@/components/Loader";

// Case-sensitive paths! Make sure this file name is exactly "Splash.tsx" and "Login.tsx"
const Splash = lazy(() => import("@/pages/Splash"));
const Login  = lazy(() => import("@/pages/Login"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader style={{ margin: "40vh auto" }} />}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        {/* Optional: guard unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
