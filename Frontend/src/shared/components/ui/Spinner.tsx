type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
};

const sizeMap: Record<SpinnerSize, string> = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2.5rem",
};

const borderMap: Record<SpinnerSize, string> = {
  sm: "2px",
  md: "2px",
  lg: "3px",
};

export default function Spinner({ size = "md" }: SpinnerProps) {
  const dim = sizeMap[size];
  const border = borderMap[size];

  return (
    <span
      role="status"
      aria-label="Cargando"
      style={{
        display: "inline-block",
        width: dim,
        height: dim,
        border: `${border} solid var(--color-border)`,
        borderTopColor: "var(--color-primary)",
        borderRadius: "var(--radius-full)",
        animation: "spin 0.6s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}
