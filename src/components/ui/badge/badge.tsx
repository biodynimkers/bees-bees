import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "medium",
  className = "",
}: BadgeProps) {
  const variantClass = `badge--${variant}`;
  const sizeClass = `badge--${size}`;
  const classes = ["badge", variantClass, sizeClass, className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
