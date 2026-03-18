import type React from "react";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
};

export function Card({ as: Component = "section", className, ...props }: CardProps) {
  const classes = ["revamp-card", className].filter(Boolean).join(" ");

  return <Component className={classes} {...props} />;
}
