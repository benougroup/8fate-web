type ImageExtension = "png" | "webp" | "jpg" | "jpeg" | "svg";

const catalog = import.meta.glob("@/assets/images/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const normalizedCatalog = new Map<string, string>();

const GENERIC_FALLBACK = "ui/icon_help.png";
const DESTINY_FALLBACK = "general icons/destiny_icon.png";

const EXTENSIONS: ImageExtension[] = ["png", "webp", "jpg", "jpeg", "svg"];

function normalizeSegment(segment: string) {
  return segment
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, " ");
}

function normalizePath(input: string) {
  return input
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .map((segment) => normalizeSegment(segment))
    .join("/");
}

for (const [key, value] of Object.entries(catalog)) {
  const marker = "/assets/images/";
  const index = key.toLowerCase().lastIndexOf(marker);
  if (index === -1) continue;
  const relativePath = key.slice(index + marker.length);
  normalizedCatalog.set(normalizePath(relativePath), value);
}

function getFromCatalog(relativePath: string) {
  return normalizedCatalog.get(normalizePath(relativePath));
}

export function resolveImage(relativePath: string): string {
  return getFromCatalog(relativePath) || getFromCatalog(GENERIC_FALLBACK) || "";
}

export function resolveByFolderName(folder: string, name: string, ext?: ImageExtension): string {
  const normalizedFolder = normalizePath(folder);
  const normalizedName = normalizeSegment(name);
  const destinyFolder = normalizePath("destiny icons");

  const matchWithExtension = (extension: ImageExtension) =>
    getFromCatalog(`${normalizedFolder}/${normalizedName}.${extension}`);

  const directMatch = ext ? matchWithExtension(ext) : undefined;
  if (directMatch) return directMatch;

  if (!ext) {
    for (const extension of EXTENSIONS) {
      const match = matchWithExtension(extension);
      if (match) return match;
    }
  }

  if (import.meta.env.DEV) {
    console.warn("Missing image:", folder, name);
  }

  if (normalizedFolder === destinyFolder) {
    return resolveImage(DESTINY_FALLBACK);
  }

  return resolveImage(GENERIC_FALLBACK);
}
