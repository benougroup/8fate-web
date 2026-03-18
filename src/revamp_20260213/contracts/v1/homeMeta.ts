export type LuckLevel = "strong" | "good" | "steady" | "caution" | "low";

export type DailyReadingMeta = {
  luckLevel: LuckLevel;
  quote: string;
};

export type LuckPanelMeta = {
  number: number;
  colorHex: string;
  zodiac:
    | "mouse"
    | "ox"
    | "tiger"
    | "rabbit"
    | "dragon"
    | "snake"
    | "horse"
    | "sheep"
    | "monkey"
    | "rooster"
    | "dog"
    | "pig";
  element: "water" | "wood" | "fire" | "earth" | "metal";
  direction:
    | "east"
    | "west"
    | "north"
    | "south"
    | "east-north"
    | "east-south"
    | "west-north"
    | "west-south";
};
