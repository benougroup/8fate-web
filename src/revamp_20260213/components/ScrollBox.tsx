import type React from "react";

export function ScrollBox({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = ["revamp-scrollBox", className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}
