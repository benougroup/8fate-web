// apps/web/src/hooks/useSyncOnResume.ts
// Triggers a lightweight sync when the app regains focus or visibility,
// respecting throttles from app_config.json.


import { useEffect, useRef } from "react";
import appConfig from "@assets/data/app_config.json";
import { getSession } from "@services/sessionStore";
import { runSync } from "@services/sync";


// Helpers to read config safely
function cfgNumber(path: (cfg: any) => any, fallback: number): number {
  try {
    const v = path(appConfig as any);
    return typeof v === "number" ? v : fallback;
  } catch { return fallback; }
}
function cfgBool(path: (cfg: any) => any, fallback: boolean): boolean {
  try {
    const v = path(appConfig as any);
    return typeof v === "boolean" ? v : fallback;
  } catch { return fallback; }
}


const RESUME_MIN_FREE = () => cfgNumber(c => c.sync?.resumeMinAgeMs?.free, 30 * 60 * 1000);   // 30m
const RESUME_MIN_PREM = () => cfgNumber(c => c.sync?.resumeMinAgeMs?.premium, 15 * 60 * 1000); // 15m
const MAX_DAILY_FREE  = () => cfgNumber(c => c.sync?.maxDailyResumeChecks?.free, 12);
const MAX_DAILY_PREM  = () => cfgNumber(c => c.sync?.maxDailyResumeChecks?.premium, 24);
const RECONNECT_MIN   = () => cfgNumber(c => c.sync?.reconnectMinAgeMs, 60 * 60 * 1000);       // 60m
const USE_ETAGS       = () => cfgBool(c => c.sync?.useConditionalGets, true);


const LAST_SYNC_KEY = "sync.last.ok.v1";
const DAILY_COUNT_PREFIX = "sync.resume.count."; // + YYYY-MM-DD


function todayKey() {
  const d = new Date();
  return `${DAILY_COUNT_PREFIX}${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
}
function now() { return Date.now(); }


function getLastSyncAt() {
  try { const n = Number(localStorage.getItem(LAST_SYNC_KEY)); return Number.isFinite(n) ? n : 0; } catch { return 0; }
}
function setLastSyncAt(ts: number) {
  try { localStorage.setItem(LAST_SYNC_KEY, String(ts)); } catch {}
}
function incDailyCount() {
  try {
    const k = todayKey();
    const n = Number(localStorage.getItem(k) || "0");
    localStorage.setItem(k, String((Number.isFinite(n) ? n : 0) + 1));
  } catch {}
}
function getDailyCount() {
  try { return Number(localStorage.getItem(todayKey()) || "0"); } catch { return 0; }
}


export function useSyncOnResume() {
  const runningRef = useRef(false);


  useEffect(() => {
    const session = getSession();
    const userKey = session?.userKey;
    const isPremium = !!session?.isPremium;


    if (!userKey) return; // nothing to do if not signed in


    const minAge = isPremium ? RESUME_MIN_PREM() : RESUME_MIN_FREE();
    const maxDaily = isPremium ? MAX_DAILY_PREM() : MAX_DAILY_FREE();


    async function maybeSync(reason: "focus" | "visibility" | "online") {
      if (runningRef.current) return;
      const last = getLastSyncAt();
      const age = now() - last;
      const count = getDailyCount();


      // throttle by time and daily cap
      if (reason === "online" && age < RECONNECT_MIN()) return;
      if (age < minAge) return;
      if (count >= maxDaily) return;


      try {
        runningRef.current = true;
        const ok = await runSync({
          userKey,
          useEtags: USE_ETAGS(),
          // By default we’ll sync profile/dashboard/portfolio; customize if needed:
          resources: ["profile", "dashboard", "portfolio"],
        });
        if (ok) {
          setLastSyncAt(now());
          incDailyCount();
        }
      } catch {
        // silent fail; next attempt will try later based on minAge
      } finally {
        runningRef.current = false;
      }
    }


    function onVisibility() {
      if (document.visibilityState === "visible") maybeSync("visibility");
    }
    function onFocus() { maybeSync("focus"); }
    function onOnline() { maybeSync("online"); }


    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);


    // Initial run once on mount (acts like first resume)
    maybeSync("visibility");


    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
  }, []);
}


export default useSyncOnResume;