from rest_framework import serializers

from apps.reportes.models import Reporte


class ReporteSerializer(serializers.ModelSerializer):
    entrevista_id = serializers.IntegerField(read_only=True)
    participante_id = serializers.IntegerField(read_only=True)
    id_entrevista = serializers.IntegerField(write_only=True, required=False)
    id_participante = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Reporte
        fields = [
            "id",
            "entrevista_id",
            "participante_id",
            "id_entrevista",
            "id_participante",
            "resumen_general",
            "resumen_participante",
            "recomendaciones",
            "nivel_riesgo",
            "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion"]

    def create(self, validated_data):
        entrevista_id = validated_data.pop("id_entrevista", None)
        participante_id = validated_data.pop("id_participante", None)
        if entrevista_id is not None:
            validated_data["entrevista_id"] = entrevista_id
        if participante_id is not None:
            validated_data["participante_id"] = participante_id
        return super().create(validated_data)
