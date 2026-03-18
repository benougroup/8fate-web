// apps/web/src/pages/Diagnostics.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";


import { getSession, clearSession } from "@services/sessionStore";


// Endpoints (fallback path)
import { getHeads, batchSync } from "@services/endpoints/sync";


// Config (to display current sync knobs)
import appConfig from "@assets/data/app_config.json";


// Types used locally
type HeadsMap = Partial<Record<"profile" | "dashboard" | "portfolio", string | null | undefined>>;


// Known local cache keys used by pages
const LOCAL_KEYS = {
  profile: "localProfile.v1",
  dashboard: "localDashboard.v1",
  portfolio: "localPortfolio.v1",
} as const;
const ETAG_KEYS = {
  profile: "etag.profile.v1",
  dashboard: "etag.dashboard.v1",
  portfolio: "etag.portfolio.v1",
} as const;


function readJSON<T>(key: string): T | null {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; }
}
function byteLen(val: unknown): number {
  try { return new Blob([JSON.stringify(val)]).size; } catch { return 0; }
}
function fmtBytes(n: number) {
  if (!n) return "0 B";
  const k = 1024, u = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${(n / Math.pow(k, i)).toFixed(2)} ${u[i]}`;
}


export default function Diagnostics() {
  const nav = useNavigate();
  const session = getSession();
  const userKey = session?.userKey;


  const [etags, setEtags] = useState<HeadsMap>(() => ({
    profile: localStorage.getItem(ETAG_KEYS.profile) || null,
    dashboard: localStorage.getItem(ETAG_KEYS.dashboard) || null,
    portfolio: localStorage.getItem(ETAG_KEYS.portfolio) || null,
  }));
  const [heads, setHeads] = useState<HeadsMap | null>(null);
  const [changed, setChanged] = useState<string[] | null>(null);


  const [profileData] = useState<any>(() => readJSON<any>(LOCAL_KEYS.profile));
  const [dashboardData] = useState<any>(() => readJSON<any>(LOCAL_KEYS.dashboard));
  const [portfolioData] = useState<any>(() => readJSON<any>(LOCAL_KEYS.portfolio));


  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string>("");


  const syncCfg = (appConfig as any)?.sync ?? {};


  const sizes = useMemo(() => ({
    profile: fmtBytes(byteLen(profileData)),
    dashboard: fmtBytes(byteLen(dashboardData)),
    portfolio: fmtBytes(byteLen(portfolioData)),
  }), [profileData, dashboardData, portfolioData]);


  function appendLog(line: string) {
    setLog((s) => `${s}${s ? "\n" : ""}${new Date().toLocaleTimeString()} — ${line}`);
  }


  async function onCheckHeads() {
    if (!userKey) { appendLog("No session"); return; }
    setBusy(true);
    try {
      const res: any = await getHeads({ userKey });
      if (res?.status !== "success") throw new Error(res?.error?.message || "HEAD failed");
      const h: HeadsMap = res?.data?.etags || {};
      setHeads(h);
      appendLog(`Server heads: ${JSON.stringify(h)}`);
      // Compute diff vs local
      const diff = ["profile","dashboard","portfolio"].filter((k) => (h as any)[k] !== (etags as any)[k]);
      setChanged(diff);
      appendLog(`Changed: ${diff.length ? diff.join(", ") : "(none)"}`);
    } catch (e: any) {
      appendLog(`Check heads error: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }


  async function onRunSync(force = false) {
    if (!userKey) { appendLog("No session"); return; }
    setBusy(true);
    try {
      // Prefer orchestrator if available
      let usedOrchestrator = false;
      try {
        const mod: any = await import("@services/sync");
        if (mod?.runSync) {
          const res = await mod.runSync({ userKey, force });
          usedOrchestrator = true;
          if (!res.ok) throw new Error(res.error || "runSync failed");
          setEtags(res.etags || {});
          appendLog(`runSync ok. Updated: ${res.updated.join(", ") || "(none)"}`);
        }
      } catch {
        // ignore; fall back to endpoints below
      }


      if (!usedOrchestrator) {
        // Fallback: compute changed via heads (or fetch all if force)
        let scope = ["profile","dashboard","portfolio"] as const;
        let toFetch: string[] = Array.from(scope);
        if (!force) {
          if (!heads) {
            const hr: any = await getHeads({ userKey });
            const h: HeadsMap = hr?.data?.etags || {};
            setHeads(h);
            toFetch = scope.filter((k) => (h as any)[k] !== (etags as any)[k]);
          } else {
            toFetch = scope.filter((k) => (heads as any)[k] !== (etags as any)[k]);
          }
        }
        appendLog(`Endpoint fallback. Fetching: ${toFetch.length ? toFetch.join(", ") : "(none)"}`);
        if (toFetch.length) {
          const br: any = await batchSync({ userKey, resources: toFetch });
          if (br?.status !== "success") throw new Error(br?.error?.message || "batchSync failed");
          const payload = br.data || {};
          // Write locals (mirror what pages use)
          if ("profile" in payload) localStorage.setItem(LOCAL_KEYS.profile, JSON.stringify(payload.profile));
          if ("dashboard" in payload) localStorage.setItem(LOCAL_KEYS.dashboard, JSON.stringify(payload.dashboard));
          if ("portfolio" in payload) localStorage.setItem(LOCAL_KEYS.portfolio, JSON.stringify(payload.portfolio));
          // Update ETags
          const newEtags = payload.etags || heads || {};
          if ("profile" in newEtags) localStorage.setItem(ETAG_KEYS.profile, newEtags.profile || "");
          if ("dashboard" in newEtags) localStorage.setItem(ETAG_KEYS.dashboard, newEtags.dashboard || "");
          if ("portfolio" in newEtags) localStorage.setItem(ETAG_KEYS.portfolio, newEtags.portfolio || "");
          setEtags({
            profile: localStorage.getItem(ETAG_KEYS.profile),
            dashboard: localStorage.getItem(ETAG_KEYS.dashboard),
            portfolio: localStorage.getItem(ETAG_KEYS.portfolio),
          });
          appendLog("Endpoint batchSync ok.");
        } else {
          appendLog("Nothing to fetch.");
        }
      }
    } catch (e: any) {
      appendLog(`Sync error: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }


  function onClearLocals() {
    (["profile","dashboard","portfolio"] as const).forEach((k) => {
      try { localStorage.removeItem((LOCAL_KEYS as any)[k]); } catch {}
      try { localStorage.removeItem((ETAG_KEYS as any)[k]); } catch {}
    });
    setHeads(null);
    setChanged(null);
    setEtags({ profile: null, dashboard: null, portfolio: null });
    appendLog("Cleared local caches and ETags.");
  }


  function onSignOut() {
    onClearLocals();
    clearSession();
    nav("/login", { replace: true });
  }


  useEffect(() => {
    appendLog("Diagnostics opened.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <AppShell>
      <PageHeader title="Diagnostics" subtitle="Sync, caches, session" />


      <div style={grid}>
        <section style={card}>
          <h3 className="title" style={{ fontSize: "1.05rem" }}>Session</h3>
          <div className="subtitle">userKey: <code>{userKey || "(none)"}</code></div>
          <div className="subtitle">plan: {session?.isPremium ? "Premium" : "Free"}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <button style={primaryBtn} disabled={busy || !userKey} onClick={() => onCheckHeads()}>Check heads</button>
            <button style={pillBtn} disabled={busy || !userKey} onClick={() => onRunSync(false)}>Run sync (changed)</button>
            <button style={pillBtn} disabled={busy || !userKey} onClick={() => onRunSync(true)}>Run sync (force)</button>
            <button style={ghostBtn} disabled={busy} onClick={onClearLocals}>Clear local</button>
            <button style={dangerBtn} disabled={busy} onClick={onSignOut}>Sign out</button>
          </div>
        </section>


        <section style={card}>
          <h3 className="title" style={{ fontSize: "1.05rem" }}>Sync config</h3>
          <pre style={preBox}>{JSON.stringify(syncCfg, null, 2)}</pre>
        </section>


        <section style={card}>
          <h3 className="title" style={{ fontSize: "1.05rem" }}>Local ETags</h3>
          <table style={table}>
            <tbody>
              <tr><td>profile</td><td><code>{etags.profile || "—"}</code></td></tr>
              <tr><td>dashboard</td><td><code>{etags.dashboard || "—"}</code></td></tr>
              <tr><td>portfolio</td><td><code>{etags.portfolio || "—"}</code></td></tr>
            </tbody>
          </table>
          {heads && (
            <>
              <div className="subtitle" style={{ marginTop: 8 }}>Server heads</div>
              <pre style={preBox}>{JSON.stringify(heads, null, 2)}</pre>
              {changed && <div className="subtitle">Changed: {changed.length ? changed.join(", ") : "(none)"}</div>}
            </>
          )}
        </section>


        <section style={card}>
          <h3 className="title" style={{ fontSize: "1.05rem" }}>Local caches</h3>
          <table style={table}>
            <tbody>
              <tr><td>profile</td><td>{sizes.profile}</td></tr>
              <tr><td>dashboard</td><td>{sizes.dashboard}</td></tr>
              <tr><td>portfolio</td><td>{sizes.portfolio}</td></tr>
            </tbody>
          </table>
        </section>


        <section style={card}>
          <h3 className="title" style={{ fontSize: "1.05rem" }}>Log</h3>
          <pre style={logBox}>{log || "—"}</pre>
        </section>
      </div>
    </AppShell>
  );
}


const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 12,
  padding: 12,
};


const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
};


const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 6px",
  fontSize: 14,
};
const preBox: React.CSSProperties = {
  background: "#f7f7f9",
  padding: 8,
  borderRadius: 8,
  border: "1px solid #eee",
  fontSize: 12,
  overflowX: "auto",
  maxHeight: 240,
};
const logBox: React.CSSProperties = { ...preBox, maxHeight: 300 };


const primaryBtn: React.CSSProperties = {
  height: 36, padding: "0 12px", borderRadius: 8, border: "none",
  background: "#0a84ff", color: "#fff", fontWeight: 700, cursor: "pointer",
};
const pillBtn: React.CSSProperties = {
  height: 36, padding: "0 12px", borderRadius: 999, border: "1px solid #ddd",
  background: "#fff", color: "#333", fontWeight: 600, cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #ddd",
  background: "#fff", color: "#333", fontWeight: 600, cursor: "pointer",
};
const dangerBtn: React.CSSProperties = {
  height: 36, padding: "0 12px", borderRadius: 8, border: "1px solid #f5b5b5",
  background: "#fff", color: "#c00", fontWeight: 700, cursor: "pointer",
};