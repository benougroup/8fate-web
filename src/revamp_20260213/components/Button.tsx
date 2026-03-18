import type React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "contrast" | "danger";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  pill = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "revamp-button",
    `revamp-button--${variant}`,
    `revamp-button--${size}`,
    pill ? "revamp-button--pill" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
