import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  onClose?: () => void;
  className?: string;
}

export function Alert({
  children,
  variant = "info",
  onClose,
  className = "",
}: AlertProps) {
  const variantClass = `alert--${variant}`;
  const classes = ["alert", variantClass, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="alert">
      <div className="alert-content">{children}</div>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Sluit melding"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
}
