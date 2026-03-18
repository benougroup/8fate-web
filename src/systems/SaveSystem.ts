import { migrateSaveFile } from "../state/Migrations";
import { isStableForSave } from "../app/Stability";
import {
  CURRENT_SAVE_VERSION,
  LUMENFALL_SAVE_BACKUP,
  LUMENFALL_SAVE_MAIN,
  LUMENFALL_SAVE_TEMP,
  type EventBus,
  type GameState,
  type ModeMachine,
  type SaveFile,
  type StateStore,
} from "../state/SaveTypes";

const AUTOSAVE_DEBOUNCE_MS = 500;
const BACKUP_ROTATION_INTERVAL = 5;
const BLOCKED_MODES = new Set(["MAP_TRANSITION", "FAINTING", "LOADING"]);
const STORY_START_MAP_ID = "bright_hollow";

export class SaveSystem {
  private dirty = false;
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingAutosave = false;
  private saveCount = 0;
  private isRestoring = false;

  constructor(
    private readonly store: StateStore,
    private readonly bus: EventBus,
    private readonly modeMachine: ModeMachine,
  ) {
    this.wireAutosaveEvents();
    this.wireDevHotkeys();
  }

  markDirty(_reason: string): void {
    this.dirty = true;
    this.store.tx((draft) => {
      draft.runtime.save = { ...(draft.runtime.save ?? {}), dirty: true };
    });
  }

  requestAutosave(reason: string): void {
    this.markDirty(reason);
    if (!this.isSaveStable()) {
      this.pendingAutosave = true;
      this.cancelAutosaveTimer();
      return;
    }

    this.cancelAutosaveTimer();

    this.autosaveTimer = setTimeout(() => {
      this.autosaveTimer = null;
      if (!this.isSaveStable()) {
        this.pendingAutosave = true;
        return;
      }
      const result = this.saveNow(`autosave:${reason}`);
      if (!result.ok) {
        this.bus.emit("UI_MESSAGE", { text: `Save failed: ${result.error ?? "unknown"}` });
      }
    }, AUTOSAVE_DEBOUNCE_MS);
  }

  saveNow(_reason: string): { ok: boolean; error?: string } {
    try {
      if (this.isRestoring || !this.isSaveStable()) {
        return { ok: false, error: "Save blocked during restore/transition" };
      }

      const json = JSON.stringify(this.buildSaveFile(this.store.getState()));
      localStorage.setItem(LUMENFALL_SAVE_TEMP, json);

      const roundTrip = JSON.parse(localStorage.getItem(LUMENFALL_SAVE_TEMP) ?? "null") as Partial<SaveFile>;
      if (!roundTrip || typeof roundTrip.saveVersion !== "number" || !roundTrip.global || !roundTrip.story || !roundTrip.runtime) {
        return { ok: false, error: "Round-trip validation failed" };
      }

      localStorage.setItem(LUMENFALL_SAVE_MAIN, json);
      this.saveCount += 1;
      if (this.saveCount % BACKUP_ROTATION_INTERVAL === 0) {
        localStorage.setItem(LUMENFALL_SAVE_BACKUP, json);
      }

      this.dirty = false;
      this.store.tx((draft) => {
        draft.runtime.save = { ...(draft.runtime.save ?? {}), dirty: false };
        draft.runtime.checkpoint = { ...(draft.runtime.checkpoint ?? {}), dirty: false };
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  loadNow(): { ok: boolean; error?: string } {
    this.isRestoring = true;
    try {
      const fromMain = this.readSave(LUMENFALL_SAVE_MAIN);
      const loaded = fromMain ?? this.readSave(LUMENFALL_SAVE_BACKUP);
      if (!loaded) {
        const initial = this.store.createInitialState?.();
        if (initial) {
          this.store.replaceState(initial);
        }
        return { ok: false, error: "No valid save found" };
      }

      const migrated = migrateSaveFile(loaded);
      const rebuilt = this.buildStateFromSave(migrated, this.store.getState());
      this.store.replaceState(rebuilt);
      this.bus.emit("UI_MESSAGE", { text: "Loaded." });
      return { ok: true };
    } catch (error) {
      const initial = this.store.createInitialState?.();
      if (initial) {
        this.store.replaceState(initial);
      }
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
      this.isRestoring = false;
    }
  }

  newGame(): void {
    localStorage.removeItem(LUMENFALL_SAVE_TEMP);
    localStorage.removeItem(LUMENFALL_SAVE_MAIN);
    localStorage.removeItem(LUMENFALL_SAVE_BACKUP);
    const initial = this.store.createInitialState?.();
    if (initial) {
      this.store.replaceState(initial);
    }
  }

  newStory(newStoryId: string): void {
    this.store.tx((draft) => {
      draft.story = {
        ...draft.story,
        activeStoryId: newStoryId,
        stage: {},
        flags: {},
        npc: { townFear: 0, trust: {}, npcFlags: {} },
        storyInventory: {},
        storyShadow: {},
      };

      draft.runtime.mode = "EXPLORE";
      draft.runtime.map = {
        ...draft.runtime.map,
        currentMapId: STORY_START_MAP_ID,
        mapsVisited: {
          ...draft.runtime.map.mapsVisited,
          [STORY_START_MAP_ID]: { lastX: 0, lastY: 0 },
        },
        transition: undefined,
      };
      draft.runtime.player = {
        ...draft.runtime.player,
        x: 0,
        y: 0,
      };
      draft.runtime.npcs = {
        entities: {},
      };
      draft.runtime.checkpoint = {
        ...draft.runtime.checkpoint,
        dirty: true,
      };
      draft.runtime.shadows = {
        ...(draft.runtime.shadows ?? {}),
        env: {},
      };
      draft.runtime.dialogue = { isOpen: false };
      draft.runtime.crafting = { isOpen: false };
      draft.runtime.inventoryUI = { isOpen: false };
    });

    this.markDirty("new_story");
    this.saveNow("new_story_force");
  }

  private readSave(key: string): SaveFile | null {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SaveFile;
    } catch {
      return null;
    }
  }

  private buildSaveFile(state: Readonly<GameState>): SaveFile {
    const now = Date.now();
    const createdAtMs = this.readSave(LUMENFALL_SAVE_MAIN)?.createdAtMs ?? now;

    return {
      saveVersion: CURRENT_SAVE_VERSION,
      createdAtMs,
      updatedAtMs: now,
      global: state.global,
      story: state.story,
      runtime: {
        time: state.runtime.time,
        map: {
          currentMapId: state.runtime.map.currentMapId,
          mapsVisited: state.runtime.map.mapsVisited,
        },
        player: {
          x: state.runtime.player.x,
          y: state.runtime.player.y,
          facing: state.runtime.player.facing,
          hp: state.runtime.player.hp,
          sp: state.runtime.player.sp,
          status: state.runtime.player.status,
        },
        checkpoint: state.runtime.checkpoint,
        npcs: state.runtime.npcs,
      },
    };
  }

  private buildStateFromSave(save: SaveFile, fallback: Readonly<GameState>): GameState {
    const next: GameState = {
      ...fallback,
      global: save.global,
      story: save.story,
      runtime: {
        ...fallback.runtime,
        mode: "EXPLORE",
        time: save.runtime.time,
        map: {
          ...fallback.runtime.map,
          currentMapId: save.runtime.map.currentMapId,
          mapsVisited: save.runtime.map.mapsVisited,
          transition: undefined,
        },
        player: {
          ...fallback.runtime.player,
          ...save.runtime.player,
        },
        checkpoint: {
          ...save.runtime.checkpoint,
          dirty: false,
        },
        npcs: save.runtime.npcs ?? fallback.runtime.npcs ?? { entities: {} },
        save: { ...(fallback.runtime.save ?? {}), dirty: false },
        dialogue: { isOpen: false },
        crafting: { isOpen: false },
        inventoryUI: { isOpen: false },
        shadows: {
          ...(fallback.runtime.shadows ?? {}),
          env: {},
        },
      },
    };

    return next;
  }

  private wireAutosaveEvents(): void {
    this.bus.on("CHECKPOINT_CREATED", () => this.requestAutosave("checkpoint"));
    this.bus.on("CHECKPOINT_SNAPSHOT", () => this.requestAutosave("checkpoint"));
    this.bus.on("CRAFT_SUCCESS", () => this.requestAutosave("craft"));
    this.bus.on("STORY_FLAGS_CHANGED", () => this.requestAutosave("flags"));
    this.bus.on("TIME_PHASE_CHANGED", (payload) => {
      const phase = (payload as { phase?: string } | undefined)?.phase;
      if (phase === "DAWN_START") {
        this.requestAutosave("dawn");
      }
    });
    this.bus.on("MODE_CHANGED", () => {
      if (this.isSaveStable() && this.pendingAutosave) {
        this.pendingAutosave = false;
        this.requestAutosave("mode_recovered");
      }
    });

    this.bus.on("DIALOGUE_CLOSED", () => {
      if (this.pendingAutosave && this.isSaveStable()) {
        this.pendingAutosave = false;
        this.requestAutosave("dialogue_closed");
      }
    });
  }

  private wireDevHotkeys(): void {
    if (typeof window === "undefined") {
      return;
    }
    window.addEventListener("keydown", (event) => {
      if (event.repeat) {
        return;
      }
      const key = event.key.toUpperCase();
      if (key === "O") {
        this.saveNow("manual_hotkey");
      } else if (key === "L") {
        this.loadNow();
      } else if (key === "N") {
        this.newGame();
      } else if (key === "R") {
        const storyId = this.store.getState().story.activeStoryId ?? "story_default";
        this.newStory(storyId);
      }
    });
  }

  private isModeBlocked(): boolean {
    return BLOCKED_MODES.has(this.modeMachine.getMode());
  }

  private isSaveStable(): boolean {
    if (this.isModeBlocked()) {
      return false;
    }
    return isStableForSave(this.store.getState());
  }

  private cancelAutosaveTimer(): void {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }
}
