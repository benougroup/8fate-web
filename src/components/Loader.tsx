import React from "react";

import logo from "@/assets/images/ui/logo.png";

/**
 * Loader – standardized loading indicator anchored on the brand spinner.
 */
export type LoaderProps = {
  label?: string;
  inline?: boolean;
  style?: React.CSSProperties;
  className?: string;
};


export default function Loader({ label = "Wait...", inline = false, style, className }: LoaderProps) {
  return (
    <div
      role="status"
      className={className}
      style={{
        display: inline ? "inline-flex" : "flex",
        flexDirection: inline ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 20,
        minHeight: inline ? undefined : "50vh",
        ...style,
      }}
    >
      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        .brand-spinner {
          animation: spin 2s linear infinite;
          object-fit: contain;
        }
      `}</style>
      <img
        src={logo}
        alt="Loading"
        className="brand-spinner"
        style={{
          width: inline ? 24 : 64,
          height: inline ? 24 : 64,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 14,
            color: "rgba(252, 233, 199, 0.8)",
            letterSpacing: 0.5,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
