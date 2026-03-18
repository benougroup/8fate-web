import type React from "react";

type HelpCircleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function HelpCircle({
  className,
  type = "button",
  "aria-label": ariaLabel = "Help",
  ...props
}: HelpCircleProps) {
  const classes = ["revamp-helpCircle", className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} aria-label={ariaLabel} {...props}>
      ?
    </button>
  );
}
