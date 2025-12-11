import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger" | "link";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseClasses = "button";
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const widthClass = fullWidth ? "button--full-width" : "";

  const classes = [baseClasses, variantClass, sizeClass, widthClass, className]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
