from django.db import models
from typing import Any, Dict

class Alerta(models.Model):
    id: int
    entrevista_id: int
    participante_id: int
    tipo_alerta: str
    severidad: str
    descripcion: str
    evidencia_json: Dict[str, Any] | None
    origen: str
    timestamp_alerta: float
    fecha_creacion: Any

