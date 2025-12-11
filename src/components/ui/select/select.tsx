import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = "Selecteer een optie",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <div className="select-group">
        {label && (
          <label htmlFor={selectId} className="select-label">
            {label}
            {props.required && <span className="select-required">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`select ${hasError ? "select--error" : ""} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <span className="select-error-message">{error}</span>}
        {helperText && !error && (
          <span className="select-helper-text">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
