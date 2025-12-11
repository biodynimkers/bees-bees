import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  variant?: "default" | "alt" | "dark";
  spacing?: "small" | "medium" | "large";
}

export function Section({
  children,
  variant = "default",
  spacing = "medium",
}: SectionProps) {
  const classes = ["section", `section-${variant}`, `section-${spacing}`].join(
    " "
  );

  return <section className={classes}>{children}</section>;
}
