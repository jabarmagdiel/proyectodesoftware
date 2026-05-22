import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MainLayout } from "@/shared/components/layout";
import { Spinner } from "@/shared/components/ui";
import { useCurrentUser, useLogout } from "@/features/auth";
import { useDashboardStats } from "@/features/dashboard";

type StatCardProps = {
  icon: string;
  value: number;
  label: string;
  isLoading: boolean;
  accentColor: string;
};

function StatCard({ icon, value, label, isLoading, accentColor }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderTop: `3px solid ${accentColor}`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-sm)",
      }}
    >
      <span style={{ fontSize: "var(--font-size-xl)", lineHeight: 1 }}>{icon}</span>
      <div style={{ minHeight: "3rem", display: "flex", alignItems: "center" }}>
        {isLoading ? (
          <Spinner size="md" />
        ) : (
          <span
            style={{
              fontSize: "var(--font-size-3xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text)",
              lineHeight: 1,
            }}
          >
            {value}
          </span>
        )}
      </div>
      <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

const NAV_ITEMS = [
  {
    id: "usuarios",
    icon: "👥",
    title: "Usuarios",
    description: "Gestiona cuentas, roles y accesos del equipo",
    to: "/usuarios" as const,
  },
  {
    id: "pruebas",
    icon: "📋",
    title: "Pruebas",
    description: "Crea y administra evaluaciones técnicas y teóricas",
    to: "/pruebas" as const,
  },
  {
    id: "entrevistas",
    icon: "🗓️",
    title: "Entrevistas",
    description: "Programa sesiones y asigna pruebas a candidatos",
    to: "/entrevistas" as const,
  },
] as const;

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const stats = useDashboardStats();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const displayName = user?.username ?? "…";

  return (
    <MainLayout userName={displayName} onLogout={logout}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
        {/* Saludo */}
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderLeft: "4px solid var(--color-primary)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-xl)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-xs)",
            }}
          >
            Panel de administración
          </p>
          <h1
            style={{
              fontSize: "var(--font-size-2xl)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text)",
            }}
          >
            Bienvenido,{" "}
            <span style={{ color: "var(--color-primary)" }}>{displayName}</span>
          </h1>
        </div>

        {/* Métricas */}
        <section>
          <h2
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text)",
              marginBottom: "var(--space-lg)",
            }}
          >
            Resumen del sistema
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-lg)",
            }}
          >
            <StatCard
              icon="👥"
              value={stats.totalUsuarios}
              label="Usuarios registrados"
              isLoading={stats.isLoading}
              accentColor="var(--color-primary)"
            />
            <StatCard
              icon="📋"
              value={stats.totalPruebas}
              label="Pruebas disponibles"
              isLoading={stats.isLoading}
              accentColor="var(--color-success)"
            />
            <StatCard
              icon="🗓️"
              value={stats.totalEntrevistas}
              label="Entrevistas creadas"
              isLoading={stats.isLoading}
              accentColor="#f59e0b"
            />
          </div>
        </section>

        {/* Accesos rápidos */}
        <section>
          <h2
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text)",
              marginBottom: "var(--space-lg)",
            }}
          >
            Accesos rápidos
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-lg)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isHovered = hoveredNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate({ to: item.to })}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-lg)",
                    backgroundColor: isHovered
                      ? "var(--color-surface-hover)"
                      : "var(--color-surface)",
                    border: `1px solid ${isHovered ? "var(--color-primary)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-xl)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    color: "inherit",
                    width: "100%",
                    boxSizing: "border-box",
                    transition:
                      "background-color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)",
                    boxShadow: isHovered ? "var(--shadow-md)" : "none",
                  }}
                >
                  <span style={{ fontSize: "2.25rem", lineHeight: 1 }}>{item.icon}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "var(--font-size-lg)",
                          fontWeight: "var(--font-weight-bold)",
                          color: "var(--color-text)",
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--font-size-lg)",
                          color: isHovered ? "var(--color-primary)" : "var(--color-text-muted)",
                          transition: "color var(--transition-fast)",
                        }}
                      >
                        →
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
