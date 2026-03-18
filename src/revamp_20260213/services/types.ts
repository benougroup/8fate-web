export type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};

export type TimeFinderResult = {
  id: string;
  title: string;
  timeRange: string;
  description: string;
  confidence?: number;
  tags?: string[];
};

export type TimeFinderQuery = {
  date: string;
  timeRange: string;
  timezone: string;
};

export type PurchaseResult = {
  success: boolean;
  message?: string;
};

export type Trend = "up" | "flat" | "down";

export type MonthlyFortuneHints = {
  luckyColorHex: string;
  luckyNumber: number;
  activeElement: "wood" | "fire" | "earth" | "metal" | "water";
  weakElement: "wood" | "fire" | "earth" | "metal" | "water";
};

export type MonthlyDomainKey =
  | "work"
  | "wealth"
  | "relationship"
  | "health"
  | "study"
  | "family"
  | "talent";

export type MonthlyDomainTrend = {
  key: MonthlyDomainKey;
  trend: Trend;
  summary: string;
  isPremiumLocked?: boolean;
};

export type MonthlyInteraction = {
  dayMaster: "wood" | "fire" | "earth" | "metal" | "water";
  monthStemBranch: string;
  interactionLabel: string;
  description: string;
};

export type MonthlyProtection = {
  focus: string;
  suggestions: string[];
};

export type MonthlyUpcomingTeaser = {
  title: string;
  description: string;
  disabledCtaLabel?: string;
};

export type MonthlyPayload = {
  monthISO: string;
  monthTitle: string;
  chineseMonthLabel: string;
  overview: string;
  luck: string[];
  avoid: string[];
  fortune: MonthlyFortuneHints;
  domains: MonthlyDomainTrend[];
  interaction: MonthlyInteraction;
  protection: MonthlyProtection;
  upcoming: MonthlyUpcomingTeaser;
};
