import type React from "react";

const gapClasses = {
  xs: "rv-stack--xs",
  sm: "rv-stack--sm",
  md: "rv-stack--md",
  lg: "rv-stack--lg",
} as const;

const alignClasses = {
  start: "rv-stack--start",
  center: "rv-stack--center",
  stretch: "rv-stack--stretch",
} as const;

type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: keyof typeof gapClasses;
  align?: keyof typeof alignClasses;
};

export function Stack({
  gap = "md",
  align = "stretch",
  className,
  ...props
}: StackProps) {
  const classes = ["rv-stack", gapClasses[gap], alignClasses[align], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
