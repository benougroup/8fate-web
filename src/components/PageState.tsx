import type { CSSProperties, ReactNode } from "react";

import backgroundImage from "@/assets/images/ui/background_001.png";
import Button from "@/components/Button";
import ErrorBox from "@/components/ErrorBox";
import Loader from "@/components/Loader";

type PageLoadingProps = {
  label?: string;
  minHeight?: number | string;
  inline?: boolean;
};

export function PageLoading({ label = "Loading…", minHeight = "60vh", inline = false }: PageLoadingProps) {
  if (inline) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Loader inline label={label} />
      </div>
    );
  }

  return (
    <div
      style={{
        ...centerWrap,
        minHeight,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0B0C2A",
      }}
    >
      <Loader label={label} />
    </div>
  );
}

type PageErrorProps = {
  title?: ReactNode;
  message: ReactNode;
  tone?: "error" | "warning" | "info" | "success";
  retryLabel?: string;
  onRetry?: () => void;
  children?: ReactNode;
  minHeight?: number | string;
};

export function PageError({
  title,
  message,
  tone = "error",
  retryLabel = "Retry",
  onRetry,
  children,
  minHeight = "60vh",
}: PageErrorProps) {
  return (
    <div style={{ ...centerWrap, minHeight }}>
      <div style={stack}>
        <ErrorBox
          tone={tone}
          message={
            <div style={{ display: "grid", gap: 6 }}>
              {title ? <strong style={{ fontSize: 16 }}>{title}</strong> : null}
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{message}</div>
            </div>
          }
        />
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        {children}
      </div>
    </div>
  );
}

const centerWrap: CSSProperties = {
  width: "100%",
  display: "grid",
  placeItems: "center",
  padding: "24px 16px",
};

const stack: CSSProperties = {
  display: "grid",
  gap: 12,
  justifyItems: "center",
  textAlign: "center",
  width: "min(100%, 320px)",
};
