import type React from "react";
import { SectionTitle } from "./SectionTitle";
import { Stack } from "./Stack";

type PageSectionProps = {
  title?: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

export function PageSection({
  title,
  gap = "md",
  className,
  children,
}: PageSectionProps) {
  const classes = ["revamp-section", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      <Stack gap={gap} align="stretch">
        {title ? <SectionTitle>{title}</SectionTitle> : null}
        {children}
      </Stack>
    </section>
  );
}
