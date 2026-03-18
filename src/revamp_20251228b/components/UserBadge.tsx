type UserBadgeProps = {
  name?: string;
  className?: string;
};

export function UserBadge({ name, className }: UserBadgeProps) {
  const trimmedName = name?.trim() ?? "";
  const initial = trimmedName ? trimmedName[0].toUpperCase() : "?";
  const classes = ["revamp-userBadge", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-label={trimmedName ? `${trimmedName} badge` : "User badge"}>
      {initial}
    </span>
  );
}
