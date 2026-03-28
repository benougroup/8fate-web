// Bazi Mock Data Types

export type HeavenlyStem =
  | "Jia" | "Yi" | "Bing" | "Ding" | "Wu"
  | "Ji" | "Geng" | "Xin" | "Ren" | "Gui";

export type EarthlyBranch =
  | "Zi" | "Chou" | "Yin" | "Mao" | "Chen" | "Si"
  | "Wu" | "Wei" | "Shen" | "You" | "Xu" | "Hai";

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export type TenGod =
  | "Direct Resource"
  | "Indirect Resource"
  | "Friend"
  | "Rob Wealth"
  | "Eating God"
  | "Hurting Officer"
  | "Direct Wealth"
  | "Indirect Wealth"
  | "Direct Officer"
  | "Seven Killings";

export type Pillar = {
  stem: string; // Chinese character
  stemEn: HeavenlyStem;
  branch: string; // Chinese character
  branchEn: EarthlyBranch;
  element: string; // Chinese character
  elementEn: Element;
  tenGod: TenGod;
  hiddenStems?: string[];
};

export type BaziChart = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: string; // Chinese character
  dayMasterEn: HeavenlyStem;
  dayMasterElement: string; // Chinese character
  dayMasterElementEn: Element;
};

export type ElementBalance = {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
};

export type LuckPillar = {
  startAge: number;
  endAge: number;
  stem: string;
  stemEn: HeavenlyStem;
  branch: string;
  branchEn: EarthlyBranch;
  element: string;
  elementEn: Element;
  isCurrent: boolean;
  analysis: string;
  /** Ten God of the Heavenly Stem relative to the Day Master */
  stemTenGod?: TenGod;
  /** Ten God of the Earthly Branch relative to the Day Master */
  branchTenGod?: TenGod;
};

export type BaziProfile = {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthLocation?: string;
  timezone?: string;
  chart: BaziChart;
  elements: ElementBalance;
  luckPillars: LuckPillar[];
};

export type DailyFortune = {
  date: string; // YYYY-MM-DD
  energyScore: number; // 0-10
  dayPillar: Pillar;
  summary: string;
  fortune: string;
  advice: string;
  luckyActivity: string;
  luckyElements: Element[];
  luckyColors: string[];
  favorableDirections: string[];
  doList: string[];
  dontList: string[];
  recommendations: string[];
};

export type ZodiacPosition = "head" | "middle" | "tail";

export type YearlyForecast = {
  year: number;
  zodiac: string; // "Fire Horse"
  zodiacAnimal: string; // "horse" - matches ZodiacKey for icon lookup
  zodiacPosition: ZodiacPosition; // head = born in first 4 months of zodiac year, middle = months 5-8, tail = months 9-12
  zodiacPositionDesc: string; // explanation of what head/middle/tail means for this person's zodiac year
  yearPillar: Pillar;
  overview: string;
  firstHalfAnalysis: string; // Jan-Jun
  secondHalfAnalysis: string; // Jul-Dec
  firstHalfScore: number; // 0-100
  secondHalfScore: number; // 0-100
  luck: string[];
  avoid: string[];
  lifeDomains: LifeDomain[];
  favorableMonths: number[];
  unfavorableMonths: number[];
  criticalMonths: number[];
  protectionStrategy: string;
  luckPillarContext: string;
  monthlyPredictions: {
    month: number;
    score: number; // 0-100 for line chart
    prediction: string;
    elementInteraction: string;
    isPremium?: boolean; // months 7-12 are premium
  }[];
  specialStars?: SpecialStar[];
};

export type SpecialStar = {
  type: "wisdom" | "romance" | "special_influence";
  name: string; // e.g. "Wen Chang Star", "Peach Blossom Star"
  description: string;
  impact: string; // how it affects this year
  isPremium?: boolean;
};

export type CompatibilityResult = {
  profileA: string;
  profileB: string;
  score: number; // 0-100
  elementHarmony: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
};

export type AuspiciousDate = {
  date: string; // YYYY-MM-DD
  score: number; // 0-100
  dayPillar: Pillar;
  favorableFor: string[];
  unfavorableFor: string[];
  analysis: string;
  isPremium?: boolean; // if true, full reading requires premium
};

export type TrendIndicator = "up" | "neutral" | "down";

export type LifeDomain = {
  domain: "work" | "wealth" | "relationship" | "health" | "study" | "family" | "talent";
  trend: TrendIndicator;
  description: string;
  isPremium?: boolean;
};

export type MonthlyFortune = {
  month: string; // "February 2026"
  chineseMonth: string; // "丙寅月"
  monthPillar: Pillar;
  overview: string;
  luck: string[]; // Things that work with the month
  avoid: string[]; // Things that work against the month
  luckyColor: string;
  luckyNumber: number;
  activeElement: Element;
  weakElement: Element;
  lifeDomains: LifeDomain[];
  dayMasterInteraction: string;
  protectionFocus: string;
  protectionSuggestions: string[];
};
