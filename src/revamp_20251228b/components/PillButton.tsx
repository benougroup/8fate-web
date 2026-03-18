import type React from "react";
import { Link } from "react-router-dom";

type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type PillLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

export function PillButton({ className, type = "button", ...props }: PillButtonProps) {
  const classes = ["revamp-linkPill", className].filter(Boolean).join(" ");

  return <button type={type} className={classes} {...props} />;
}

export function PillLink({ className, ...props }: PillLinkProps) {
  const classes = ["revamp-linkPill", className].filter(Boolean).join(" ");

  return <Link className={classes} {...props} />;
}
