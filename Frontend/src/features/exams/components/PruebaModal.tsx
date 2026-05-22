import { useState } from "react";
import { createPortal } from "react-dom";
import { Button, Input } from "@/shared/components/ui";
import { PRUEBAS } from "@/config/constants";
import { useCurrentUser } from "@/features/auth";
import { useCreatePrueba, useUpdatePrueba } from "../hooks/useExams";
import type {
  AreaPrueba,
  CreatePruebaDto,
  EstadoPrueba,
  NivelPrueba,
  Prueba,
  TipoPrueba,
  UpdatePruebaDto,
} from "../types";

type PruebaModalProps = {
  onClose: () => void;
  prueba?: Prueba;
};

type FormState = {
  titulo: string;
  tipo: TipoPrueba;
  area: AreaPrueba;
  nivel: NivelPrueba;
  descripcion: string;
  puntaje_maximo: string;
  duracion_minutos: string;
  estado: EstadoPrueba;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateForm(state: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!state.titulo.trim()) errors.titulo = PRUEBAS.VALIDATION_REQUIRED;
  if (!state.descripcion.trim()) errors.descripcion = PRUEBAS.VALIDATION_REQUIRED;

  const puntaje = Number(state.puntaje_maximo);
  if (!state.puntaje_maximo) {
    errors.puntaje_maximo = PRUEBAS.VALIDATION_REQUIRED;
  } else if (isNaN(puntaje) || puntaje <= 0) {
    errors.puntaje_maximo = PRUEBAS.VALIDATION_POSITIVE;
  }

  const duracion = Number(state.duracion_minutos);
  if (!state.duracion_minutos) {
    errors.duracion_minutos = PRUEBAS.VALIDATION_REQUIRED;
  } else if (isNaN(duracion) || duracion <= 0) {
    errors.duracion_minutos = PRUEBAS.VALIDATION_POSITIVE;
  }

  return errors;
}

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-xs)",
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

export default function PruebaModal({ onClose, prueba }: PruebaModalProps) {
  const isEdit = Boolean(prueba);
  const { data: currentUser } = useCurrentUser();
  const createPrueba = useCreatePrueba();
  const updatePrueba = useUpdatePrueba();

  const [form, setForm] = useState<FormState>({
    titulo: prueba?.titulo ?? "",
    tipo: prueba?.tipo ?? "teorica",
    area: prueba?.area ?? "programacion",
    nivel: prueba?.nivel ?? "basico",
    descripcion: prueba?.descripcion ?? "",
    puntaje_maximo: prueba?.puntaje_maximo?.toString() ?? "",
    duracion_minutos: prueba?.duracion_minutos?.toString() ?? "",
    estado: prueba?.estado ?? "borrador",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isPending = createPrueba.isPending || updatePrueba.isPending;

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const base = {
      titulo: form.titulo,
      tipo: form.tipo,
      area: form.area,
      nivel: form.nivel,
      descripcion: form.descripcion,
      puntaje_maximo: Number(form.puntaje_maximo),
      duracion_minutos: Number(form.duracion_minutos),
      estado: form.estado,
    };

    if (isEdit && prueba) {
      const dto: UpdatePruebaDto = base;
      updatePrueba.mutate({ id: prueba.id, dto }, { onSuccess: onClose });
    } else {
      const dto: CreatePruebaDto = { ...base, creada_por: currentUser!.id };
      createPrueba.mutate(dto, { onSuccess: onClose });
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
          maxWidth: "560px",
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
            {isEdit ? PRUEBAS.MODAL_EDITAR_TITLE : PRUEBAS.MODAL_CREAR_TITLE}
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

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
        >
          <Input
            label={PRUEBAS.LABEL_TITULO}
            name="titulo"
            value={form.titulo}
            error={formErrors.titulo}
            variant={formErrors.titulo ? "error" : "default"}
            onChange={(e) => handleChange("titulo", e.target.value)}
          />

          {/* Tipo / Área en fila */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div style={fieldStyle}>
              <label htmlFor="tipo" style={labelStyle}>
                {PRUEBAS.LABEL_TIPO}
              </label>
              <select
                id="tipo"
                value={form.tipo}
                onChange={(e) => handleChange("tipo", e.target.value as TipoPrueba)}
                style={selectStyle}
              >
                {PRUEBAS.TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {PRUEBAS.TIPO_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label htmlFor="area" style={labelStyle}>
                {PRUEBAS.LABEL_AREA}
              </label>
              <select
                id="area"
                value={form.area}
                onChange={(e) => handleChange("area", e.target.value as AreaPrueba)}
                style={selectStyle}
              >
                {PRUEBAS.AREAS.map((a) => (
                  <option key={a} value={a}>
                    {PRUEBAS.AREA_LABELS[a]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nivel / Estado en fila */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div style={fieldStyle}>
              <label htmlFor="nivel" style={labelStyle}>
                {PRUEBAS.LABEL_NIVEL}
              </label>
              <select
                id="nivel"
                value={form.nivel}
                onChange={(e) => handleChange("nivel", e.target.value as NivelPrueba)}
                style={selectStyle}
              >
                {PRUEBAS.NIVELES.map((n) => (
                  <option key={n} value={n}>
                    {PRUEBAS.NIVEL_LABELS[n]}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label htmlFor="estado" style={labelStyle}>
                {PRUEBAS.LABEL_ESTADO}
              </label>
              <select
                id="estado"
                value={form.estado}
                onChange={(e) => handleChange("estado", e.target.value as EstadoPrueba)}
                style={selectStyle}
              >
                {PRUEBAS.ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {PRUEBAS.ESTADO_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div style={fieldStyle}>
            <label htmlFor="descripcion" style={labelStyle}>
              {PRUEBAS.LABEL_DESCRIPCION}
            </label>
            <textarea
              id="descripcion"
              value={form.descripcion}
              rows={3}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: `1px solid ${formErrors.descripcion ? "var(--color-danger)" : "var(--color-border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "var(--space-sm) var(--space-md)",
                fontSize: "var(--font-size-base)",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                width: "100%",
              }}
            />
            {formErrors.descripcion && (
              <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-danger)" }}>
                {formErrors.descripcion}
              </span>
            )}
          </div>

          {/* Puntaje y Duración */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <Input
              label={PRUEBAS.LABEL_PUNTAJE}
              name="puntaje_maximo"
              type="number"
              value={form.puntaje_maximo}
              error={formErrors.puntaje_maximo}
              variant={formErrors.puntaje_maximo ? "error" : "default"}
              onChange={(e) => handleChange("puntaje_maximo", e.target.value)}
            />
            <Input
              label={PRUEBAS.LABEL_DURACION}
              name="duracion_minutos"
              type="number"
              value={form.duracion_minutos}
              error={formErrors.duracion_minutos}
              variant={formErrors.duracion_minutos ? "error" : "default"}
              onChange={(e) => handleChange("duracion_minutos", e.target.value)}
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
            <Button variant="secondary" type="button" onClick={onClose} disabled={isPending}>
              {PRUEBAS.BTN_CANCELAR}
            </Button>
            <Button variant="primary" type="submit" loading={isPending} disabled={!currentUser}>
              {isEdit ? PRUEBAS.BTN_GUARDAR : PRUEBAS.BTN_CREAR}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
