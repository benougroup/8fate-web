// apps/web/src/pages/NotFound.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";
import { t } from "@/revamp_20251228b/i18n/t";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <AppShell>
      <PageHeader title={t("legacy.notFound.title")} subtitle={pathname} />

      <div style={wrap}>
        <div style={card}>
          <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>404</div>
          <p className="subtitle" style={{ marginTop: 6 }}>
            {t("legacy.notFound.body")}
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button style={primaryBtn} onClick={() => navigate("/dashboard")}>
              {t("legacy.notFound.goToDashboard")}
            </button>
            <button style={pillBtn} onClick={() => navigate(-1)}>
              {t("legacy.notFound.goBack")}
            </button>
            <button style={pillBtn} onClick={() => navigate("/diagnostics")}>
              {t("legacy.notFound.openDiagnostics")}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "60vh",
  display: "grid",
  placeItems: "center",
  padding: 12,
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 16,
  textAlign: "center",
  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
};

const primaryBtn: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 8,
  border: "none",
  background: "#0a84ff",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const pillBtn: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#333",
  fontWeight: 600,
  cursor: "pointer",
};
