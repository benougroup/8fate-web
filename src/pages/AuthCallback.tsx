import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setSession, getSession } from "@services/sessionStore";
import { completeOAuthCallback } from "@services/auth";
import { runSync } from "@services/sync";
import AppShell from "@/components/AppShell";
import Loader from "@/components/Loader";
import ErrorBox from "@/components/ErrorBox";


/**
 * AuthCallback
 * - Parses ?code= / ?state= (also tolerates hash params)
 * - Calls backend to exchange code → session
 * - Persists session locally; navigates to next screen
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();


  const { err, errDesc } = useMemo(() => {
    const q = new URLSearchParams(location.search);
    const h = new URLSearchParams(location.hash.replace(/^#/, "")); // providers may return in hash
    return {
      err: q.get("error") || h.get("error") || undefined,
      errDesc: q.get("error_description") || h.get("error_description") || undefined,
    } as const;
  }, [location.search, location.hash]);


  const [message, setMessage] = useState<string>("Completing sign-in…");
  const [fatal, setFatal] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;


    async function finish() {
      if (err) {
        setFatal(`OAuth error: ${errDesc || err}`);
        setTimeout(() => !cancelled && navigate("/login", { replace: true }), 2000);
        return;
      }


      try {
        setMessage("Exchanging code…");
        const result = await completeOAuthCallback(window.location.href);
        if (result.status !== "success" || !result.data) {
          throw new Error(result.error?.message || "Auth failed");
        }

        const data = result.data;
        const userKey = data.userKey;
        const isPremium = !!data.isPremium;
        if (!userKey) throw new Error("No user key in response");

        const isNewUser = data.isNewUser ?? false;
        const prev = getSession() || {};
        setSession({
          ...prev,
          userKey,
          isPremium,
          name: data.name ?? prev.name,
          isNewUser,
          requiresProfile: data.requiresProfile ?? isNewUser,
          requiresTimeSelection: data.requiresTimeSelection ?? isNewUser,
          termsAcceptedVersion: data.termsAcceptedVersion ?? prev.termsAcceptedVersion,
        });
        try {
          await runSync({ userKey, force: true }); // warm local cache immediately
        } catch {
          // best-effort; ignore errors here
        }


        setMessage("Signed in. Redirecting…");
        const next = isNewUser ? "/terms" : "/dashboard";
        setTimeout(
          () =>
            !cancelled &&
            navigate(next, {
              replace: true,
              state: isNewUser ? { mode: "accept", userKey } : undefined,
            }),
          400,
        );
      } catch (e: any) {
        console.error("OAuth finalize error", e);
        setFatal(e?.message || "Unable to complete sign-in");
        setTimeout(() => !cancelled && navigate("/login", { replace: true }), 1600);
      }
    }


    finish();
    return () => {
      cancelled = true;
    };
  }, [err, errDesc, navigate]);


  return (
    <AppShell hideNav>
      <div style={wrap}>
        <div style={card}>
          <h1 className="title" style={{ margin: 0 }}>Signing you in…</h1>
          {fatal ? (
            <div style={{ marginTop: 12 }}>
              <ErrorBox message={fatal} />
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <Loader label={message} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}


const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f7f7f7",
  padding: 16,
};


const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  textAlign: "center",
};
