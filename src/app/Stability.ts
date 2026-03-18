import type { GameState } from "../state/StateTypes";

function isModalOpen(state: Readonly<GameState>): boolean {
  return Boolean(state.runtime.dialogue?.isOpen || state.runtime.crafting?.isOpen || state.runtime.inventoryUI?.isOpen);
}

function isMapTransitioning(state: Readonly<GameState>): boolean {
  return state.runtime.mode === "MAP_TRANSITION" || Boolean(state.runtime.map.transition);
}

function isFainting(state: Readonly<GameState>): boolean {
  const faintingRuntime = state.runtime.fainting as { active?: boolean } | undefined;
  return state.runtime.mode === "FAINTING" || Boolean(faintingRuntime?.active);
}

export function isStableForSave(state: Readonly<GameState>): boolean {
  return state.runtime.mode === "EXPLORE" && !isMapTransitioning(state) && !isFainting(state) && !isModalOpen(state);
}

export function isStableForNewMode(state: Readonly<GameState>): boolean {
  return !isMapTransitioning(state) && !isFainting(state);
}

export function shouldProcessTriggers(state: Readonly<GameState>): boolean {
  return state.runtime.mode === "EXPLORE" && isStableForNewMode(state) && !isModalOpen(state);
}

export function shouldAdvanceTime(state: Readonly<GameState>): boolean {
  return state.runtime.mode === "EXPLORE" && !isMapTransitioning(state) && !isFainting(state);
}
