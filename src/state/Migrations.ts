import { CURRENT_SAVE_VERSION, type SaveFile } from "./SaveTypes";

function isBasicSaveShape(input: unknown): input is SaveFile {
  if (!input || typeof input !== "object") {
    return false;
  }
  const maybe = input as Partial<SaveFile>;
  return Boolean(
    typeof maybe.saveVersion === "number" &&
      maybe.global &&
      maybe.story &&
      maybe.runtime &&
      maybe.runtime.map &&
      maybe.runtime.player,
  );
}

const migrations: Record<number, (save: SaveFile) => SaveFile> = {
  1: (save) => save,
};

export function migrateSaveFile(input: unknown): SaveFile {
  if (!isBasicSaveShape(input)) {
    throw new Error("Invalid save shape");
  }

  if (input.saveVersion < 1) {
    throw new Error("Unsupported save version");
  }

  let current = input;
  while (current.saveVersion < CURRENT_SAVE_VERSION) {
    const migrate = migrations[current.saveVersion + 1];
    if (!migrate) {
      throw new Error(`Missing migration for v${current.saveVersion + 1}`);
    }
    current = migrate({ ...current, saveVersion: current.saveVersion + 1 });
  }

  return current;
}
