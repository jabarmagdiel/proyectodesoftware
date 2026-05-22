type InputVariant = "default" | "error";

type InputProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  variant?: InputVariant;
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  placeholder,
  error,
  variant = "default",
  id,
  name,
  type = "text",
  value,
  disabled = false,
  autoComplete,
  onChange,
  onBlur,
}: InputProps) {
  const hasError = variant === "error" || Boolean(error);
  const inputId = id ?? name;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-muted)",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={onChange}
        onBlur={onBlur}
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
          border: `1px solid ${hasError ? "var(--color-danger)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          padding: "var(--space-sm) var(--space-md)",
          fontSize: "var(--font-size-base)",
          fontFamily: "inherit",
          outline: "none",
          width: "100%",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "text",
          transition: "border-color var(--transition-fast)",
        }}
      />
      {error && (
        <span
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-danger)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
