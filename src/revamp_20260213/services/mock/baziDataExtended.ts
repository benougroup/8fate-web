import { MonthlyFortune, YearlyForecast, LifeDomain } from "./baziTypes";

// Mock Monthly Fortune Data (February 2026)
export const MOCK_MONTHLY_FORTUNE: MonthlyFortune = {
  month: "February 2026",
  chineseMonth: "丙寅月",
  monthPillar: {
    stem: "丙",
    stemEn: "Bing",
    branch: "寅",
    branchEn: "Yin",
    element: "火",
    elementEn: "Fire",
    tenGod: "Eating God",
  },
  overview: "This month emphasizes movement and decision-making. Opportunities appear suddenly, but consistency will matter more than speed. Your natural adaptability is supported by the month's energy, favoring communication and learning.",
  luck: [
    "Networking and building connections",
    "Learning new skills or starting courses",
    "Short-term projects with quick wins",
    "Creative expression and innovation",
  ],
  avoid: [
    "Overcommitting to long-term obligations",
    "Legal disputes or confrontations",
    "High-risk financial investments",
    "Impulsive major decisions",
  ],
  luckyColor: "Deep Blue",
  luckyNumber: 18,
  activeElement: "Wood",
  weakElement: "Fire",
  lifeDomains: [
    {
      domain: "work",
      trend: "up",
      description: "Stable growth — good for planning, not switching jobs",
    },
    {
      domain: "wealth",
      trend: "neutral",
      description: "Neutral — save more than spend this month",
    },
    {
      domain: "relationship",
      trend: "down",
      description: "Misunderstandings likely, communicate gently",
    },
    {
      domain: "health",
      trend: "up",
      description: "Good recovery energy, focus on rest",
    },
    {
      domain: "study",
      trend: "up",
      description: "Excellent focus and retention",
    },
    {
      domain: "family",
      trend: "neutral",
      description: "Minor friction, patience required",
    },
    {
      domain: "talent",
      trend: "up",
      description: "Creative output at peak",
    },
  ],
  dayMasterInteraction: "Your Day Master (Water) is supported by this month's Wood energy. This favors learning, adaptability, and communication, but may lead to emotional fatigue if overextended. Balance activity with rest.",
  protectionFocus: "Stability & grounding",
  protectionSuggestions: [
    "Wear earth-tone accessories (brown, beige)",
    "Maintain a simple daily routine",
    "Practice grounding meditation",
  ],
};

// Mock Yearly Forecast Data (2026)
export const MOCK_YEARLY_FORECAST: YearlyForecast = {
  year: 2026,
  zodiac: "Fire Horse",
  zodiacAnimal: "horse",
  zodiacPosition: "middle",
  zodiacPositionDesc: "You were born in the peak phase of your zodiac year (months 5–8). This gives you the full force of the Horse energy — dynamic, passionate, and driven. You embody the core traits of your sign most intensely.",
  firstHalfScore: 78,
  secondHalfScore: 65,
  yearPillar: {
    stem: "丙",
    stemEn: "Bing",
    branch: "午",
    branchEn: "Wu",
    element: "火",
    elementEn: "Fire",
    tenGod: "Eating God",
  },
  overview: "2026 brings dynamic energy and opportunities for growth. The Fire Horse year emphasizes action, passion, and forward movement. This is a year for taking calculated risks and pursuing your ambitions with confidence.",
  firstHalfAnalysis: "The first half (January-June) focuses on building foundations and establishing new directions. Energy is high, and opportunities come quickly. Use this time to start projects, build networks, and set clear goals. Avoid rushing into commitments without proper planning.",
  secondHalfAnalysis: "The second half (July-December) shifts toward consolidation and harvest. What you planted in the first half begins to show results. Focus on completing projects, strengthening relationships, and preparing for the next cycle. This is a time for refinement rather than expansion.",
  luck: [
    "Career advancement and recognition",
    "Strategic investments and wealth building",
    "Creative projects and self-expression",
    "Travel and expanding horizons",
  ],
  avoid: [
    "Impulsive decisions without research",
    "Overwork and burnout",
    "Conflicts with authority figures",
    "Neglecting health for ambition",
  ],
  lifeDomains: [
    {
      domain: "work",
      trend: "up",
      description: "Strong year for career growth and leadership opportunities",
    },
    {
      domain: "wealth",
      trend: "up",
      description: "Good investment opportunities, but avoid speculation",
    },
    {
      domain: "relationship",
      trend: "neutral",
      description: "Stable but requires attention and communication",
    },
    {
      domain: "health",
      trend: "neutral",
      description: "Watch for stress-related issues, prioritize self-care",
    },
    {
      domain: "study",
      trend: "up",
      description: "Excellent year for learning and skill development",
    },
    {
      domain: "family",
      trend: "neutral",
      description: "Maintain balance between ambition and family time",
    },
    {
      domain: "talent",
      trend: "up",
      description: "Creative peak, express yourself boldly",
    },
  ],
  favorableMonths: [2, 5, 8, 11],
  unfavorableMonths: [3, 6, 9],
  criticalMonths: [4, 10],
  protectionStrategy: "Focus on Fire element balance. The year's strong Fire energy may overwhelm your Water Day Master. Use Earth element (yellow, brown colors, grounding activities) to mediate and create stability. Avoid excessive Fire activities (late nights, spicy food, heated arguments).",
  luckPillarContext: "You are currently in your 20-29 Luck Pillar (Fire/Wood). This decade aligns well with the Fire Horse year, amplifying opportunities for growth and expression. Use this alignment wisely.",
  monthlyPredictions: [
    {
      month: 1,
      prediction: "Strong start, set intentions clearly",
      elementInteraction: "Water-Fire balance needed",
    },
    {
      month: 2,
      prediction: "Excellent for networking and learning",
      elementInteraction: "Wood supports Water",
    },
    {
      month: 3,
      prediction: "Challenges in communication, slow down",
      elementInteraction: "Metal conflicts with Wood",
    },
    {
      month: 4,
      prediction: "Critical decision month, seek advice",
      elementInteraction: "Earth mediates conflicts",
    },
    {
      month: 5,
      prediction: "Financial opportunities, be selective",
      elementInteraction: "Fire-Water tension productive",
    },
    {
      month: 6,
      prediction: "Relationship challenges, practice patience",
      elementInteraction: "Fire overwhelms Water",
    },
    {
      month: 7,
      prediction: "Consolidation begins, review progress",
      elementInteraction: "Metal cools Fire",
    },
    {
      month: 8,
      prediction: "Harvest time, complete projects",
      elementInteraction: "Earth grounds energy",
    },
    {
      month: 9,
      prediction: "Minor setbacks, stay flexible",
      elementInteraction: "Water-Fire imbalance",
    },
    {
      month: 10,
      prediction: "Major breakthrough possible, stay focused",
      elementInteraction: "Wood supports growth",
    },
    {
      month: 11,
      prediction: "Recognition and rewards",
      elementInteraction: "Fire-Water harmony",
    },
    {
      month: 12,
      prediction: "Reflection and planning for next year",
      elementInteraction: "Earth stabilizes",
    },
  ],
};
