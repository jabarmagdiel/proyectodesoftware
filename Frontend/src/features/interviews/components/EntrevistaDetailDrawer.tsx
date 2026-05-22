import { useState } from "react";
import { createPortal } from "react-dom";
import { Badge, Button, Spinner } from "@/shared/components/ui";
import { ENTREVISTAS, PRUEBAS } from "@/config/constants";
import { useGetPruebas } from "@/features/exams";
import { useGetPruebasEntrevista, useRemoverAsignacion } from "../hooks/useEntrevistas";
import type { Entrevista, EstadoAsignacion, EstadoEntrevista, PruebaEntrevista } from "../types";
import AsignarPruebaModal from "./AsignarPruebaModal";

type EntrevistaDetailDrawerProps = {
  entrevista: Entrevista;
  onClose: () => void;
};

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const metaLabelStyle: React.CSSProperties = {
  fontSize: "var(--font-size-sm)",
  color: "var(--color-text-muted)",
  marginBottom: "var(--space-xs)",
};

const metaValueStyle: React.CSSProperties = {
  fontSize: "var(--font-size-base)",
  color: "var(--color-text)",
  fontWeight: "var(--font-weight-medium)",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EntrevistaDetailDrawer({
  entrevista,
  onClose,
}: EntrevistaDetailDrawerProps) {
  const { data: asignaciones, isLoading } = useGetPruebasEntrevista(entrevista.id);
  const { data: pruebas } = useGetPruebas();
  const removerAsignacion = useRemoverAsignacion();
  const [isAsignarOpen, setIsAsignarOpen] = useState(false);

  const pruebaMap = new Map((pruebas ?? []).map((p) => [p.id, p]));
  const asignacionesList = asignaciones ?? [];
  const assignedPruebaIds = asignacionesList.map((a) => a.prueba);

  const handleRemover = (asignacion: PruebaEntrevista) => {
    if (window.confirm(ENTREVISTAS.CONFIRM_REMOVER_PRUEBA)) {
      removerAsignacion.mutate({ id: asignacion.id, entrevistaId: entrevista.id });
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-xl)",
      }}
    >
      <div
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-xl)",
          width: "100%",
          maxWidth: "780px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)",
        }}
      >
        {/* Encabezado */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--space-md)",
          }}
        >
          <div>
            <p style={metaLabelStyle}>{ENTREVISTAS.MODAL_DETALLE_TITLE}</p>
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-text)",
              }}
            >
              {entrevista.titulo}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-xl)",
              cursor: "pointer",
              lineHeight: 1,
              padding: "var(--space-xs)",
              flexShrink: 0,
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Badge de estado */}
        <div>
          <Badge
            variant={
              ENTREVISTAS.ESTADO_BADGE[entrevista.estado as EstadoEntrevista] as BadgeVariant
            }
          >
            {ENTREVISTAS.ESTADO_LABELS[entrevista.estado as EstadoEntrevista]}
          </Badge>
        </div>

        {/* Descripción */}
        <div>
          <p style={metaLabelStyle}>{ENTREVISTAS.LABEL_DESCRIPCION}</p>
          <p
            style={{
              fontSize: "var(--font-size-base)",
              color: "var(--color-text)",
              lineHeight: 1.6,
            }}
          >
            {entrevista.descripcion}
          </p>
        </div>

        {/* Métricas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-md)",
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-md)",
          }}
        >
          <div>
            <p style={metaLabelStyle}>{ENTREVISTAS.COL_FECHA}</p>
            <p style={metaValueStyle}>{formatDate(entrevista.fecha_programada)}</p>
          </div>
          <div>
            <p style={metaLabelStyle}>Creada</p>
            <p style={metaValueStyle}>{formatDate(entrevista.fecha_creacion)}</p>
          </div>
        </div>

        {/* Sección pruebas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-md)",
            }}
          >
            <p
              style={{
                fontSize: "var(--font-size-base)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-text)",
              }}
            >
              {ENTREVISTAS.DETAIL_PRUEBAS_TITLE}
            </p>
            <Button variant="primary" size="sm" onClick={() => setIsAsignarOpen(true)}>
              {ENTREVISTAS.BTN_ASIGNAR_PRUEBA}
            </Button>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-lg)" }}>
              <Spinner size="md" />
            </div>
          ) : asignacionesList.length === 0 ? (
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-sm)",
                textAlign: "center",
                padding: "var(--space-lg)",
                backgroundColor: "var(--color-background)",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--color-border)",
              }}
            >
              {ENTREVISTAS.DETAIL_NO_PRUEBAS}
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xs)",
                backgroundColor: "var(--color-background)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
              }}
            >
              {asignacionesList.map((asignacion) => {
                const prueba = pruebaMap.get(asignacion.prueba);
                return (
                  <div
                    key={asignacion.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-sm)",
                      padding: "var(--space-sm) var(--space-md)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {/* Tipo badge */}
                    {prueba && (
                      <Badge variant={PRUEBAS.TIPO_BADGE[prueba.tipo] as BadgeVariant}>
                        {PRUEBAS.TIPO_LABELS[prueba.tipo]}
                      </Badge>
                    )}

                    {/* Título */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={prueba?.titulo ?? String(asignacion.prueba)}
                    >
                      {prueba?.titulo ?? `Prueba #${asignacion.prueba}`}
                    </span>

                    {/* Estado asignación */}
                    <Badge
                      variant={
                        ENTREVISTAS.ESTADO_ASIGNACION_BADGE[
                          asignacion.estado as EstadoAsignacion
                        ] as BadgeVariant
                      }
                    >
                      {ENTREVISTAS.ESTADO_ASIGNACION_LABELS[asignacion.estado as EstadoAsignacion]}
                    </Badge>

                    {/* Observaciones */}
                    {asignacion.observaciones && (
                      <span
                        style={{
                          fontSize: "var(--font-size-xs, 0.75rem)",
                          color: "var(--color-text-muted)",
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={asignacion.observaciones}
                      >
                        {asignacion.observaciones}
                      </span>
                    )}

                    {/* Remover */}
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={removerAsignacion.isPending}
                      onClick={() => handleRemover(asignacion)}
                    >
                      {ENTREVISTAS.BTN_REMOVER}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>
            {ENTREVISTAS.BTN_CERRAR}
          </Button>
        </div>
      </div>

      {isAsignarOpen && (
        <AsignarPruebaModal
          entrevistaId={entrevista.id}
          assignedPruebaIds={assignedPruebaIds}
          onClose={() => setIsAsignarOpen(false)}
        />
      )}
    </div>,
    document.body
  );
}
