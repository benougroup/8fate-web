import { ENV } from "../../config/env";
import type {
  BaziProfile,
  DailyFortune,
  YearlyForecast,
  CompatibilityResult,
  AuspiciousDate,
} from "../mock/baziTypes";
import {
  getBaziProfileById as getMockProfile,
  getDailyFortune as getMockDailyFortune,
  getYearlyForecast as getMockYearlyForecast,
  getCompatibility as getMockCompatibility,
  getAuspiciousDates as getMockAuspiciousDates,
} from "../mock/baziData";

// Cache storage
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCacheKey(type: string, ...params: any[]): string {
  return `${type}:${params.join(":")}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// API call simulation (replace with real API calls later)
async function callBaziApi<T>(endpoint: string, params?: any): Promise<T> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In production, this would be:
  // const response = await fetch(`/api/bazi/${endpoint}`, { ... });
  // return response.json();
  
  throw new Error("API not implemented yet");
}

/**
 * Get Bazi profile by ID
 * - Dev mode: Use mock data
 * - Test/Prod: Check cache first, then API
 */
export async function getBaziProfile(profileId: string): Promise<BaziProfile | null> {
  if (ENV.useMock) {
    return getMockProfile(profileId);
  }

  const cacheKey = getCacheKey("profile", profileId);
  const cached = getFromCache<BaziProfile>(cacheKey);
  if (cached) return cached;

  try {
    const data = await callBaziApi<BaziProfile>(`profile/${profileId}`);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch Bazi profile, using mock:", error);
    return getMockProfile(profileId);
  }
}

/**
 * Get daily fortune
 * - Dev mode: Use mock data
 * - Test/Prod: Check cache first, then API
 */
export async function getDailyFortune(date?: string): Promise<DailyFortune> {
  if (ENV.useMock) {
    return getMockDailyFortune(date);
  }

  const targetDate = date || new Date().toISOString().split("T")[0];
  const cacheKey = getCacheKey("daily", targetDate);
  const cached = getFromCache<DailyFortune>(cacheKey);
  if (cached) return cached;

  try {
    const data = await callBaziApi<DailyFortune>(`daily/${targetDate}`);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch daily fortune, using mock:", error);
    return getMockDailyFortune(date);
  }
}

/**
 * Get yearly forecast
 * - Dev mode: Use mock data
 * - Test/Prod: Check cache first, then API
 */
export async function getYearlyForecast(year: number): Promise<YearlyForecast> {
  if (ENV.useMock) {
    return getMockYearlyForecast(year);
  }

  const cacheKey = getCacheKey("forecast", year);
  const cached = getFromCache<YearlyForecast>(cacheKey);
  if (cached) return cached;

  try {
    const data = await callBaziApi<YearlyForecast>(`forecast/${year}`);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch yearly forecast, using mock:", error);
    return getMockYearlyForecast(year);
  }
}

/**
 * Get compatibility between two profiles
 * - Dev mode: Use mock data
 * - Test/Prod: Check cache first, then API
 */
export async function getCompatibility(
  profileAId: string,
  profileBId: string
): Promise<CompatibilityResult> {
  if (ENV.useMock) {
    return getMockCompatibility(profileAId, profileBId);
  }

  const cacheKey = getCacheKey("compatibility", profileAId, profileBId);
  const cached = getFromCache<CompatibilityResult>(cacheKey);
  if (cached) return cached;

  try {
    const data = await callBaziApi<CompatibilityResult>(
      `compatibility/${profileAId}/${profileBId}`
    );
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch compatibility, using mock:", error);
    return getMockCompatibility(profileAId, profileBId);
  }
}

/**
 * Get auspicious dates
 * - Dev mode: Use mock data
 * - Test/Prod: Check cache first, then API
 */
export async function getAuspiciousDates(
  startDate: string,
  endDate: string,
  activityType?: string
): Promise<AuspiciousDate[]> {
  if (ENV.useMock) {
    return getMockAuspiciousDates(startDate, endDate);
  }

  const cacheKey = getCacheKey("auspicious", startDate, endDate, activityType || "all");
  const cached = getFromCache<AuspiciousDate[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await callBaziApi<AuspiciousDate[]>(
      `auspicious?start=${startDate}&end=${endDate}&type=${activityType || "all"}`
    );
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch auspicious dates, using mock:", error);
    return getMockAuspiciousDates(startDate, endDate);
  }
}

/**
 * Clear all Bazi cache
 */
export function clearBaziCache(): void {
  cache.clear();
}

/**
 * Clear specific cache entry
 */
export function clearBaziCacheEntry(type: string, ...params: any[]): void {
  const key = getCacheKey(type, ...params);
  cache.delete(key);
}
