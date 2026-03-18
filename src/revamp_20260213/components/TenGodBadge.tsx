import type React from "react";

type TenGodBadgeProps = {
  tenGod: string;
  className?: string;
};

export function TenGodBadge({ tenGod, className }: TenGodBadgeProps) {
  const classes = ["revamp-tenGodBadge", className].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      {tenGod}
    </span>
  );
}
