export type DashboardResumen = {
  totalUsuarios: number;
  totalPruebas: number;
  totalEntrevistas: number;
  sesionesActivas: number;
  sesionesHoy: number;
};

export type ActividadReciente = {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  usuario: string;
};

export type RiskLevel = "low" | "medium" | "high";

export type AIEvent = {
  id: string;
  sessionId: string;
  type: string;
  timestamp: string;
  confidence: number;
  description: string;
};

export type Report = {
  id: string;
  sessionId: string;
  riskLevel: RiskLevel;
  events: AIEvent[];
  pdfUrl?: string;
  createdAt: string;
};
