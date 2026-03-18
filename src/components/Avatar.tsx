import type { CSSProperties } from "react";

export type AvatarProps = {
  name?: string;
  size?: number;
  imageUrl?: string;
};

const DEFAULT_SIZE = 32;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
}

export default function Avatar({ name, size = DEFAULT_SIZE, imageUrl }: AvatarProps) {
  const trimmedName = name?.trim() ?? "";
  const initials = trimmedName ? getInitials(trimmedName) : "";
  const dimension = Math.max(size, 24);

  const baseStyle: CSSProperties = {
    width: dimension,
    height: dimension,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(244, 215, 62, 0.4)",
    color: "#F4D73E",
    fontWeight: 700,
    fontSize: Math.max(12, Math.floor(dimension * 0.4)),
    letterSpacing: 0.5,
    flexShrink: 0,
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={trimmedName ? `${trimmedName} avatar` : "User avatar"}
        style={{
          ...baseStyle,
          objectFit: "cover",
          background: "rgba(0, 0, 0, 0.25)",
          border: "2px solid rgba(244, 215, 62, 0.8)",
        }}
      />
    );
  }

  if (initials) {
    return <div style={baseStyle}>{initials}</div>;
  }

  return (
    <div style={baseStyle} aria-hidden="true">
      <svg
        width={Math.floor(dimension * 0.55)}
        height={Math.floor(dimension * 0.55)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.867 0-7 3.133-7 7h2c0-2.761 2.239-5 5-5s5 2.239 5 5h2c0-3.867-3.133-7-7-7Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
