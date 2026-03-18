import type { GameState } from "../state/StateTypes";

export type NumericGate = { npcId?: string; value: number };

export type DialogueConditions = {
  timePhaseIn?: string[];
  trustAtLeast?: NumericGate;
  trustAtMost?: NumericGate;
  townFearAtLeast?: { value: number };
  townFearAtMost?: { value: number };
  flagAll?: string[];
};

export type DialogueConditionContext = {
  speakerNpcId?: string;
};

export function evaluateDialogueConditions(
  state: Readonly<GameState>,
  conditions: DialogueConditions | undefined,
  context: DialogueConditionContext = {},
): boolean {
  if (!conditions) return true;

  const phase = String(state.runtime.time.phase ?? "");
  if (conditions.timePhaseIn && !conditions.timePhaseIn.includes(phase)) {
    return false;
  }

  const trustState = state.story.npc?.trust ?? {};

  if (conditions.trustAtLeast) {
    const npcId = conditions.trustAtLeast.npcId ?? context.speakerNpcId;
    if (!npcId) return false;
    if ((trustState[npcId] ?? 0) < conditions.trustAtLeast.value) return false;
  }

  if (conditions.trustAtMost) {
    const npcId = conditions.trustAtMost.npcId ?? context.speakerNpcId;
    if (!npcId) return false;
    if ((trustState[npcId] ?? 0) > conditions.trustAtMost.value) return false;
  }

  const townFear = state.story.npc?.townFear ?? 0;
  if (conditions.townFearAtLeast && townFear < conditions.townFearAtLeast.value) return false;
  if (conditions.townFearAtMost && townFear > conditions.townFearAtMost.value) return false;

  if (conditions.flagAll?.length) {
    const flags = state.story.flags ?? {};
    for (const flag of conditions.flagAll) {
      if (!flags[flag]) return false;
    }
  }

  return true;
}
