// @ts-nocheck
import { describe, expect, it } from "vitest";
import { NPCSystem } from "../NPCSystem";
import { NPCDatabase } from "../NPCDatabase";

class FakeBus {
  handlers = new Map();
  events = [];
  on(event, handler) {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
    return () => {};
  }
  emit(event, payload) {
    this.events.push({ event, payload });
    for (const h of this.handlers.get(event) ?? []) h(payload);
  }
}

function makeStore(phase = "DAY") {
  let state = {
    global: {},
    story: { activeStoryId: "demo", flags: {}, npc: { townFear: 0, trust: {}, npcFlags: {} } },
    runtime: {
      mode: "EXPLORE",
      time: { phase },
      map: { currentMapId: "bright_hollow", mapsVisited: { bright_hollow: { lastX: 0, lastY: 0 } } },
      player: { x: 11, y: 10, facing: "S", hp: 10, sp: 10, status: {} },
      npcs: { entities: {} },
      checkpoint: {},
    },
  };
  return {
    getState: () => state,
    tx: (mutator) => {
      const draft = structuredClone(state);
      mutator(draft);
      state = draft;
    },
    replaceState: (next) => {
      state = next;
    },
  };
}

describe("NPCSystem", () => {
  it("snaps NPC to day/night anchors on phase change", () => {
    const bus = new FakeBus();
    const store = makeStore("DAY");
    const system = new NPCSystem(store, bus, new NPCDatabase());
    system.ensureRuntimeEntities();

    system.onPhaseChange("DAY_START");
    expect(store.getState().runtime.npcs.entities.npc_guard.x).toBe(12);

    system.onPhaseChange("NIGHT_START");
    expect(store.getState().runtime.npcs.entities.npc_guard.x).toBe(10);
  });

  it("moves on day waypoints without pathfinding", () => {
    const bus = new FakeBus();
    const store = makeStore("DAY");
    const system = new NPCSystem(store, bus, new NPCDatabase());
    system.ensureRuntimeEntities();
    system.onPhaseChange("DAY_START");

    system.tick(1000);
    const npc = store.getState().runtime.npcs.entities.npc_guard;
    expect([12, 13]).toContain(npc.x);

    system.tick(2000);
    const npc2 = store.getState().runtime.npcs.entities.npc_guard;
    expect(npc2.nextStepAtMs).toBeGreaterThan(0);
  });

  it("blocks at night with low trust and allows with high trust", () => {
    const bus = new FakeBus();
    const store = makeStore("NIGHT");
    const system = new NPCSystem(store, bus, new NPCDatabase());
    system.ensureRuntimeEntities();

    expect(system.npcBlocksTile(store.getState(), "bright_hollow", 9, 10)).toBe(true);
    expect(system.attemptPlayerMove(9, 10)).toBe(false);

    system.setTrust("npc_guard", 50);
    expect(system.npcBlocksTile(store.getState(), "bright_hollow", 9, 10)).toBe(false);
    expect(system.attemptPlayerMove(9, 10)).toBe(true);
  });

  it("interaction selects variant by trust and time", () => {
    const bus = new FakeBus();
    const store = makeStore("NIGHT");
    const system = new NPCSystem(store, bus, new NPCDatabase());
    system.ensureRuntimeEntities();
    system.onPhaseChange("NIGHT_START");

    const lowTrustScene = system.interactAdjacentNPC();
    expect(lowTrustScene).toBe("demo_guard_night_block");

    system.setTrust("npc_guard", 45);
    const highTrustScene = system.interactAdjacentNPC();
    expect(highTrustScene).toBe("demo_guard_night_allow");
  });

  it("trust and fear clamp between 0 and 100", () => {
    const bus = new FakeBus();
    const store = makeStore("DAY");
    const system = new NPCSystem(store, bus, new NPCDatabase());

    system.setTrust("npc_guard", 150);
    expect(system.getTrust(store.getState(), "npc_guard")).toBe(100);
    system.addTrust("npc_guard", -250);
    expect(system.getTrust(store.getState(), "npc_guard")).toBe(0);

    system.setTownFear(120);
    expect(store.getState().story.npc.townFear).toBe(100);
    system.addTownFear(-500);
    expect(store.getState().story.npc.townFear).toBe(0);
  });
});
