import type { CSSProperties, RefObject } from "react";
import { useEffect, useState } from "react";

export type ScrollDotsProps = {
  count: number;
  scrollRef: RefObject<HTMLElement>;
  className?: string;
  style?: CSSProperties;
};

export default function ScrollDots({ count, scrollRef, className, style }: ScrollDotsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || count <= 1) return;

    const updateActiveIndex = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        setActiveIndex(0);
        return;
      }

      const ratio = container.scrollLeft / maxScroll;
      const nextIndex = Math.round(ratio * (count - 1));
      setActiveIndex(Math.max(0, Math.min(count - 1, nextIndex)));
    };

    updateActiveIndex();
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      container.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [count, scrollRef]);

  if (count <= 1) return null;

  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      <div style={barStyle} />
      <div style={dotsStyle}>
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            style={{
              ...dotStyle,
              ...(index === activeIndex ? activeDotStyle : inactiveDotStyle),
            }}
          />
        ))}
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 6,
};

const barStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  height: 4,
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.15)",
};

const dotsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "0 6px",
  zIndex: 1,
};

const dotStyle: CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  transition: "background 0.2s ease",
};

const activeDotStyle: CSSProperties = {
  background: "rgba(255, 255, 255, 0.85)",
};

const inactiveDotStyle: CSSProperties = {
  background: "rgba(255, 255, 255, 0.35)",
};
