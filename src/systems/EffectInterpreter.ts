import { NPCSystem } from "./NPCSystem";

export type DialogueEffect = {
  op: string;
  npcId?: string;
  value?: number;
  key?: string;
  valueAny?: unknown;
};

export class EffectInterpreter {
  constructor(private readonly npcSystem: NPCSystem) {}

  apply(effect: DialogueEffect): void {
    if (effect.op === "npc.trust.delta" && effect.npcId && typeof effect.value === "number") {
      this.npcSystem.addTrust(effect.npcId, effect.value);
    }
  }
}
