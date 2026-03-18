import type React from "react";

type SectionTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function SectionTitle({ className, ...props }: SectionTitleProps) {
  const classes = ["revamp-sectionTitle", className].filter(Boolean).join(" ");

  return <h2 className={classes} {...props} />;
}
