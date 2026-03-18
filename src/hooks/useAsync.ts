import { useCallback, useEffect, useState } from "react";


/**
 * useAsync – handles loading/error/value for async functions.
 * - Returns { value, error, loading, run }.
 * - Cancels state updates if component unmounts.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const v = await fn();
      setValue(v);
      return v;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, deps);


  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const v = await fn();
        if (!cancelled) setValue(v);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, deps);


  return { value, error, loading, run } as const;
}