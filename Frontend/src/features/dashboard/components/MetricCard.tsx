type MetricCardVariant = "primary" | "success" | "warning" | "info" | "danger" | "neutral";

type MetricCardProps = {
  label: string;
  value: number | string;
  subtitle?: string;
  variant?: MetricCardVariant;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

const variantColor: Record<MetricCardVariant, string> = {
  primary: "var(--color-primary)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  info: "var(--color-info)",
  danger: "var(--color-danger)",
  neutral: "var(--color-text-muted)",
};

export default function MetricCard({
  label,
  value,
  subtitle,
  variant = "neutral",
  icon,
  isLoading = false,
}: MetricCardProps) {
  const accent = variantColor[variant];

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        borderTop: `4px solid ${accent}`,
        padding: "var(--space-lg)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-sm)",
      }}
    >
      {icon && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}
        >
          {icon}
        </div>
      )}

      <div>
        <p
          style={{
            fontSize: "var(--font-size-3xl, 2rem)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text)",
            lineHeight: 1,
            marginBottom: "var(--space-xs)",
          }}
        >
          {isLoading ? "—" : value}
        </p>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          {label}
        </p>
        {!isLoading && subtitle && (
          <p
            style={{
              fontSize: "var(--font-size-xs, 0.75rem)",
              color: accent,
              marginTop: "var(--space-xs)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
