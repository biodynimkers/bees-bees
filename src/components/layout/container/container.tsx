import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "small" | "medium" | "large" | "full";
  className?: string;
}

export function Container({
  children,
  size = "large",
  className = "",
}: ContainerProps) {
  const sizeClass = `container--${size}`;
  const classes = ["container", sizeClass, className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}
