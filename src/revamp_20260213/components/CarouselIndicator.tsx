import * as React from "react";

type CarouselIndicatorProps = {
  count: number;
  activeIndex: number;
  onSelect?: (index: number) => void;
  getAriaLabel?: (index: number) => string;
  className?: string;
};

export function CarouselIndicator({
  count,
  activeIndex,
  onSelect,
  getAriaLabel,
  className,
}: CarouselIndicatorProps) {
  const classes = ["revamp-carouselIndicator", className].filter(Boolean).join(" ");

  if (count <= 1) {
    return <div className={classes} />;
  }

  return (
    <div className={classes}>
      <span className="revamp-carouselIndicatorBar" aria-hidden="true" />
      <div className="revamp-carouselIndicatorDots">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={`carousel-dot-${index}`}
            type="button"
            className={[
              "revamp-carouselIndicatorDot",
              index === activeIndex ? "is-active" : null,
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={getAriaLabel?.(index) ?? `Go to slide ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => onSelect?.(index)}
          />
        ))}
      </div>
    </div>
  );
}
