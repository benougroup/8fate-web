import type React from "react";

type TopBarProps = React.HTMLAttributes<HTMLDivElement> & {
  left: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
};

export function TopBar({ left, center, right, className, ...props }: TopBarProps) {
  const classes = ["revamp-topBar", className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      <div className="revamp-topBarLeft">{left}</div>
      {center ? <div className="revamp-topBarCenter">{center}</div> : null}
      {right ? <div className="revamp-topBarActions">{right}</div> : null}
    </div>
  );
}
