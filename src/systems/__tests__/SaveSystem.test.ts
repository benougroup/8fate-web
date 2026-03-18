// @ts-nocheck
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SaveSystem } from "../SaveSystem";
import {
  LUMENFALL_SAVE_BACKUP,
  LUMENFALL_SAVE_MAIN,
  LUMENFALL_SAVE_TEMP,
  type EventBus,
  type GameState,
  type ModeMachine,
  type StateStore,
} from "../../state/SaveTypes";

class FakeBus implements EventBus {
  private handlers = new Map<string, Array<(payload?: unknown) => void>>();

  on(event: string, handler: (payload?: unknown) => void): () => void {
    const next = this.handlers.get(event) ?? [];
    next.push(handler);
    this.handlers.set(event, next);
    return () => {
      const existing = this.handlers.get(event) ?? [];
      this.handlers.set(
        event,
        existing.filter((h) => h !== handler),
      );
    };
  }

  emit(event: string, payload?: unknown): void {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }
}

function makeInitialState(): GameState {
  return {
    global: { inventory: { wood: 3 }, tools: { axe: true } },
    story: {
      activeStoryId: "s1",
      stage: { main: 2 },
      flags: { introDone: true },
      npc: { townFear: 7, trust: { guide: 5 }, npcFlags: { guide: { met: true } } },
      storyInventory: { relic: 1 },
      storyShadow: { seen: true },
    },
    runtime: {
      mode: "EXPLORE",
      time: { day: 1, phase: "DAY" },
      map: {
        currentMapId: "m1",
        mapsVisited: { m1: { lastX: 1, lastY: 2 } },
        transition: { to: "m2" },
      },
      player: { x: 1, y: 2, facing: "S", hp: 10, sp: 5, status: { poison: { expiresAtMs: 1000 } } },
      npcs: { entities: { npc_guard: { id: "npc_guard", mapId: "m1", x: 2, y: 2, px: 2, py: 2, facing: "S", nextStepAtMs: 0, waypointIndex: 0 } } },
      checkpoint: { dirty: true, snap: { hp: 10 } },
      dialogue: { isOpen: false },
      crafting: { isOpen: false },
      inventoryUI: { isOpen: false },
      shadows: { env: { fog: true }, static: { keep: true } },
      save: { dirty: true },
    },
  };
}

function makeStore(state = makeInitialState()): StateStore {
  let current = state;
  return {
    getState: () => current,
    tx: (mutator) => {
      const draft = structuredClone(current);
      mutator(draft);
      current = draft;
    },
    replaceState: (next) => {
      current = next;
    },
    createInitialState: () => makeInitialState(),
  };
}

describe("SaveSystem", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("saveNow writes TEMP and MAIN and round-trips", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);

    const res = system.saveNow("test");

    expect(res.ok).toBe(true);
    expect(localStorage.getItem(LUMENFALL_SAVE_TEMP)).toBeTruthy();
    expect(localStorage.getItem(LUMENFALL_SAVE_MAIN)).toBeTruthy();
    expect(() => JSON.parse(localStorage.getItem(LUMENFALL_SAVE_MAIN) ?? "")).not.toThrow();
  });

  it("corrupted MAIN falls back to BACKUP", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);

    system.saveNow("seed");
    localStorage.setItem(LUMENFALL_SAVE_BACKUP, localStorage.getItem(LUMENFALL_SAVE_MAIN) ?? "");
    localStorage.setItem(LUMENFALL_SAVE_MAIN, "{bad json");

    store.tx((draft) => {
      draft.runtime.player.x = 999;
    });

    const loaded = system.loadNow();
    expect(loaded.ok).toBe(true);
    expect(store.getState().runtime.player.x).toBe(1);
  });

  it("loadNow forces EXPLORE and clears transition/dialogue/crafting/env shadows", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);

    system.saveNow("seed");
    store.tx((draft) => {
      draft.runtime.mode = "FAINTING";
      draft.runtime.map.transition = { to: "x" };
      draft.runtime.dialogue = { isOpen: true };
      draft.runtime.crafting = { isOpen: true };
      draft.runtime.shadows = { env: { rain: true } };
    });

    system.loadNow();
    const state = store.getState();
    expect(state.runtime.mode).toBe("EXPLORE");
    expect(state.runtime.map.transition).toBeUndefined();
    expect(state.runtime.dialogue?.isOpen).toBe(false);
    expect(state.runtime.crafting?.isOpen).toBe(false);
    expect(state.runtime.shadows?.env).toEqual({});
  });

  it("newStory resets story but keeps global inventory/tools", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);

    system.newStory("new_story");

    const state = store.getState();
    expect(state.global.inventory).toEqual({ wood: 3 });
    expect(state.global.tools).toEqual({ axe: true });
    expect(state.story.activeStoryId).toBe("new_story");
    expect(state.story.flags).toEqual({});
    expect(state.story.storyInventory).toEqual({});
  });

  it("debounces multiple autosave requests into one save", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);
    const spy = vi.spyOn(system, "saveNow");

    system.requestAutosave("a");
    system.requestAutosave("b");
    system.requestAutosave("c");

    vi.advanceTimersByTime(499);
    expect(spy).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("defers autosave while unstable and flushes after stable mode", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "MAP_TRANSITION" };
    const system = new SaveSystem(store, bus, modeMachine);
    const spy = vi.spyOn(system, "saveNow");

    system.requestAutosave("checkpoint");
    vi.runAllTimers();
    expect(spy).not.toHaveBeenCalled();

    modeMachine.getMode = () => "EXPLORE";
    store.tx((draft) => {
      draft.runtime.mode = "EXPLORE";
      draft.runtime.map.transition = undefined;
      draft.runtime.dialogue = { isOpen: false };
      draft.runtime.crafting = { isOpen: false };
      draft.runtime.inventoryUI = { isOpen: false };
    });
    bus.emit("MODE_CHANGED");

    vi.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("saveNow is blocked while dialogue is active", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);

    store.tx((draft) => {
      draft.runtime.dialogue = { isOpen: true };
    });

    const res = system.saveNow("dialogue_guard");

    expect(res.ok).toBe(false);
    expect(res.error).toContain("Save blocked");
  });

  it("preserves story npc trust/townFear across save load", () => {
    const store = makeStore();
    const bus = new FakeBus();
    const modeMachine: ModeMachine = { getMode: () => "EXPLORE" };
    const system = new SaveSystem(store, bus, modeMachine);

    system.saveNow("seed");
    store.tx((draft) => {
      draft.story.npc.townFear = 1;
      draft.story.npc.trust.guide = 0;
    });

    system.loadNow();
    expect(store.getState().story.npc.townFear).toBe(7);
    expect(store.getState().story.npc.trust.guide).toBe(5);
  });
});
