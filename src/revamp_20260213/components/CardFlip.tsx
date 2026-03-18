import * as React from "react";

type CardFlipProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped?: boolean;
  defaultFlipped?: boolean;
  onFlipChange?: (next: boolean) => void;
  flipOnClick?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function CardFlip({
  front,
  back,
  isFlipped,
  defaultFlipped = false,
  onFlipChange,
  flipOnClick = true,
  ariaLabel,
  className,
}: CardFlipProps) {
  const [uncontrolledFlipped, setUncontrolledFlipped] = React.useState(defaultFlipped);
  const isControlled = typeof isFlipped === "boolean";
  const flipped = isControlled ? isFlipped : uncontrolledFlipped;

  const setFlipped = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledFlipped(next);
      }
      onFlipChange?.(next);
    },
    [isControlled, onFlipChange]
  );

  const handleToggle = React.useCallback(() => {
    setFlipped(!flipped);
  }, [flipped, setFlipped]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!flipOnClick) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle();
      }
    },
    [flipOnClick, handleToggle]
  );

  const classes = [
    "revamp-cardFlip",
    flipOnClick ? "revamp-cardFlip--clickable" : null,
    flipped ? "revamp-cardFlip--flipped" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const interactiveProps = flipOnClick
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-pressed": flipped,
        onClick: handleToggle,
        onKeyDown: handleKeyDown,
        "aria-label": ariaLabel,
      }
    : {};

  return (
    <div className={classes} {...interactiveProps}>
      <div className="revamp-cardFlipInner">
        <div className="revamp-cardFlipFace revamp-cardFlipFront">{front}</div>
        <div className="revamp-cardFlipFace revamp-cardFlipBack">{back}</div>
      </div>
    </div>
  );
}
