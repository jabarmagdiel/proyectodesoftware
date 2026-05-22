import { useState } from "react";
import { createPortal } from "react-dom";
import { Button, Spinner } from "@/shared/components/ui";
import { ENTREVISTAS, PRUEBAS } from "@/config/constants";
import { useCurrentUser } from "@/features/auth";
import { useGetPruebas } from "@/features/exams";
import { useAsignarPrueba } from "../hooks/useEntrevistas";
import type { AsignarPruebaDto } from "../types";

type AsignarPruebaModalProps = {
  entrevistaId: number;
  assignedPruebaIds: number[];
  onClose: () => void;
};

const labelStyle: React.CSSProperties = {
  fontSize: "var(--font-size-sm)",
  fontWeight: "var(--font-weight-medium)",
  color: "var(--color-text-muted)",
};

const selectStyle: React.CSSProperties = {
  backgroundColor: "var(--color-surface)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-sm) var(--space-md)",
  fontSize: "var(--font-size-base)",
  fontFamily: "inherit",
  width: "100%",
  outline: "none",
  cursor: "pointer",
};

export default function AsignarPruebaModal({
  entrevistaId,
  assignedPruebaIds,
  onClose,
}: AsignarPruebaModalProps) {
  const { data: currentUser } = useCurrentUser();
  const { data: pruebas, isLoading: loadingPruebas } = useGetPruebas();
  const asignarPrueba = useAsignarPrueba();

  const available = (pruebas ?? []).filter((p) => !assignedPruebaIds.includes(p.id));

  const [selectedPruebaId, setSelectedPruebaId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPruebaId) {
      setError(ENTREVISTAS.VALIDATION_REQUIRED);
      return;
    }
    if (!currentUser) return;

    const dto: AsignarPruebaDto = {
      entrevista: entrevistaId,
      prueba: Number(selectedPruebaId),
      asignada_por: currentUser.id,
      observaciones: observaciones.trim() || undefined,
    };

    asignarPrueba.mutate(dto, { onSuccess: onClose });
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-xl)",
      }}
    >
      <div
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
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
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-lg)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text)",
            }}
          >
            {ENTREVISTAS.MODAL_ASIGNAR_TITLE}
          </h2>
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
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {loadingPruebas ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-xl)" }}>
            <Spinner size="md" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
          >
            {/* Selector de prueba */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label htmlFor="prueba" style={labelStyle}>
                {ENTREVISTAS.LABEL_PRUEBA}
              </label>
              <select
                id="prueba"
                value={selectedPruebaId}
                onChange={(e) => {
                  setSelectedPruebaId(e.target.value);
                  setError("");
                }}
                style={{
                  ...selectStyle,
                  color: selectedPruebaId ? "var(--color-text)" : "var(--color-text-muted)",
                  borderColor: error ? "var(--color-danger)" : "var(--color-border)",
                }}
              >
                <option value="">— Selecciona una prueba —</option>
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo} ({PRUEBAS.TIPO_LABELS[p.tipo]})
                  </option>
                ))}
              </select>
              {error && (
                <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-danger)" }}>
                  {error}
                </span>
              )}
              {available.length === 0 && (
                <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
                  No hay pruebas disponibles para asignar
                </span>
              )}
            </div>

            {/* Observaciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              <label htmlFor="observaciones" style={labelStyle}>
                {ENTREVISTAS.LABEL_OBSERVACIONES}
              </label>
              <textarea
                id="observaciones"
                value={observaciones}
                rows={3}
                placeholder="Opcional"
                onChange={(e) => setObservaciones(e.target.value)}
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-sm) var(--space-md)",
                  fontSize: "var(--font-size-base)",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--space-sm)",
                justifyContent: "flex-end",
                marginTop: "var(--space-sm)",
              }}
            >
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
                disabled={asignarPrueba.isPending}
              >
                {ENTREVISTAS.BTN_CANCELAR}
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={asignarPrueba.isPending}
                disabled={available.length === 0 || !currentUser}
              >
                {ENTREVISTAS.BTN_ASIGNAR_PRUEBA}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
