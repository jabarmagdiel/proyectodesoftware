type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function Card({ title, children, style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text)",
            marginBottom: "var(--space-md)",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
