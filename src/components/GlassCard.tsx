import React from "react";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function GlassCard({ children, className, ...rest }: GlassCardProps) {
  return (
    <div className={className ?? "glass-card"} {...rest}>
      <style>{`
        .glass-card {
          background: rgba(29, 35, 47, 0.7);
          border: 1px solid rgba(70, 98, 112, 0.3);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(12px);
        }
      `}</style>
      {children}
    </div>
  );
}
