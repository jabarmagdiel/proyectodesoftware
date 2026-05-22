type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    color: "var(--color-success)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
  },
  warning: {
    backgroundColor: "rgba(234, 179, 8, 0.15)",
    color: "#eab308",
    border: "1px solid rgba(234, 179, 8, 0.3)",
  },
  danger: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "var(--color-danger)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  info: {
    backgroundColor: "rgba(79, 70, 229, 0.15)",
    color: "var(--color-primary)",
    border: "1px solid rgba(79, 70, 229, 0.3)",
  },
  neutral: {
    backgroundColor: "var(--color-surface-hover)",
    color: "var(--color-text-muted)",
    border: "1px solid var(--color-border)",
  },
};

export default function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "var(--space-xs) var(--space-sm)",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: 1,
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
