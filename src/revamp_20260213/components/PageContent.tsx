import type React from "react";

export function PageContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = ["revamp-content", className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}
