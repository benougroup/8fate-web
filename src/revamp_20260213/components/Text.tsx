import type React from "react";

type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
};

export function Text({ muted = false, className, ...props }: TextProps) {
  const classes = [muted ? "revamp-muted" : null, className]
    .filter(Boolean)
    .join(" ");

  return <p className={classes} {...props} />;
}
