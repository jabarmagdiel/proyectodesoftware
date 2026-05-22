import { Badge, Spinner } from "@/shared/components/ui";
import { DASHBOARD } from "@/config/constants";
import type { ActividadReciente } from "../types";

type ActividadListProps = {
  actividad: ActividadReciente[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

function tipoVariant(tipo: string): BadgeVariant {
  if (tipo.includes("usuario")) return "info";
  if (tipo.includes("prueba")) return "success";
  if (tipo.includes("entrevista")) return "warning";
  if (tipo.includes("sesion") || tipo.includes("sesión")) return "neutral";
  return "neutral";
}

function tipoLabel(tipo: string): string {
  return tipo.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days > 1 ? "s" : ""}`;
}

export default function ActividadList({ actividad, isLoading, isError }: ActividadListProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h2
        style={{
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-bold)",
          color: "var(--color-text)",
          marginBottom: "var(--space-md)",
        }}
      >
        {DASHBOARD.ACTIVIDAD_TITLE}
      </h2>

      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-xl)" }}>
          <Spinner size="md" />
        </div>
      )}

      {isError && (
        <p
          style={{
            color: "var(--color-danger)",
            fontSize: "var(--font-size-sm)",
            textAlign: "center",
            padding: "var(--space-md)",
          }}
        >
          {DASHBOARD.ACTIVIDAD_ERROR}
        </p>
      )}

      {!isLoading && !isError && (!actividad || actividad.length === 0) && (
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-sm)",
            textAlign: "center",
            padding: "var(--space-xl)",
          }}
        >
          {DASHBOARD.ACTIVIDAD_EMPTY}
        </p>
      )}

      {!isLoading && !isError && actividad && actividad.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {actividad.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-md)",
                padding: "var(--space-sm) 0",
                borderBottom:
                  idx < actividad.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
            >
              {/* Tipo badge */}
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <Badge variant={tipoVariant(item.tipo)}>{tipoLabel(item.tipo)}</Badge>
              </div>

              {/* Descripción + usuario */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text)",
                    marginBottom: "var(--space-xs)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.descripcion}
                >
                  {item.descripcion}
                </p>
                <p style={{ fontSize: "var(--font-size-xs, 0.75rem)", color: "var(--color-text-muted)" }}>
                  {item.usuario}
                </p>
              </div>

              {/* Timestamp */}
              <span
                style={{
                  fontSize: "var(--font-size-xs, 0.75rem)",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {formatRelative(item.fecha)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
