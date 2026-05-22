from django.db import models
from typing import Any

class Reporte(models.Model):
    id: int
    entrevista_id: int
    participante_id: int
    resumen_general: str
    resumen_participante: str
    recomendaciones: str
    nivel_riesgo: str
    fecha_creacion: Any

