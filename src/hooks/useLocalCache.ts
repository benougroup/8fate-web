import { useState, useCallback } from "react";


/**
 * useLocalCache – hook for JSON localStorage with error safety.
 * - Returns [value, setValue, clearValue].
 * - Handles parse/stringify automatically.
 */
export function useLocalCache<T>(key: string, initial?: T) {
  const [value, setValueState] = useState<T | null>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
      return initial ?? null;
    } catch {
      return initial ?? null;
    }
  });


  const setValue = useCallback(
    (v: T | null) => {
      setValueState(v);
      try {
        if (v === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // ignore quota/JSON errors
      }
    },
    [key]
  );


  const clearValue = useCallback(() => setValue(null), [setValue]);


  return [value, setValue, clearValue] as const;
}