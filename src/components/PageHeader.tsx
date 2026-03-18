import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";


/**
 * PageHeader – standard top bar with back button, title, and optional actions.
 * - Back can be a route path or -1 (history back).
 */
export type PageHeaderProps = {
  title: ReactNode;
  backTo?: string | number;
  actions?: ReactNode;
  sticky?: boolean;
  style?: CSSProperties;
  className?: string;
};


export default function PageHeader({ title, backTo, actions, sticky, style, className }: PageHeaderProps) {
  const navigate = useNavigate();


  function onBack() {
    if (typeof backTo === "number") navigate(backTo);
    else if (typeof backTo === "string") navigate(backTo);
    else navigate(-1);
  }


  return (
    <header
      className={className}
      style={{
        ...root,
        ...(sticky ? stickyStyle : null),
        ...style,
      }}
    >
      {backTo !== undefined && (
        <Button variant="pill" onClick={onBack}>
          ←
        </Button>
      )}
      <div style={titleWrap}>{title}</div>
      <div style={{ display: "flex", gap: 8 }}>{actions}</div>
    </header>
  );
}


const root: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 18px",
  borderBottom: "1px solid rgba(247, 216, 148, 0.18)",
  background: "rgba(7, 12, 28, 0.85)",
  backdropFilter: "blur(14px)",
  color: "#f8edd4",
  zIndex: 5,
};


const stickyStyle: CSSProperties = {
  position: "sticky",
  top: 0,
};


const titleWrap: CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 700,
  letterSpacing: 0.3,
};