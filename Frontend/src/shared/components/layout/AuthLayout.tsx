type AuthLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
        padding: "var(--space-xl)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xl)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-primary)",
            }}
          >
            Proctoring
          </span>
          {title && (
            <h1
              style={{
                marginTop: "var(--space-md)",
                fontSize: "var(--font-size-2xl)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-text)",
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              style={{
                marginTop: "var(--space-xs)",
                fontSize: "var(--font-size-base)",
                color: "var(--color-text-muted)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-xl)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
