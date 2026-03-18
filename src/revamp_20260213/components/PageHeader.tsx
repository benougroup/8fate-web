import type React from "react";
import { Text } from "./Text";

type PageHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  help?: React.ReactNode;
  as?: "header" | "div";
};

export function PageHeader({
  title,
  subtitle,
  icon,
  help,
  as = "header",
  className,
  ...props
}: PageHeaderProps) {
  const Component = as;
  const classes = ["revamp-header", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      <div className="revamp-headerRow">
        {icon ? <span className="revamp-headerIcon">{icon}</span> : null}
        <h1 className="revamp-headerTitle">{title}</h1>
        {help ? <span className="revamp-headerHelp">{help}</span> : null}
      </div>
      {subtitle ? <Text muted>{subtitle}</Text> : null}
    </Component>
  );
}
