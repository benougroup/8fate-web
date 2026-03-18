import type { GameState } from "./StateTypes";

export const CURRENT_SAVE_VERSION = 1;

export const LUMENFALL_SAVE_TEMP = "lumenfall_save_temp";
export const LUMENFALL_SAVE_MAIN = "lumenfall_save_main";
export const LUMENFALL_SAVE_BACKUP = "lumenfall_save_backup";

export type ModeName = "EXPLORE" | "MAP_TRANSITION" | "FAINTING" | "LOADING" | string;

export type { GameState };

export type SaveFile = {
  saveVersion: number;
  createdAtMs: number;
  updatedAtMs: number;
  global: GameState["global"];
  story: GameState["story"];
  runtime: {
    time: GameState["runtime"]["time"];
    map: {
      currentMapId: string;
      mapsVisited: Record<string, { lastX: number; lastY: number }>;
    };
    player: {
      x: number;
      y: number;
      facing: unknown;
      hp: number;
      sp: number;
      status: Record<string, { expiresAtMs: number }>;
    };
    npcs?: {
      entities: Record<string, GameState["runtime"]["npcs"] extends { entities: infer T } ? T : never>;
    };
    checkpoint: GameState["runtime"]["checkpoint"];
  };
};

export type StateStore = {
  getState(): Readonly<GameState>;
  tx(mutator: (draft: GameState) => void): void;
  replaceState(nextState: GameState): void;
  createInitialState?(): GameState;
};

export type EventBus = {
  on(event: string, handler: (payload?: unknown) => void): () => void;
  emit(event: string, payload?: unknown): void;
};

export type ModeMachine = {
  getMode(): ModeName;
};
