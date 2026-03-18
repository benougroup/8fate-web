import type React from "react";
import { Card } from "./Card";

type PageCardProps = React.ComponentProps<typeof Card>;

export function PageCard({ className, ...props }: PageCardProps) {
  // NOTE:
  // PageCard is the ONLY glass surface.
  // All depth, blur, and shadow must live here.
  const classes = ["revamp-container", className].filter(Boolean).join(" ");

  return <Card className={classes} {...props} />;
}
