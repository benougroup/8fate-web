import type { EventBus, StateStore } from "../state/SaveTypes";
import type { GameState, RuntimeNPC } from "../state/StateTypes";
import { evaluateDialogueConditions } from "./DialogueConditions";
import type { NPCDefinition, NPCWaypoint } from "./NPCDatabase";
import { NPCDatabase } from "./NPCDatabase";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export class NPCSystem {
  constructor(
    private readonly store: StateStore,
    private readonly bus: EventBus,
    private readonly db = new NPCDatabase(),
  ) {}

  ensureRuntimeEntities(): void {
    this.store.tx((draft) => {
      draft.story.npc ??= { townFear: 0, trust: {}, npcFlags: {} };
      draft.story.npc.townFear ??= 0;
      draft.story.npc.trust ??= {};
      draft.story.npc.npcFlags ??= {};
      draft.runtime.npcs ??= { entities: {} };

      for (const npc of this.db.getAll()) {
        if (!draft.runtime.npcs.entities[npc.id]) {
          const anchor = npc.routine.dayAnchor ?? npc.routine.nightAnchor ?? npc.routine.homeAnchor;
          draft.runtime.npcs.entities[npc.id] = {
            id: npc.id,
            mapId: anchor?.mapId ?? "",
            x: anchor?.x ?? -1,
            y: anchor?.y ?? -1,
            px: anchor?.x ?? -1,
            py: anchor?.y ?? -1,
            facing: "S",
            nextStepAtMs: 0,
            waypointIndex: 0,
          };
        }
      }
    });
  }

  onPhaseChange(phaseEvent: "DAY_START" | "NIGHT_START"): void {
    const phaseKey = phaseEvent === "DAY_START" ? "dayAnchor" : "nightAnchor";
    this.store.tx((draft) => {
      draft.runtime.npcs ??= { entities: {} };
      for (const npc of this.db.getAll()) {
        const runtime = draft.runtime.npcs.entities[npc.id];
        if (!runtime) continue;
        const anchor = npc.routine[phaseKey];
        if (!anchor) continue;
        runtime.mapId = anchor.mapId;
        runtime.x = anchor.x;
        runtime.y = anchor.y;
        runtime.px = anchor.x;
        runtime.py = anchor.y;
      }
    });
  }

  tick(nowMs: number): void {
    const state = this.store.getState();
    if (String(state.runtime.time.phase) !== "DAY") return;

    this.store.tx((draft) => {
      const entities = draft.runtime.npcs?.entities;
      if (!entities) return;
      for (const npc of this.db.getAll()) {
        this.stepWaypoint(draft, npc, entities[npc.id], nowMs);
      }
    });
  }

  getTrust(state: Readonly<GameState>, npcId: string): number {
    return state.story.npc?.trust?.[npcId] ?? 0;
  }

  setTrust(npcId: string, value: number): void {
    this.store.tx((draft) => {
      draft.story.npc ??= { townFear: 0, trust: {}, npcFlags: {} };
      draft.story.npc.trust ??= {};
      draft.story.npc.trust[npcId] = clamp(value);
    });
    this.bus.emit("NPC_TRUST_CHANGED", { npcId, trust: clamp(value) });
  }

  addTrust(npcId: string, delta: number): void {
    const next = this.getTrust(this.store.getState(), npcId) + delta;
    this.setTrust(npcId, next);
  }

  setTownFear(value: number): void {
    const fear = clamp(value);
    this.store.tx((draft) => {
      draft.story.npc ??= { townFear: 0, trust: {}, npcFlags: {} };
      draft.story.npc.townFear = fear;
    });
    this.bus.emit("TOWN_FEAR_CHANGED", { value: fear });
  }

  addTownFear(delta: number): void {
    const current = this.store.getState().story.npc?.townFear ?? 0;
    this.setTownFear(current + delta);
  }

  npcBlocksTile(state: Readonly<GameState>, mapId: string, x: number, y: number): boolean {
    const playerX = state.runtime.player.x;
    const playerY = state.runtime.player.y;
    if (playerX === x && playerY === y) return false;

    for (const npc of this.db.getAll()) {
      const block = npc.blocking;
      if (!block?.enabled) continue;
      if (block.onlyAtNight && String(state.runtime.time.phase) !== "NIGHT") continue;
      if (block.allowIf && evaluateDialogueConditions(state, block.allowIf, { speakerNpcId: npc.id })) continue;
      if (block.tiles.some((tile) => tile.mapId === mapId && tile.x === x && tile.y === y)) {
        return true;
      }
    }
    return false;
  }

  attemptPlayerMove(nextX: number, nextY: number): boolean {
    const state = this.store.getState();
    const mapId = state.runtime.map.currentMapId;
    if (this.npcBlocksTile(state, mapId, nextX, nextY)) {
      this.store.tx((draft) => {
        draft.runtime.ui = { ...(draft.runtime.ui ?? {}), message: "The guard gently blocks the way." };
      });
      this.bus.emit("UI_MESSAGE", { text: "The guard gently blocks the way." });
      return false;
    }
    return true;
  }

  interactAdjacentNPC(): string | null {
    const state = this.store.getState();
    const player = state.runtime.player;
    const entities = state.runtime.npcs?.entities ?? {};

    for (const npc of this.db.getAll()) {
      const runtime = entities[npc.id];
      if (!runtime || runtime.mapId !== state.runtime.map.currentMapId) continue;
      const dist = Math.abs(player.x - runtime.x) + Math.abs(player.y - runtime.y);
      if (dist <= 1) {
        const sceneId = this.chooseSceneId(state, npc);
        this.bus.emit("StartScene", { storyId: state.story.activeStoryId ?? "demo", sceneId, npcId: npc.id });
        return sceneId;
      }
    }

    return null;
  }

  private chooseSceneId(state: Readonly<GameState>, npc: NPCDefinition): string {
    for (const variant of npc.interaction.variants ?? []) {
      if (evaluateDialogueConditions(state, variant.conditions, { speakerNpcId: npc.id })) {
        return variant.sceneId;
      }
    }
    return npc.interaction.defaultSceneId;
  }

  private stepWaypoint(draft: GameState, npc: NPCDefinition, runtime: RuntimeNPC | undefined, nowMs: number): void {
    if (!runtime) return;
    if (runtime.mapId !== draft.runtime.map.currentMapId) return;

    const stepIntervalMs = npc.routine.stepIntervalMs ?? 0;
    const waypoints = npc.routine.dayWaypoints ?? [];
    if (stepIntervalMs <= 0 || waypoints.length === 0) return;
    if (nowMs < runtime.nextStepAtMs) return;

    const waypoint = waypoints[runtime.waypointIndex % waypoints.length];
    const step = this.stepTowards(runtime.x, runtime.y, waypoint);
    const blocked = this.npcBlocksTile(draft, runtime.mapId, step.x, step.y);

    if (!blocked) {
      runtime.facing = this.facingFromDelta(step.x - runtime.x, step.y - runtime.y);
      runtime.x = step.x;
      runtime.y = step.y;
      runtime.px = step.x;
      runtime.py = step.y;
    }

    if (step.x === waypoint.x && step.y === waypoint.y) {
      runtime.waypointIndex = (runtime.waypointIndex + 1) % waypoints.length;
    } else if (blocked) {
      runtime.waypointIndex = (runtime.waypointIndex + 1) % waypoints.length;
    }

    runtime.nextStepAtMs = nowMs + stepIntervalMs;
  }

  private stepTowards(x: number, y: number, waypoint: NPCWaypoint): { x: number; y: number } {
    const dx = waypoint.x - x;
    const dy = waypoint.y - y;

    if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
      return { x: x + Math.sign(dx), y };
    }
    if (dy !== 0) {
      return { x, y: y + Math.sign(dy) };
    }
    return { x, y };
  }

  private facingFromDelta(dx: number, dy: number): RuntimeNPC["facing"] {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "E" : "W";
    }
    if (dy !== 0) {
      return dy > 0 ? "S" : "N";
    }
    return "S";
  }
}
