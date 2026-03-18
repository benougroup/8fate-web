import type React from "react";

type HorizontalCardRailProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

type HorizontalCardRailItemProps = {
  title: string;
  description?: string;
  href?: string;
  imageSrc?: string;
  onClick?: () => void;
  className?: string;
};

export function HorizontalCardRail({
  title,
  subtitle,
  children,
  className,
}: HorizontalCardRailProps) {
  const classes = ["revamp-rail", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      {title || subtitle ? (
        <div className="revamp-railHeader">
          {title ? <h3 className="revamp-railTitle">{title}</h3> : null}
          {subtitle ? <p className="revamp-railSubtitle">{subtitle}</p> : null}
        </div>
      ) : null}
      <div className="revamp-railScroll" aria-label={typeof title === "string" ? title : undefined}>
        <div className="revamp-railTrack">{children}</div>
      </div>
    </section>
  );
}

export function HorizontalCardRailItem({
  title,
  description,
  href,
  imageSrc,
  onClick,
  className,
}: HorizontalCardRailItemProps) {
  const classes = ["revamp-railItem", className].filter(Boolean).join(" ");
  const content = (
    <>
      {imageSrc ? (
        <img className="revamp-railItemImage" src={imageSrc} alt={title} />
      ) : (
        <div className="revamp-railItemImage revamp-railItemImage--placeholder" aria-hidden="true" />
      )}
      <div className="revamp-railItemBody">
        <h4 className="revamp-railItemTitle">{title}</h4>
        {description ? <p className="revamp-railItemDescription">{description}</p> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button className={classes} type="button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
