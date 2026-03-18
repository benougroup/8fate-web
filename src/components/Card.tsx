import type { CSSProperties, ReactNode } from "react";

/**
 * Card – shared container used across pages (Dashboard, Portfolio, Details, etc.)
 * - Minimal props to keep it flexible
 * - Optional header (title/subtitle) and footer regions
 * - Light, neutral styling; pages may override via className or style
 */
export type CardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  style?: CSSProperties;
  className?: string;
};


export default function Card({ title, subtitle, children, footer, style, className }: CardProps) {
  return (
    <section className={className} style={{ ...styles.card, ...style }}>
      {(title || subtitle) && (
        <header style={styles.header}>
          {title ? <div style={styles.title}>{title}</div> : null}
          {subtitle ? <div style={styles.subtitle}>{subtitle}</div> : null}
        </header>
      )}
      <div>{children}</div>
      {footer ? <footer style={styles.footer}>{footer}</footer> : null}
    </section>
  );
}


const styles: Record<string, CSSProperties> = {
  card: {
    background: "rgba(29, 35, 47, 0.6)",
    border: "1px solid rgba(247, 216, 148, 0.2)",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(12px)",
    color: "#fff",
  },
  header: { marginBottom: 16 },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#F4D73E",
    textTransform: "uppercase",
  },
  subtitle: { color: "rgba(255, 255, 255, 0.7)", marginTop: 4, fontSize: 13 },
  footer: { marginTop: 16 },
};
