type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "var(--color-text)",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  },
  danger: {
    backgroundColor: "var(--color-danger)",
    color: "var(--color-text)",
    border: "none",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-text-muted)",
    border: "1px solid transparent",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "var(--space-xs) var(--space-sm)",
    fontSize: "var(--font-size-sm)",
  },
  md: {
    padding: "var(--space-sm) var(--space-lg)",
    fontSize: "var(--font-size-base)",
  },
  lg: {
    padding: "var(--space-md) var(--space-xl)",
    fontSize: "var(--font-size-lg)",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  children,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-xs)",
        fontFamily: "inherit",
        fontWeight: "var(--font-weight-medium)",
        borderRadius: "var(--radius-md)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "background-color var(--transition-fast), opacity var(--transition-fast)",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

function Spinner({ size }: { size: "sm" }) {
  const dim = size === "sm" ? "0.875rem" : "1rem";
  return (
    <span
      style={{
        width: dim,
        height: dim,
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        borderRadius: "var(--radius-full)",
        display: "inline-block",
        animation: "btn-spin 0.6s linear infinite",
      }}
    />
  );
}
