import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- STATIC ASSETS ---
import backgroundImage from "@/assets/images/ui/background_003.png";
import iconLock from "@/assets/images/general icons/lock_icon.png";
import { resolveByFolderName, resolveImage } from "@/utils/imageResolver";

// Import the reusable component
import BottomNav from "@/components/BottomNav";

// --- SERVICES ---
import { getPortfolio, type PortfolioData as ServicePortfolioData } from "@services/endpoints/portfolio";
import { getSession } from "@services/sessionStore";
import AppShell from "@/components/AppShell";
import Popup from "@/components/Popup";
import InfoTrigger, { type DefinitionKey } from "@/components/InfoTrigger";
import ScrollDots from "@/components/ScrollDots";

// --- STATIC DATA DICTIONARY (For Popups) ---
// Descriptions for the Ten Gods to match Figma/Video educational content
const TEN_STARS_INFO: Record<string, string> = {
  "Direct Officer": "Represents discipline, authority, and conventional success. You value order, rules, and steady progress in your career.",
  "Seven Killings": "Represents bold action, risk-taking, and decisive leadership. You are dynamic and thrive in competitive environments.",
  "Direct Wealth": "Represents hard-earned income, diligence, and financial stability. You value steady work and responsible resource management.",
  "Indirect Wealth": "Represents entrepreneurial luck, investments, and windfalls. You have a knack for spotting opportunities others miss.",
  "Direct Resource": "Represents conventional knowledge, nurturing, and health. You are likely introspective and value education and comfort.",
  "Indirect Resource": "Represents intuition, unconventional wisdom, and unique talents. You are observant and may have metaphysical interests.",
  "Friend": "Represents peers, equality, and self-confidence. You value networking and have a strong sense of self.",
  "Rob Wealth": "Represents competitive spirit, social charisma, but potential wealth leakage. You are a natural networker but must manage spending.",
  "Eating God": "Represents creativity, strategy, and enjoyment of life. You are artistic, expressive, and prefer a refined lifestyle.",
  "Hurting Officer": "Represents flamboyance, verbal skill, and rebellion. You are a performer at heart and challenge the status quo."
};

const TEN_STAR_ORDER = [
  "Friend",
  "Rob Wealth",
  "Eating God",
  "Hurting Officer",
  "Direct Wealth",
  "Indirect Wealth",
  "Direct Officer",
  "Seven Killings",
  "Direct Resource",
  "Indirect Resource"
];

const STAR_POLARITY_TONES: Array<NonNullable<PortfolioData["tenStars"][number]["polarity"]>> = [
  "positive",
  "neutral",
  "negative",
  "positive",
  "neutral",
  "negative",
  "positive",
  "neutral",
  "negative",
  "positive"
];

const LUCK_ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];
const LUCK_NUMBER_SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LUCK_SUMMARY_STARTERS = [
  "This decade emphasizes deliberate growth and strategic choices",
  "A transitional cycle invites you to recalibrate priorities",
  "Momentum builds steadily when you honor consistent routines",
  "Expect a phase of experimentation paired with careful planning",
  "A stabilizing decade rewards patience and grounded decisions",
];

const LUCK_SUMMARY_MIDDLES = [
  "Channel the dominant element to guide your daily focus",
  "Lean into mentorship and structured learning opportunities",
  "Balance expansion with rest to avoid energetic burnout",
  "Refine your networks and keep communication intentional",
  "Stay adaptable as circumstances shift through the years",
];

const LUCK_SUMMARY_ENDS = [
  "Overall, this cycle favors steady progress over quick wins.",
  "Overall, measured risk will unlock the best outcomes.",
  "Overall, grounding practices will keep you aligned.",
  "Overall, thoughtful pacing will sustain your success.",
  "Overall, clarity and patience will be your strongest allies.",
];

const LUCK_TOPIC_DETAILS = [
  { label: "Career", description: "Work momentum and leadership outlook." },
  { label: "Wealth", description: "Cash flow, savings, and investments." },
  { label: "Health", description: "Energy balance and vitality." },
  { label: "Talent", description: "Learning, creativity, and growth." },
  { label: "Love", description: "Relationships and emotional harmony." },
  { label: "Family", description: "Support systems and home life." }
];

const LUCK_TOPIC_VARIANTS: Record<string, string[]> = {
  Career: [
    "Progress feels strongest when you embrace {element}-style leadership. Build credibility through consistent delivery.",
    "This cycle rewards long-term planning. Focus on skill depth and sustainable routines in the {years} window.",
    "Expect opportunities to expand scope. Keep milestones visible to turn momentum into promotions.",
  ],
  Wealth: [
    "Budgeting discipline pays off. Favor {element}-aligned investments and reduce impulse spending.",
    "Income grows through steady streams rather than windfalls. Reinforce savings during {years}.",
    "Diversify cautiously and track expenses weekly to protect your gains.",
  ],
  Health: [
    "Energy improves with structured habits. Prioritize recovery and balance throughout {years}.",
    "Stay mindful of stress signals. Gentle movement and hydration support {element} harmony.",
    "Focus on consistency over intensity to keep vitality strong.",
  ],
  Talent: [
    "Creative breakthroughs arrive after steady practice. Let {element} inspire your learning path.",
    "Sharpen one signature skill and showcase it regularly during {years}.",
    "Seek mentors who help refine technique and confidence.",
  ],
  Love: [
    "Relationships deepen with clear communication. Offer stability and patience this cycle.",
    "Set healthy boundaries early to keep emotional flow balanced in {years}.",
    "Small gestures and shared routines strengthen connection.",
  ],
  Family: [
    "Home life thrives when you create predictable rhythms. Make space for rest and reunion.",
    "Support systems feel stronger when you check in consistently through {years}.",
    "Lean on shared traditions to keep harmony centered.",
  ],
};

// --- TYPES ---
interface PortfolioData {
  userName: string;
  isPremium: boolean;
  coreTraits: {
    zodiac: string;
    westernZodiac: string;
    dayMaster: string;
    yinYang: string;
  };
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  fourPillars: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  luckCycles: {
    period: string;
    element?: string;
    age?: number;
    isCurrent?: boolean;
    summary?: string;
    stats?: { label: string; value: string }[];
  }[];
  tenStars: {
    name: string;
    position?: string;
    polarity?: "positive" | "negative" | "neutral";
  }[];
}

// --- DYNAMIC IMAGE HELPER ---
function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/[_\s]+/g, " ");
}

function getElementKey(value: string) {
  const key = normalizeText(value);
  if (key.includes("wood")) return "wood";
  if (key.includes("fire")) return "fire";
  if (key.includes("earth")) return "earth";
  if (key.includes("metal")) return "metal";
  if (key.includes("water")) return "water";
  return "fire";
}

function resolveElementImage(value: string) {
  const elementKey = normalizeText(value);
  const file = elementKey === "metal" ? "gold" : elementKey;
  return resolveImage(`elements/${file}.png`);
}

function resolveDayMasterImage(dayMaster: string) {
  const normalized = normalizeText(dayMaster);
  const polarity = normalized.includes("yin") ? "yin" : normalized.includes("yang") ? "yang" : "";
  const element = getElementKey(normalized);

  if (!polarity) {
    return resolveImage("ui/icon_help.png");
  }

  return resolveByFolderName("daymaster", `${polarity} ${element}`);
}

function getYinYangType(text: string) {
  const t = text.toLowerCase();
  if (t.includes("yin")) return "yin";
  if (t.includes("yang")) return "yang";
  return "yang";
}

function mapPortfolioData(
  apiData: ServicePortfolioData,
  session: ReturnType<typeof getSession>,
): PortfolioData {
  const coreTraits = apiData.core_traits;
  const elemental = apiData.elemental_balance_chart || {};
  const luckCycles = apiData.luck_cycles ?? [];
  const tenStars = apiData.ten_stars ?? [];

  return {
    userName: session?.name || "User",
    isPremium: !!session?.isPremium,
    coreTraits: {
      zodiac: coreTraits?.zodiac_sign || "—",
      westernZodiac: coreTraits?.horoscope || "—",
      dayMaster: coreTraits?.day_master || "—",
      yinYang: getYinYangType(coreTraits?.day_master || ""),
    },
    fiveElements: {
      wood: elemental.Wood ?? 0,
      fire: elemental.Fire ?? 0,
      earth: elemental.Earth ?? 0,
      metal: elemental.Metal ?? 0,
      water: elemental.Water ?? 0,
    },
    fourPillars: apiData.four_pillars ?? { year: "—", month: "—", day: "—", hour: "—" },
    luckCycles: luckCycles.map((cycle: any) => {
      const topics = cycle?.topics || {};
      const [element, summary] = Object.entries(topics)[0] || [];
      return {
        period: cycle?.title || `${cycle?.start ?? ""} ${cycle?.end ?? ""}`.trim(),
        element: element as string | undefined,
        summary: summary as string | undefined,
        stats: cycle?.stats ?? [],
      };
    }),
    tenStars: tenStars.map((star: any) => ({
      name: star?.name || "Star",
      position: star?.position || star?.strength,
      polarity: star?.influence ? "neutral" : undefined,
    })),
  };
}

type LuckCycleCard = {
  id: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  element: string;
  macroLuckNumber: number;
  macroLuckElement: string;
  isCurrent: boolean;
  summary: string;
  topics: Record<string, string>;
};

function buildLuckCycles(rawCycles: PortfolioData["luckCycles"], currentAge = 30): LuckCycleCard[] {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - currentAge;
  const baseCycles = Array.from({ length: 10 }, (_, index) => {
    const startAge = index * 10;
    const endAge = startAge + 9;
    const startYear = birthYear + startAge;
    const endYear = birthYear + endAge;
    const isCurrent = currentAge >= startAge && currentAge <= endAge;
    const macroLuckNumber = isCurrent ? 9 : LUCK_NUMBER_SEQUENCE[index % LUCK_NUMBER_SEQUENCE.length];
    const macroLuckElement = isCurrent ? "Fire" : LUCK_ELEMENTS[(index + 1) % LUCK_ELEMENTS.length];
    const summaryStarter = LUCK_SUMMARY_STARTERS[index % LUCK_SUMMARY_STARTERS.length];
    const summaryMiddle = LUCK_SUMMARY_MIDDLES[(index + 2) % LUCK_SUMMARY_MIDDLES.length];
    const summaryEnd = LUCK_SUMMARY_ENDS[(index + 3) % LUCK_SUMMARY_ENDS.length];
    const summary = `${summaryStarter}. ${summaryMiddle}. ${summaryEnd}`;
    const yearsLabel = `${startYear}–${endYear}`;
    return {
      id: `${startAge}-${endAge}`,
      startAge,
      endAge,
      startYear,
      endYear,
      element: LUCK_ELEMENTS[index % LUCK_ELEMENTS.length],
      macroLuckNumber,
      macroLuckElement,
      isCurrent,
      summary,
      topics: Object.fromEntries(
        LUCK_TOPIC_DETAILS.map((topic, topicIndex) => {
          const variants = LUCK_TOPIC_VARIANTS[topic.label] || [];
          const template = variants[(index + topicIndex) % variants.length] || topic.description;
          return [
            topic.label,
            template
              .replace("{element}", macroLuckElement)
              .replace("{years}", yearsLabel),
          ];
        })
      ),
    };
  });

  return baseCycles.map((cycle, index) => {
    const apiCycle = rawCycles[index];
    const apiSummary = apiCycle?.summary?.trim();
    const fallbackSentences = cycle.summary.split(". ").filter(Boolean);
    const summary =
      apiSummary && apiSummary.length > 0
        ? `${apiSummary.endsWith(".") ? apiSummary.slice(0, -1) : apiSummary}. ${fallbackSentences
            .slice(1)
            .join(". ")}`
        : cycle.summary;
    return {
      ...cycle,
      element: apiCycle?.element || cycle.element,
      summary,
    };
  });
}

// --- COMPONENTS ---
const RadarChart = ({ data }: { data: PortfolioData["fiveElements"] }) => {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const elements = ["wood", "fire", "earth", "metal", "water"];

  const dataPoints = elements
    .map((key, i) => {
      const value = (data as any)[key] || 0;
      const r = (Math.min(value, 100) / 100) * radius;
      const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `${center + r * Math.cos(angle)},${center - r * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size}>
        {[1, 0.75, 0.5, 0.25].map((scale, idx) => (
          <polygon
            key={idx}
            points={elements
              .map((_, i) => {
                const r = radius * scale;
                const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
                return `${center + r * Math.cos(angle)},${center - r * Math.sin(angle)}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        {elements.map((_, i) => {
          const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center - radius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={dataPoints}
          fill="rgba(244, 215, 62, 0.4)"
          stroke="#F4D73E"
          strokeWidth="2"
        />
        {elements.map((el, i) => {
          const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
          const r = radius + 25;
          const x = center + r * Math.cos(angle);
          const y = center - r * Math.sin(angle);
          const iconPath = resolveElementImage(el);
          return (
            <g key={i}>
              <image href={iconPath} x={x - 10} y={y - 15} height="20" width="20" />
              <text
                x={x}
                y={y + 12}
                fill="#fff"
                fontSize="10"
                textAnchor="middle"
                style={{ textTransform: "capitalize", fontWeight: "bold" }}
              >
                {el}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function Portfolio() {
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // State for Popups
  const [selectedCycle, setSelectedCycle] = useState<LuckCycleCard | null>(null);
  const [selectedStar, setSelectedStar] = useState<{ name: string; description: string } | null>(null);
  const [selectedLuckTopic, setSelectedLuckTopic] = useState("Career");
  const luckScrollRef = useRef<HTMLDivElement | null>(null);

  const insightIcons = useMemo(
    () => ({
      Career: resolveByFolderName("destiny icons", "career"),
      Health: resolveByFolderName("destiny icons", "health"),
      Wealth: resolveByFolderName("destiny icons", "wealth"),
      Love: resolveByFolderName("destiny icons", "love"),
      Talent: resolveByFolderName("destiny icons", "talent"),
      Family: resolveByFolderName("destiny icons", "family"),
    }),
    []
  );

  const insightDefinitions: Record<string, DefinitionKey> = useMemo(
    () => ({
      Career: "career",
      Wealth: "wealth",
      Love: "love",
      Talent: "talent",
      Family: "family",
    }),
    []
  );

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const session = getSession();
        const response = await getPortfolio();

        if (response.ok && response.data) {
          setData(mapPortfolioData(response.data, session));
        }
      } catch (err) {
        console.error("Portfolio error", err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  useEffect(() => {
    if (selectedCycle) {
      setSelectedLuckTopic("Career");
    }
  }, [selectedCycle?.id]);

  const displayCycles = useMemo(() => buildLuckCycles(data?.luckCycles ?? [], 30), [data?.luckCycles]);
  const displayStars = useMemo(() => {
    const starMap = new Map((data?.tenStars ?? []).map((star) => [star.name, star]));
    return TEN_STAR_ORDER.map((name, index) => {
      const matched = starMap.get(name);
      return {
        name,
        position: matched?.position,
        polarity: matched?.polarity ?? STAR_POLARITY_TONES[index % STAR_POLARITY_TONES.length],
        description:
          TEN_STARS_INFO[name] ||
          "A powerful force in your chart influencing your destiny.",
      };
    });
  }, [data?.tenStars]);

  if (loading)
    return (
      <AppShell hideNav>
        <div style={{ background: "#0B0C2A", height: "100vh", width: "100vw" }} />
      </AppShell>
    );

  return (
    <AppShell style={{ background: "#0B0C2A", color: "#fff" }}>
      <div className="portfolio-screen">
        <style>{`
          .portfolio-screen {
            min-height: 100vh;
            width: 100%;
            position: relative;
            background-color: #0B0C2A;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding-bottom: 90px;
            overflow-y: auto;
            color: #fff;
          }
          .port-bg {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 1.0;
            z-index: 0;
          }
          .content-container {
            position: relative;
            z-index: 1;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .glass-box {
            background: rgba(29, 35, 47, 0.6);
            border: 1px solid rgba(70, 98, 112, 0.3);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(12px);
          }
          .section-title {
            color: #F4D73E;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 16px 0;
            font-weight: 700;
            text-align: center;
          }
          .traits-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }
          .trait-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 45%;
          }
          .trait-item.clickable {
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .trait-item.clickable:active {
            transform: translateY(1px);
          }
          .trait-icon-container {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #F4D73E;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .trait-img {
            width: 70%;
            height: 70%;
            object-fit: contain;
            filter: drop-shadow(0 0 2px rgba(244, 215, 62, 0.5));
          }
          .trait-label {
            font-size: 11px;
            opacity: 0.6;
            text-transform: uppercase;
            margin-top: 4px;
            text-align: center;
          }
          .trait-value {
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            text-align: center;
            line-height: 1.2;
            text-transform: capitalize;
          }

          .pillars-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            text-align: center;
          }
          .pillar-col {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 10px 4px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .pillar-head {
            color: #F4D73E;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .pillar-val {
            font-size: 13px;
            font-weight: 600;
          }

          .destiny-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .destiny-item {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }
          .destiny-icon {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
          .destiny-label {
            font-size: 11px;
            font-weight: 500;
          }

          .stars-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .star-item {
            background: rgba(29, 35, 47, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .star-item:active {
            background: rgba(244, 215, 62, 0.1);
          }
          .star-icon {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
          .star-name {
            font-size: 13px;
            font-weight: 600;
          }
          .star-tone {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.4);
          }
          .star-tone.positive { background: #4cd964; }
          .star-tone.neutral { background: #f4d73e; }
          .star-tone.negative { background: #ff6b6b; }

          .luck-scroll {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding-bottom: 12px;
            scrollbar-width: none;
          }
          .luck-scroll::-webkit-scrollbar {
            display: none;
          }
          .luck-card {
            min-width: 90px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
            cursor: pointer;
          }
          .luck-card.current {
            border-color: #F4D73E;
            background: rgba(244, 215, 62, 0.1);
            box-shadow: 0 0 10px rgba(244, 215, 62, 0.15);
          }
          .luck-age {
            font-size: 12px;
            opacity: 0.7;
          }
          .luck-period {
            font-size: 10px;
            color: #F4D73E;
          }
          .luck-elem {
            font-weight: 600;
            font-size: 13px;
            margin: 4px 0;
          }
          .luck-years {
            font-size: 10px;
            opacity: 0.7;
          }

          .locked-overlay {
            position: absolute;
            inset: 0;
            background: rgba(11, 12, 42, 0.6);
            backdrop-filter: blur(3px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            z-index: 10;
          }
          .lock-btn {
            background: #F4D73E;
            border: none;
            padding: 6px 14px;
            border-radius: 20px;
            color: #0B0C2A;
            font-weight: 700;
            font-size: 12px;
            margin-top: 8px;
            cursor: pointer;
          }
        `}</style>

        <img src={backgroundImage} className="port-bg" alt="bg" />

        <div className="content-container">
          {/* Header */}
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: "24px", margin: 0, color: "#fff" }}>{data?.userName}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "13px", opacity: 0.7 }}>Metaphysical Portfolio</span>
              {data?.isPremium && (
                <span
                  style={{
                    background: "#F4D73E",
                    color: "#000",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "bold"
                  }}
                >
                  PRO
                </span>
              )}
            </div>
          </div>

          {/* 1. Core Traits */}
          <div className="glass-box">
            <div className="traits-row">
              <div
                className="trait-item clickable"
                onClick={() => {
                  if (data?.coreTraits.zodiac) {
                    localStorage.setItem("last_zodiac_sign", data.coreTraits.zodiac);
                  }
                  const signParam = data?.coreTraits.zodiac ? `?sign=${encodeURIComponent(data.coreTraits.zodiac)}` : "";
                  navigate(`/zodiac-detail${signParam}`);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="trait-icon-container">
                  <img
                    src={resolveByFolderName("zodiac", data?.coreTraits.zodiac || "")}
                    alt="Zodiac"
                    className="trait-img"
                  />
                </div>
                <span className="trait-value">{data?.coreTraits.zodiac}</span>
                <span className="trait-label">
                  Zodiac
                  <InfoTrigger defKey="zodiac" />
                </span>
              </div>
              <div className="trait-item">
                <div className="trait-icon-container">
                  <img
                    src={resolveByFolderName("western_zodiac", data?.coreTraits.westernZodiac || "")}
                    className="trait-img"
                    alt="Western Zodiac"
                  />
                </div>
                <span className="trait-value">{data?.coreTraits.westernZodiac}</span>
                <span className="trait-label">Western Zodiac</span>
              </div>
              <div className="trait-item clickable" onClick={() => navigate("/day-master-detail")} role="button" tabIndex={0}>
                <div className="trait-icon-container">
                  <img
                    src={resolveDayMasterImage(data?.coreTraits.dayMaster || "")}
                    className="trait-img"
                    alt="Day Master"
                  />
                </div>
                <span className="trait-value">{data?.coreTraits.dayMaster}</span>
                <span className="trait-label">
                  Day Master
                  <InfoTrigger defKey="dayMaster" />
                </span>
              </div>
              <div
                className="trait-item clickable"
                onClick={() => {
                  const yinYangKey = getYinYangType(data?.coreTraits.yinYang || "");
                  const keyParam = yinYangKey ? `?key=${encodeURIComponent(yinYangKey)}` : "";
                  navigate(`/yin-yang-detail${keyParam}`);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="trait-icon-container">
                  <img
                    src={resolveByFolderName("yin_yang", getYinYangType(data?.coreTraits.yinYang || ""))}
                    className="trait-img"
                    alt="Balance"
                  />
                </div>
                <span className="trait-value">{data?.coreTraits.yinYang}</span>
                <span className="trait-label">
                  Balance
                  <InfoTrigger defKey="yinYang" />
                </span>
              </div>
            </div>
          </div>

          {/* 2. Five Elements Radar */}
          <div className="glass-box">
            <div className="section-title">
              Elemental Balance
              <InfoTrigger defKey="elements" />
            </div>
            {data?.fiveElements && <RadarChart data={data.fiveElements} />}
          </div>

          {/* 3. Four Pillars */}
          <div className="glass-box">
            <div className="section-title">Four Pillars (BaZi)</div>
            <div className="pillars-grid">
              <div className="pillar-col">
                <span className="pillar-head">
                  Year
                  <InfoTrigger defKey="yearPillar" />
                </span>
                <span className="pillar-val">{data?.fourPillars.year}</span>
              </div>
              <div className="pillar-col">
                <span className="pillar-head">
                  Month
                  <InfoTrigger defKey="monthPillar" />
                </span>
                <span className="pillar-val">{data?.fourPillars.month}</span>
              </div>
              <div className="pillar-col">
                <span className="pillar-head">
                  Day
                  <InfoTrigger defKey="dayPillar" />
                </span>
                <span className="pillar-val">{data?.fourPillars.day}</span>
              </div>
              <div className="pillar-col">
                <span className="pillar-head">
                  Hour
                  <InfoTrigger defKey="hourPillar" />
                </span>
                <span className="pillar-val">{data?.fourPillars.hour}</span>
              </div>
            </div>
          </div>

          {/* 4. Destiny Insights */}
          <div className="glass-box">
            <div className="section-title">Destiny Insights</div>
            <div className="destiny-grid">
              {Object.entries(insightIcons).map(([label, icon]) => (
                <div
                  key={label}
                  className="destiny-item"
                  onClick={() => navigate(`/insight/${label.toLowerCase()}`)}
                >
                  <img src={icon} alt={label} className="destiny-icon" />
                  <span className="destiny-label">
                    {label}
                    {insightDefinitions[label] && <InfoTrigger defKey={insightDefinitions[label]} />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Luck Cycles (With Popup) */}
            <div className="glass-box">
            <div className="section-title">10-Year Luck Cycles</div>
            <div className="luck-scroll" ref={luckScrollRef}>
              {displayCycles.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  className={`luck-card ${cycle.isCurrent ? "current" : ""}`}
                  onClick={() => {
                    setSelectedCycle(cycle);
                    setSelectedLuckTopic("Career");
                  }}
                >
                  <span className="luck-age">Age {cycle.startAge}-{cycle.endAge}</span>
                  <span className="luck-elem">{cycle.element}</span>
                  <span className="luck-period">{cycle.startYear}–{cycle.endYear}</span>
                  <span className="luck-years">10-year cycle</span>
                </button>
              ))}
            </div>
            <ScrollDots count={displayCycles.length} scrollRef={luckScrollRef} />
            {!data?.isPremium && (
              <div className="locked-overlay">
                <img src={iconLock} alt="Locked" style={{ width: 24, marginBottom: 8 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Unlock Future Cycles</span>
                <button className="lock-btn" onClick={() => navigate("/membership")}>
                  Upgrade
                </button>
              </div>
            )}
          </div>

          {/* 6. Ten Stars (With Popup) */}
          <div className="glass-box">
            <div className="section-title">
              Ten Stars (Gods)
              <InfoTrigger defKey="tenStars" />
            </div>
            <div className="stars-grid">
              {displayStars.map((star, i) => (
                  <div
                    key={i}
                    className="star-item"
                    onClick={() =>
                      setSelectedStar({
                        name: star.name,
                        description: star.description,
                      })
                    }
                  >
                    <img
                      src={resolveByFolderName("ten_stars", star.name)}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      alt={star.name}
                      className="star-icon"
                    />
                    <span className="star-name">{star.name}</span>
                    <span className={`star-tone ${star.polarity || "neutral"}`} title={star.polarity || "neutral"} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP: Luck Cycle */}
      <Popup
        open={Boolean(selectedCycle)}
        title={selectedCycle ? `Age ${selectedCycle.startAge}-${selectedCycle.endAge} Luck Cycle` : "Luck Cycle"}
        message={
          selectedCycle ? (
            <div style={{ display: "grid", gap: 16, textAlign: "left" }}>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Age</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>
                        {selectedCycle.startAge}-{selectedCycle.endAge}
                      </span>
                      {selectedCycle.isCurrent && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 999,
                            background: "rgba(244, 215, 62, 0.2)",
                            color: "#F4D73E",
                            border: "1px solid rgba(244, 215, 62, 0.4)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Years</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>
                      {selectedCycle.startYear}–{selectedCycle.endYear}
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Element</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedCycle.element}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Macro Element</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{selectedCycle.macroLuckElement}</div>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Macro Luck</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>
                      {selectedCycle.macroLuckNumber} Luck
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{selectedCycle.summary}</div>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Focus Areas</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {LUCK_TOPIC_DETAILS.map((topic) => {
                    const isActive = selectedLuckTopic === topic.label;
                    return (
                      <button
                        key={topic.label}
                        type="button"
                        onClick={() => setSelectedLuckTopic(topic.label)}
                        style={{
                          background: isActive ? "rgba(244, 215, 62, 0.2)" : "rgba(0,0,0,0.25)",
                          borderRadius: 10,
                          padding: 10,
                          display: "grid",
                          gap: 6,
                          justifyItems: "center",
                          textAlign: "center",
                          border: isActive ? "1px solid rgba(244, 215, 62, 0.5)" : "1px solid transparent",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={insightIcons[topic.label as keyof typeof insightIcons]}
                          alt={topic.label}
                          style={{ width: 28, height: 28 }}
                        />
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{topic.label}</div>
                        <div style={{ fontSize: 10, opacity: 0.7 }}>{topic.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>
                  {selectedLuckTopic} Insight
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  {selectedCycle.topics[selectedLuckTopic]}
                </div>
              </div>
            </div>
          ) : null
        }
        tone="info"
        onClose={() => setSelectedCycle(null)}
        dismissLabel="Close"
        closeOnBackdrop
      />

      {/* POPUP: Ten Stars */}
      <Popup
        open={Boolean(selectedStar)}
        title={selectedStar?.name || "Star Detail"}
        iconOverride={selectedStar ? resolveByFolderName("ten_stars", selectedStar.name) : undefined}
        message={<div style={{ textAlign: "center", lineHeight: 1.5 }}>{selectedStar?.description}</div>}
        tone="info"
        onClose={() => setSelectedStar(null)}
        dismissLabel="Got it"
        closeOnBackdrop
      />

      <BottomNav />
    </AppShell>
  );
}
