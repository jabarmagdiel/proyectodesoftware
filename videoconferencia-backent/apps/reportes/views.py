from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.alertas.models import Alerta
from apps.reportes.models import Reporte
from apps.reportes.serializers import ReporteSerializer

# ---------------------------------------------------------------------------
# Helpers para generar textos dinámicos basados en alertas reales
# ---------------------------------------------------------------------------

_TIPO_LABELS = {
    "uso_de_celular": "uso de celular",
    "sin_rostro": "ausencia de rostro",
    "multiples_rostros": "múltiples rostros detectados",
    "mirada_fuera_pantalla": "mirada fuera de pantalla",
    "posible_celular_o_lectura": "posible lectura o celular fuera de cámara",
    "cambio_ventana": "cambio de ventana/pestaña",
    "camara_apagada": "cámara apagada",
    "pantalla_compartida": "pantalla compartida",
    "participante_salio": "participante se desconectó",
}


def _label(tipo: str) -> str:
    return _TIPO_LABELS.get(tipo, tipo.replace("_", " "))


def _generar_textos_dinamicos(alertas_sesion, nivel_riesgo: str) -> tuple[str, str, str]:
    """Genera resúmenes y recomendaciones dinámicas basadas en las alertas reales."""
    total = len(alertas_sesion)

    # -- resumen_general --
    if total == 0:
        resumen_general = (
            "La sesión transcurrió sin incidencias. El sistema de proctoring no detectó "
            "ninguna alerta durante la entrevista."
        )
    else:
        conteos: dict[str, int] = {}
        for a in alertas_sesion:
            conteos[a.tipo_alerta] = conteos.get(a.tipo_alerta, 0) + 1

        detalles = ", ".join(
            f"{cnt} alerta(s) de {_label(tipo)}"
            for tipo, cnt in sorted(conteos.items())
        )
        resumen_general = (
            f"El sistema de proctoring detectó {total} alerta(s) durante la sesión: {detalles}. "
            f"El nivel de riesgo evaluado es: {nivel_riesgo.upper()}."
        )

    # -- resumen_participante --
    altas = [a for a in alertas_sesion if a.severidad == "alta"]
    medias = [a for a in alertas_sesion if a.severidad == "media"]

    if total == 0:
        resumen_participante = "El candidato mantuvo un comportamiento adecuado durante toda la sesión sin generar alertas."
    elif nivel_riesgo == "bajo":
        resumen_participante = (
            f"El candidato tuvo un buen desempeño con {total} alerta(s) menor(es). "
            "No se observaron patrones preocupantes de comportamiento."
        )
    elif nivel_riesgo == "medio":
        resumen_participante = (
            f"El candidato presentó un comportamiento aceptable, aunque se registraron "
            f"{len(altas)} alerta(s) de severidad alta y {len(medias)} de severidad media. "
            "Se recomienda revisar las evidencias antes de tomar una decisión."
        )
    else:
        tipos_altas = ", ".join({_label(a.tipo_alerta) for a in altas}) if altas else "varias categorías"
        resumen_participante = (
            f"El candidato generó {total} alerta(s) durante la sesión, de las cuales "
            f"{len(altas)} son de severidad alta relacionadas con: {tipos_altas}. "
            "El patrón de comportamiento sugiere riesgo elevado de deshonestidad académica o irregularidades."
        )

    # -- recomendaciones --
    if total == 0:
        recomendaciones = "El candidato puede avanzar al siguiente paso del proceso sin observaciones adicionales."
    elif nivel_riesgo == "bajo":
        recomendaciones = (
            "Se puede aprobar al candidato. Las alertas detectadas son de baja severidad y no representan un riesgo significativo."
        )
    elif nivel_riesgo == "medio":
        recomendaciones = (
            "Revisar manualmente las alertas registradas antes de aprobar al candidato. "
            "Considerar solicitar una segunda entrevista si persisten las dudas."
        )
    else:
        recomendaciones = (
            "Se recomienda rechazar al candidato o solicitar una entrevista de validación supervisada presencialmente. "
            "Las alertas de alta severidad indican posibles irregularidades que comprometen la integridad del proceso."
        )

    return resumen_general, resumen_participante, recomendaciones


class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all().order_by("-fecha_creacion")
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="resumen")
    def resumen(self, request):
        """Genera y persiste un informe de IA vinculado a la entrevista y la sesión."""
        entrevista_id = int(request.data.get("entrevista_id") or 0)
        participante_id = int(request.data.get("participante_id") or 1)
        nivel_riesgo = str(request.data.get("nivel_riesgo") or "medio")
        session_id = request.data.get("session_id") or None

        if entrevista_id <= 0:
            return Response(
                {"detail": "entrevista_id es obligatorio para crear el informe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Obtener alertas filtradas por entrevista y, si hay session_id, por sesión
        alertas_qs = Alerta.objects.filter(entrevista_id=entrevista_id)
        if session_id:
            # Filtrar alertas cuyo evidencia_json contenga el session_id de esta sesión
            alertas_sesion = [
                a for a in alertas_qs
                if (
                    isinstance(a.evidencia_json, dict)
                    and a.evidencia_json.get("session_id") == session_id
                )
            ]
        else:
            alertas_sesion = list(alertas_qs)

        resumen_general, resumen_participante, recomendaciones = _generar_textos_dinamicos(
            alertas_sesion, nivel_riesgo
        )

        # Append session_id al final del resumen_general para que el frontend pueda leerlo
        if session_id:
            resumen_general = f"{resumen_general}\nSessionID: {session_id}"

        reporte = Reporte.objects.create(
            entrevista_id=entrevista_id,
            participante_id=participante_id,
            resumen_general=resumen_general,
            resumen_participante=resumen_participante,
            recomendaciones=recomendaciones,
            nivel_riesgo=nivel_riesgo,
        )

        serializer = ReporteSerializer(reporte)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
