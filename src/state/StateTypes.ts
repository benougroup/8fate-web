export type CardinalFacing = "N" | "S" | "E" | "W";
export type TimePhase = "DAY" | "NIGHT" | string;

export type BeliefArchetype = "LanternFaith" | "OldStories" | "QuietDoubters";

export type RuntimeNPC = {
  id: string;
  mapId: string;
  x: number;
  y: number;
  px: number;
  py: number;
  facing: CardinalFacing;
  nextStepAtMs: number;
  waypointIndex: number;
};

export type StoryNPCState = {
  townFear: number;
  trust: Record<string, number>;
  npcFlags: Record<string, Record<string, unknown>>;
};

export type GameState = {
  global: {
    inventory?: Record<string, number>;
    tools?: Record<string, number | boolean>;
    [key: string]: unknown;
  };
  story: {
    activeStoryId?: string;
    stage?: Record<string, unknown>;
    flags?: Record<string, boolean>;
    npc: StoryNPCState;
    storyInventory?: Record<string, number>;
    storyShadow?: Record<string, unknown>;
    [key: string]: unknown;
  };
  runtime: {
    mode: string;
    time: {
      phase?: TimePhase;
      [key: string]: unknown;
    };
    map: {
      currentMapId: string;
      mapsVisited: Record<string, { lastX: number; lastY: number }>;
      transition?: unknown;
      [key: string]: unknown;
    };
    player: {
      x: number;
      y: number;
      facing: CardinalFacing | string;
      hp: number;
      sp: number;
      status: Record<string, { expiresAtMs: number }>;
      [key: string]: unknown;
    };
    npcs?: {
      entities: Record<string, RuntimeNPC>;
    };
    checkpoint: {
      dirty?: boolean;
      [key: string]: unknown;
    };
    dialogue?: { isOpen?: boolean; [key: string]: unknown };
    crafting?: { isOpen?: boolean; [key: string]: unknown };
    inventoryUI?: { isOpen?: boolean; [key: string]: unknown };
    shadows?: { env?: Record<string, unknown>; [key: string]: unknown };
    save?: { dirty?: boolean; [key: string]: unknown };
    ui?: { message?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
};
