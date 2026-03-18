// apps/web/src/hooks/useSession.ts
import { useSyncExternalStore } from "react";
import { getSession, setSession, clearSession, subscribe } from "@services/sessionStore";


/**
 * useSession – React hook wrapper around sessionStore.
 * - Subscribes to changes in session.
 * - Returns { userKey, isPremium, loggedIn? } and helpers.
 */
export type Session = {
  userKey?: string;
  isPremium?: boolean;
  loggedIn?: boolean;
  name?: string;
  termsAcceptedVersion?: string | null;
  isNewUser?: boolean;
  requiresProfile?: boolean;
  requiresTimeSelection?: boolean;
};


export function useSession(): [Session, typeof setSession, typeof clearSession] {
  const getSnapshot = () => (getSession() ?? {}) as Session;
  const getServerSnapshot = () => ({} as Session);
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [session, setSession, clearSession];
}