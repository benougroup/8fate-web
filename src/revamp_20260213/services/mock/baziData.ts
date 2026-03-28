import type {
  BaziProfile,
  DailyFortune,
  YearlyForecast,
  CompatibilityResult,
  AuspiciousDate,
} from "./baziTypes";

// Mock Bazi Profile Data
export const MOCK_BAZI_PROFILE: BaziProfile = {
  id: "profile-1",
  name: "John Doe",
  birthDate: "1990-05-15",
  birthTime: "14:30",
  birthLocation: "Hong Kong",
  timezone: "Asia/Hong_Kong",
  chart: {
    year: {
      stem: "庚",
      stemEn: "Geng",
      branch: "午",
      branchEn: "Wu",
      element: "金",
      elementEn: "Metal",
      tenGod: "Direct Wealth",
    },
    month: {
      stem: "辛",
      stemEn: "Xin",
      branch: "巳",
      branchEn: "Si",
      element: "金",
      elementEn: "Metal",
      tenGod: "Friend",
    },
    day: {
      stem: "甲",
      stemEn: "Jia",
      branch: "子",
      branchEn: "Zi",
      element: "木",
      elementEn: "Wood",
      tenGod: "Direct Resource",
    },
    hour: {
      stem: "辛",
      stemEn: "Xin",
      branch: "未",
      branchEn: "Wei",
      element: "金",
      elementEn: "Metal",
      tenGod: "Friend",
    },
    dayMaster: "甲",
    dayMasterEn: "Jia",
    dayMasterElement: "木",
    dayMasterElementEn: "Wood",
  },
  elements: {
    wood: 2.5,
    fire: 1.8,
    earth: 1.2,
    metal: 3.5,
    water: 2.0,
  },
  luckPillars: [
    {
      startAge: 0,
      endAge: 9,
      stem: "壬",
      stemEn: "Ren",
      branch: "午",
      branchEn: "Wu",
      element: "水",
      elementEn: "Water",
      isCurrent: false,
      analysis: "Early childhood period with Water influence supporting growth.",
      stemTenGod: "Direct Resource",
      branchTenGod: "Hurting Officer",
    },
    {
      startAge: 10,
      endAge: 19,
      stem: "癸",
      stemEn: "Gui",
      branch: "未",
      branchEn: "Wei",
      element: "水",
      elementEn: "Water",
      isCurrent: false,
      analysis: "Teenage years with continued Water support for education.",
      stemTenGod: "Indirect Resource",
      branchTenGod: "Direct Wealth",
    },
    {
      startAge: 20,
      endAge: 29,
      stem: "甲",
      stemEn: "Jia",
      branch: "申",
      branchEn: "Shen",
      element: "木",
      elementEn: "Wood",
      isCurrent: false,
      analysis: "Career building phase with strong Wood energy.",
      stemTenGod: "Friend",
      branchTenGod: "Seven Killings",
    },
    {
      startAge: 30,
      endAge: 39,
      stem: "乙",
      stemEn: "Yi",
      branch: "酉",
      branchEn: "You",
      element: "木",
      elementEn: "Wood",
      isCurrent: true,
      analysis: "Current period with balanced energy for career advancement.",
      stemTenGod: "Rob Wealth",
      branchTenGod: "Direct Officer",
    },
    {
      startAge: 40,
      endAge: 49,
      stem: "丙",
      stemEn: "Bing",
      branch: "戌",
      branchEn: "Xu",
      element: "火",
      elementEn: "Fire",
      isCurrent: false,
      analysis: "Upcoming period with Fire energy bringing recognition.",
      stemTenGod: "Eating God",
      branchTenGod: "Direct Wealth",
    },
  ],
};

// Mock Daily Fortune
export const MOCK_DAILY_FORTUNE: DailyFortune = {
  date: new Date().toISOString().split("T")[0],
  energyScore: 8.5,
  dayPillar: {
    stem: "丙",
    stemEn: "Bing",
    branch: "寅",
    branchEn: "Yin",
    element: "火",
    elementEn: "Fire",
    tenGod: "Eating God",
  },
  summary: "Auspicious Day for Creativity",
  fortune: "Today brings favorable energy for creative pursuits and social interactions. The Fire element supports your natural Wood energy, creating opportunities for growth.",
  advice: "Focus on collaborative projects and express your ideas freely. The cosmic energy supports innovation and communication.",
  luckyActivity: "Creative brainstorming",
  luckyElements: ["Fire", "Wood"],
  luckyColors: ["Red", "Green", "Brown"],
  favorableDirections: ["South", "East"],
  doList: [
    "Start new projects",
    "Network with colleagues",
    "Make important decisions",
    "Sign contracts",
  ],
  dontList: [
    "Avoid conflicts",
    "Postpone major purchases",
    "Don't rush decisions",
  ],
  recommendations: [
    "Wear red or green clothing",
    "Face south during important meetings",
    "Spend time outdoors",
  ],
};

// Mock Yearly Forecast
export const MOCK_YEARLY_FORECAST: YearlyForecast = {
  year: 2026,
  zodiac: "Fire Horse",
  zodiacAnimal: "horse",
  zodiacPosition: "middle",
  zodiacPositionDesc: "Born in the middle phase of the Horse year, you carry the full strength of the Horse's energy. You are neither rushing out of the gate nor winding down — this is your peak expression year. Middle-position Horse people are known for sustained momentum and steady achievement throughout the year.",
  yearPillar: {
    stem: "丙",
    stemEn: "Bing",
    branch: "午",
    branchEn: "Wu",
    element: "火",
    elementEn: "Fire",
    tenGod: "Eating God",
  },
  overview: "2026 brings strong Fire energy that supports your Wood day master. This is a year of creativity, expression, and social success. Career opportunities abound, especially in creative or communication fields.",
  firstHalfAnalysis: "January to June sees the Fire energy building steadily. Your creativity peaks in spring — March and May are excellent months for launching projects, signing contracts, and expanding your network. Avoid major financial commitments in January when Metal energy creates friction.",
  secondHalfAnalysis: "July to December brings a consolidation phase. The Fire energy matures into tangible results. August and November are your strongest months for recognition and rewards. October requires caution — a clash with your Day Master may create unexpected obstacles. End the year by locking in gains.",
  firstHalfScore: 72,
  secondHalfScore: 85,
  luck: ["Creative ventures", "Public speaking", "Networking", "Travel", "Learning new skills"],
  avoid: ["Confrontations", "Risky investments", "Overcommitting", "Legal disputes"],
  lifeDomains: [
    { domain: "work", trend: "up", description: "Strong year for career advancement and recognition. Creative roles thrive." },
    { domain: "wealth", trend: "up", description: "Moderate wealth gains. Avoid speculative investments in Q1." },
    { domain: "relationship", trend: "neutral", description: "Stable relationships. Good year for deepening existing bonds." },
    { domain: "health", trend: "neutral", description: "Watch for fire-related issues: stress, inflammation, eye strain.", isPremium: true },
    { domain: "study", trend: "up", description: "Excellent year for learning. Fire energy sharpens intellect.", isPremium: true },
    { domain: "family", trend: "neutral", description: "Family harmony is stable. Spend quality time in Q2.", isPremium: true },
    { domain: "talent", trend: "up", description: "Your natural talents shine. Showcase your abilities boldly.", isPremium: true },
  ],
  favorableMonths: [2, 3, 5, 8, 11],
  unfavorableMonths: [1, 7, 10],
  criticalMonths: [10],
  protectionStrategy: "Wear or carry Water-element items (blue, black) to balance the strong Fire energy. Spend time near water bodies. Avoid red and orange in October.",
  luckPillarContext: "Your current Luck Pillar (Wood-Tiger) harmonises beautifully with the 2026 Fire-Horse year, creating a Wood-Fire combination that amplifies creative output and social influence.",
  monthlyPredictions: [
    {
      month: 1,
      prediction: "Start the year cautiously. Metal energy may create challenges.",
      elementInteraction: "Metal clashing with Wood",
    },
    {
      month: 2,
      prediction: "Excellent month for new beginnings and partnerships.",
      elementInteraction: "Wood supporting growth",
    },
    {
      month: 3,
      prediction: "Career advancement opportunities arise. Take initiative.",
      elementInteraction: "Fire bringing recognition",
    },
    {
      month: 4,
      prediction: "Steady progress. Good for building long-term plans.",
      elementInteraction: "Earth grounding Fire energy",
    },
    {
      month: 5,
      prediction: "Peak creative month. Launch projects and showcase talents.",
      elementInteraction: "Wood-Fire harmony at its strongest",
    },
    {
      month: 6,
      prediction: "Social connections bring unexpected opportunities.",
      elementInteraction: "Fire energy peaks at summer solstice",
    },
    {
      month: 7,
      prediction: "Slow down and consolidate. Avoid new ventures this month.",
      elementInteraction: "Metal energy begins to rise",
    },
    {
      month: 8,
      prediction: "Recognition and rewards arrive. Accept opportunities graciously.",
      elementInteraction: "Fire-Earth combination brings stability",
    },
    {
      month: 9,
      prediction: "Transition month. Wrap up ongoing projects.",
      elementInteraction: "Metal-Water energy building",
    },
    {
      month: 10,
      prediction: "Exercise caution. A clash may disrupt plans. Stay flexible.",
      elementInteraction: "Metal clashing with Day Master",
    },
    {
      month: 11,
      prediction: "Strong finish. Financial gains and recognition likely.",
      elementInteraction: "Water supporting Wood Day Master",
    },
    {
      month: 12,
      prediction: "Year-end reflection. Lock in gains and plan for 2027.",
      elementInteraction: "Water-Wood harmony closes the year",
    },
  ],
  specialStars: [
    {
      type: "wisdom",
      name: "Wen Chang Star (文昌星)",
      description: "The Academic Star — governs intelligence, creativity, and scholarly pursuits.",
      impact: "Active in 2026 for your chart. Excellent year for studying, writing, publishing, or any intellectual endeavour. Examinations and certifications are strongly favoured.",
      isPremium: false,
    },
    {
      type: "romance",
      name: "Peach Blossom Star (桃花星)",
      description: "The Romance Star — governs attraction, social magnetism, and relationships.",
      impact: "Mild activation in 2026. Social life improves; new connections form naturally. Not a peak romance year but a good time to nurture existing bonds.",
      isPremium: false,
    },
    {
      type: "special_influence",
      name: "Sky Horse Star (天馬星)",
      description: "The Movement Star — governs travel, relocation, and career transitions.",
      impact: "(add: Sky Horse Star impact for this person's chart in 2026)",
      isPremium: true,
    },
  ],
};

// Mock Compatibility Result
export const MOCK_COMPATIBILITY: CompatibilityResult = {
  profileA: "John Doe",
  profileB: "Jane Smith",
  score: 78,
  elementHarmony: {
    wood: 0.8,
    fire: 0.9,
    earth: 0.6,
    metal: 0.5,
    water: 0.7,
  },
  strengths: [
    "Strong Fire-Wood harmony creates mutual support",
    "Complementary Ten Gods indicate good partnership",
    "Similar life goals and values",
  ],
  challenges: [
    "Metal element may create occasional friction",
    "Different approaches to problem-solving",
    "Need to balance independence and togetherness",
  ],
  recommendations: [
    "Spend time in nature together",
    "Engage in creative activities",
    "Practice open communication",
    "Respect each other's need for space",
  ],
};

// Mock Auspicious Dates
export const MOCK_AUSPICIOUS_DATES: AuspiciousDate[] = [
  // ── June 2025 (past, accessible to all users) ──
  { date: "2025-06-18", score: 88, isPremium: false,
    dayPillar: { stem: "甲", stemEn: "Jia", branch: "子", branchEn: "Zi", element: "木", elementEn: "Wood", tenGod: "Friend" },
    favorableFor: ["New Beginnings", "Signing Contracts", "Travel"], unfavorableFor: ["Surgery"],
    analysis: "Strong Wood-Water harmony. Excellent for starting new ventures and travel." },
  { date: "2025-06-25", score: 75, isPremium: false,
    dayPillar: { stem: "辛", stemEn: "Xin", branch: "未", branchEn: "Wei", element: "金", elementEn: "Metal", tenGod: "Direct Officer" },
    favorableFor: ["Business Meetings", "Networking"], unfavorableFor: ["Moving House"],
    analysis: "Metal-Earth day brings structure and discipline. Good for formal dealings." },
  // ── July 2025 (past) ──
  { date: "2025-07-04", score: 91, isPremium: false,
    dayPillar: { stem: "戊", stemEn: "Wu", branch: "寅", branchEn: "Yin", element: "土", elementEn: "Earth", tenGod: "Indirect Resource" },
    favorableFor: ["Wedding", "Moving", "Business Opening"], unfavorableFor: ["Confrontations"],
    analysis: "Earth-Wood synergy creates stable growth. Ideal for long-term commitments." },
  { date: "2025-07-19", score: 82, isPremium: true,
    dayPillar: { stem: "癸", stemEn: "Gui", branch: "酉", branchEn: "You", element: "水", elementEn: "Water", tenGod: "Eating God" },
    favorableFor: ["Creativity", "Study", "Meditation"], unfavorableFor: ["Legal Disputes"],
    analysis: "Water-Metal day enhances intuition and creativity. Excellent for artistic pursuits." },
  // ── August 2025 (past) ──
  { date: "2025-08-08", score: 95, isPremium: true,
    dayPillar: { stem: "丙", stemEn: "Bing", branch: "午", branchEn: "Wu", element: "火", elementEn: "Fire", tenGod: "Eating God" },
    favorableFor: ["Grand Openings", "Celebrations", "Proposals"], unfavorableFor: ["Funerals", "Surgery"],
    analysis: "Double Fire energy on 8/8 — extremely auspicious. Perfect for major life events." },
  { date: "2025-08-22", score: 78, isPremium: true,
    dayPillar: { stem: "庚", stemEn: "Geng", branch: "申", branchEn: "Shen", element: "金", elementEn: "Metal", tenGod: "Rob Wealth" },
    favorableFor: ["Investments", "Negotiations"], unfavorableFor: ["Partnerships"],
    analysis: "Metal day with competitive energy. Good for solo ventures and investments." },
  // ── September 2025 (past) ──
  { date: "2025-09-09", score: 89, isPremium: true,
    dayPillar: { stem: "己", stemEn: "Ji", branch: "巳", branchEn: "Si", element: "土", elementEn: "Earth", tenGod: "Direct Resource" },
    favorableFor: ["Education", "Signing Documents", "Property"], unfavorableFor: ["Risky Activities"],
    analysis: "Earth-Fire combination supports stability and learning. Ideal for property deals." },
  // ── October 2025 (past) ──
  { date: "2025-10-10", score: 93, isPremium: true,
    dayPillar: { stem: "甲", stemEn: "Jia", branch: "午", branchEn: "Wu", element: "木", elementEn: "Wood", tenGod: "Friend" },
    favorableFor: ["Business Launch", "Wedding", "Travel"], unfavorableFor: ["Disputes"],
    analysis: "Wood-Fire day radiates positive energy. Excellent for celebrations and new starts." },
  // ── November 2025 (past) ──
  { date: "2025-11-11", score: 87, isPremium: true,
    dayPillar: { stem: "壬", stemEn: "Ren", branch: "子", branchEn: "Zi", element: "水", elementEn: "Water", tenGod: "Hurting Officer" },
    favorableFor: ["Networking", "Social Events", "Romance"], unfavorableFor: ["Formal Contracts"],
    analysis: "Double Water on 11/11 amplifies social connections and romantic energy." },
  // ── December 2025 (past) ──
  { date: "2025-12-12", score: 84, isPremium: true,
    dayPillar: { stem: "丁", stemEn: "Ding", branch: "亥", branchEn: "Hai", element: "火", elementEn: "Fire", tenGod: "Hurting Officer" },
    favorableFor: ["Year-End Celebrations", "Gifting", "Reflection"], unfavorableFor: ["Major Decisions"],
    analysis: "Fire-Water balance on 12/12. Good for year-end reflection and celebrations." },
  // ── January 2026 (past) ──
  { date: "2026-01-06", score: 80, isPremium: true,
    dayPillar: { stem: "乙", stemEn: "Yi", branch: "丑", branchEn: "Chou", element: "木", elementEn: "Wood", tenGod: "Rob Wealth" },
    favorableFor: ["New Year Planning", "Study", "Health Checks"], unfavorableFor: ["Risky Investments"],
    analysis: "Wood-Earth day supports steady planning. Good for setting intentions for the new year." },
  // ── February 2026 (past) ──
  { date: "2026-02-14", score: 90, isPremium: true,
    dayPillar: { stem: "丙", stemEn: "Bing", branch: "辰", branchEn: "Chen", element: "火", elementEn: "Fire", tenGod: "Eating God" },
    favorableFor: ["Romance", "Proposals", "Celebrations"], unfavorableFor: ["Confrontations"],
    analysis: "Fire-Earth on Valentine's Day brings warmth and passion. Perfect for romantic gestures." },
  // ── March 2026 (current month) ──
  { date: "2026-03-15", score: 92, isPremium: false,
    dayPillar: { stem: "甲", stemEn: "Jia", branch: "寅", branchEn: "Yin", element: "木", elementEn: "Wood", tenGod: "Friend" },
    favorableFor: ["Wedding", "Business Opening", "Moving", "Signing Contracts"], unfavorableFor: ["Surgery", "Funerals"],
    analysis: "Excellent day with strong Wood energy. Perfect for new beginnings and celebrations." },
  { date: "2026-03-22", score: 85, isPremium: false,
    dayPillar: { stem: "丙", stemEn: "Bing", branch: "午", branchEn: "Wu", element: "火", elementEn: "Fire", tenGod: "Eating God" },
    favorableFor: ["Travel", "Networking", "Celebrations"], unfavorableFor: ["Legal Matters", "Confrontations"],
    analysis: "Fire energy brings joy and social success. Great for gatherings and travel." },
];

// Helper function to get profile by ID
export function getBaziProfileById(id: string): BaziProfile | null {
  if (id === MOCK_BAZI_PROFILE.id) {
    return MOCK_BAZI_PROFILE;
  }
  return null;
}

// Helper function to get daily fortune
export function getDailyFortune(date?: string): DailyFortune {
  return MOCK_DAILY_FORTUNE;
}

// Helper function to get yearly forecast
export function getYearlyForecast(year: number): YearlyForecast {
  return MOCK_YEARLY_FORECAST;
}

// Helper function to get compatibility
export function getCompatibility(profileAId: string, profileBId: string): CompatibilityResult {
  return MOCK_COMPATIBILITY;
}

// Helper function to get auspicious dates
export function getAuspiciousDates(startDate: string, endDate: string): AuspiciousDate[] {
  return MOCK_AUSPICIOUS_DATES;
}
