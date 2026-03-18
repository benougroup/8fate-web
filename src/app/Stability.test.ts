// @ts-nocheck
import { describe, expect, it } from "vitest";
import { isStableForNewMode, isStableForSave, shouldAdvanceTime, shouldProcessTriggers } from "./Stability";

function makeState(overrides = {}) {
  return {
    global: {},
    story: { npc: { townFear: 0, trust: {}, npcFlags: {} } },
    runtime: {
      mode: "EXPLORE",
      time: { phase: "DAY" },
      map: { currentMapId: "map-1", mapsVisited: {}, transition: undefined },
      player: { x: 0, y: 0, facing: "S", hp: 10, sp: 10, status: {} },
      checkpoint: {},
      dialogue: { isOpen: false },
      crafting: { isOpen: false },
      inventoryUI: { isOpen: false },
      ...overrides,
    },
  };
}

describe("Stability", () => {
  it("blocks trigger processing during map transition or fainting", () => {
    expect(shouldProcessTriggers(makeState({ mode: "MAP_TRANSITION", map: { currentMapId: "m", mapsVisited: {}, transition: { to: "n" } } }))).toBe(false);
    expect(shouldProcessTriggers(makeState({ mode: "FAINTING" }))).toBe(false);
  });

  it("requires explore + no modals for save stability", () => {
    expect(isStableForSave(makeState())).toBe(true);
    expect(isStableForSave(makeState({ dialogue: { isOpen: true } }))).toBe(false);
    expect(isStableForSave(makeState({ inventoryUI: { isOpen: true } }))).toBe(false);
  });

  it("prevents new mode start while transition active", () => {
    expect(isStableForNewMode(makeState())).toBe(true);
    expect(isStableForNewMode(makeState({ map: { currentMapId: "m", mapsVisited: {}, transition: { to: "n" } } }))).toBe(false);
  });

  it("advances time only in stable explore", () => {
    expect(shouldAdvanceTime(makeState())).toBe(true);
    expect(shouldAdvanceTime(makeState({ mode: "MAP_TRANSITION" }))).toBe(false);
  });
});
