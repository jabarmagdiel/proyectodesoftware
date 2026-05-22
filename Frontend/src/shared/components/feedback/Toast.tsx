import { useEffect, useState } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastProps = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: () => void;
};

const variantStyles: Record<ToastVariant, React.CSSProperties> = {
  success: {
    borderLeft: "4px solid var(--color-success)",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  error: {
    borderLeft: "4px solid var(--color-danger)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  warning: {
    borderLeft: "4px solid #eab308",
    backgroundColor: "rgba(234, 179, 8, 0.1)",
  },
  info: {
    borderLeft: "4px solid var(--color-primary)",
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },
};

const icons: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export default function Toast({
  message,
  variant = "info",
  duration = 4000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-sm)",
        padding: "var(--space-sm) var(--space-md)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        color: "var(--color-text)",
        fontSize: "var(--font-size-sm)",
        minWidth: "260px",
        maxWidth: "400px",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms ease",
        animation: "toast-in 200ms ease",
        ...variantStyles[variant],
      }}
    >
      <span style={{ flexShrink: 0, fontWeight: "var(--font-weight-bold)" }}>
        {icons[variant]}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 200); }}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-muted)",
          cursor: "pointer",
          padding: "0",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}
