import type React from "react";

type SectionCardProps = React.HTMLAttributes<HTMLElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  as?: "section" | "div";
};

export function SectionCard({
  title,
  subtitle,
  as: Component = "section",
  className,
  children,
  ...props
}: SectionCardProps) {
  const classes = ["revamp-sectionCard", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {title || subtitle ? (
        <div className="revamp-sectionCardHeader">
          {title ? <h2 className="revamp-sectionCardTitle">{title}</h2> : null}
          {subtitle ? <p className="revamp-sectionCardSubtitle">{subtitle}</p> : null}
        </div>
      ) : null}
      {children ? <div className="revamp-sectionCardBody">{children}</div> : null}
    </Component>
  );
}
