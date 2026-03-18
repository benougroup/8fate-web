import brightHollowNPCData from "../data/npcs/bright_hollow.npcs.json";
import type { BeliefArchetype } from "../state/StateTypes";
import type { DialogueConditions } from "./DialogueConditions";

export type NPCTile = { mapId: string; x: number; y: number };
export type NPCWaypoint = { x: number; y: number };

export type NPCDefinition = {
  id: string;
  name: string;
  belief: BeliefArchetype;
  spriteId: string;
  routine: {
    homeAnchor?: NPCTile;
    dayAnchor?: NPCTile;
    nightAnchor?: NPCTile;
    dayWaypoints?: NPCWaypoint[];
    stepIntervalMs?: number;
  };
  interaction: {
    defaultSceneId: string;
    variants?: Array<{ sceneId: string; conditions?: DialogueConditions }>;
  };
  blocking?: {
    enabled: boolean;
    tiles: NPCTile[];
    onlyAtNight?: boolean;
    allowIf?: DialogueConditions;
  };
};

type NPCFile = { version: number; npcs: NPCDefinition[] };

const VALID_BELIEFS = new Set<BeliefArchetype>(["LanternFaith", "OldStories", "QuietDoubters"]);

export class NPCDatabase {
  private readonly byId = new Map<string, NPCDefinition>();

  constructor(file: NPCFile = brightHollowNPCData as NPCFile) {
    for (const npc of file.npcs) {
      if (this.byId.has(npc.id)) {
        throw new Error(`Duplicate NPC id: ${npc.id}`);
      }
      if (!VALID_BELIEFS.has(npc.belief)) {
        throw new Error(`Invalid belief archetype on ${npc.id}: ${npc.belief}`);
      }
      this.softCheckAnchor(npc.id, "dayAnchor", npc.routine.dayAnchor);
      this.softCheckAnchor(npc.id, "nightAnchor", npc.routine.nightAnchor);
      this.softCheckAnchor(npc.id, "homeAnchor", npc.routine.homeAnchor);
      this.byId.set(npc.id, npc);
    }
  }

  getAll(): NPCDefinition[] {
    return [...this.byId.values()];
  }

  getById(id: string): NPCDefinition | undefined {
    return this.byId.get(id);
  }

  private softCheckAnchor(npcId: string, name: string, tile?: NPCTile): void {
    if (!tile) return;
    if (!Number.isFinite(tile.x) || !Number.isFinite(tile.y)) {
      console.warn(`[NPCDatabase] ${npcId}.${name} has invalid coordinates`);
    }
  }
}
