# Estándares de Programación — Proctoring App Frontend

## 1. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `ExamCard.tsx`, `LoginForm.tsx` |
| Hooks | camelCase + prefijo `use` | `useAuth.ts`, `useRecorder.ts` |
| Servicios | camelCase + sufijo `Service` | `authService.ts`, `examService.ts` |
| Tipos / Interfaces | PascalCase, sin prefijo `I` | `User`, `Exam`, `ApiResponse<T>` |
| Constantes | UPPER_SNAKE_CASE | `QUERY_STALE_TIME`, `ROLES` |
| Utilidades | camelCase | `formatDate.ts`, `validators.ts` |
| Carpetas | kebab-case | `shared/`, `query-client.ts` |

---

## 2. Componentes

- Siempre functional components con `export default function`.
- Un componente por archivo. El nombre del archivo = nombre del componente.
- Props inline si son 1-2, type separado si son 3+.

```tsx
// Simple — props inline
export default function ExamCard({ title, date }: { title: string; date: string }) {
  return <div>{title} - {date}</div>;
}

// Complejo — type separado
type ReportViewProps = {
  sessionId: string;
  riskLevel: string;
  events: AIEvent[];
  onApprove: () => void;
};

export default function ReportView({ sessionId, riskLevel, events, onApprove }: ReportViewProps) {
  // ...
}
```

---

## 3. Servicios (llamadas API)

- Cada feature tiene su propio servicio.
- Usar siempre la instancia `api` de `@/shared/lib/axios.ts`. Nunca `axios` directo.
- Los servicios retornan datos tipados, no `AxiosResponse`.

```ts
import { api } from "@/shared/lib/axios";
import type { Session } from "./types";

export const sessionService = {
  start: (data: StartSessionRequest) =>
    api.post<Session>("/sessions/start", data).then((r) => r.data),

  end: (id: string) =>
    api.post(`/sessions/${id}/end`).then((r) => r.data),

  getReport: (id: string) =>
    api.get<Report>(`/sessions/${id}/report`).then((r) => r.data),
};
```

---

## 4. Hooks de datos (React Query)

- Un hook por operación (query o mutation).
- Query keys descriptivas como arrays.

```ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { sessionService } from "./sessionService";

export function useReport(sessionId: string) {
  return useQuery({
    queryKey: ["report", sessionId],
    queryFn: () => sessionService.getReport(sessionId),
  });
}

export function useEndSession() {
  return useMutation({
    mutationFn: (id: string) => sessionService.end(id),
  });
}
```

---

## 5. Imports

### Orden obligatorio

1. React y librerías externas
2. `@/shared/`
3. `@/features/`
4. Imports relativos (`./`, `../`)

```ts
// 1. Externas
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Shared
import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api";

// 3. Features
import { useAuth } from "@/features/auth";

// 4. Relativos
import ExamCard from "./ExamCard";
```

### Reglas

- Siempre usar el alias `@/` para imports absolutos.
- Importar features solo desde su `index.ts`, nunca archivos internos.
- Nunca: `import { useAuth } from "@/features/auth/hooks/useAuth"`.
- Correcto: `import { useAuth } from "@/features/auth"`.

---

## 6. TypeScript

- Strict mode habilitado. Sin excepciones.
- **Prohibido** usar `any`. Usar `unknown` si el tipo es realmente desconocido.
- Preferir `type` sobre `interface`, excepto para objetos que se van a extender.
- Exportar todos los tipos desde `types/` de cada feature.

```ts
// Correcto
type ExamStatus = "pending" | "in_progress" | "completed";

type Exam = {
  id: string;
  title: string;
  status: ExamStatus;
};

// Evitar
interface IExam { ... }  // No usar prefijo I
let data: any;           // Prohibido
```

---

## 7. Dependencias entre capas

Flujo unidireccional estricto:

```
pages → features → shared → config
```

- `pages/` importa de `features/` y `shared/`. Nunca al revés.
- `features/` importa de `shared/` y `config/`. Nunca de otra feature directamente.
- `shared/` importa de `config/`. Nunca de `features/`.
- Si dos features necesitan comunicarse, lo hacen a través de `shared/` o del estado del router.

---

## 8. Reglas generales

- **No instalar dependencias** sin justificación clara.
- **No abstracciones prematuras.** Tres líneas repetidas es mejor que una abstracción innecesaria.
- **No comentarios obvios.** Solo comentar el "por qué", nunca el "qué".
- **No lógica de negocio en componentes.** Va en hooks o services.
- **No llamadas a API en componentes.** Van en services, se consumen vía hooks de React Query.
- **No `useEffect` para fetch de datos.** Usar React Query.
- **No `console.log` en código commiteado.**

---

## 9. Estructura de un componente de página

Las páginas solo componen features. No contienen lógica propia.

```tsx
import MainLayout from "@/shared/components/layout/MainLayout";
import { JitsiRoom, useRecorder, useTabDetector } from "@/features/proctoring";
import { useExamSession } from "@/features/exams";

export default function ExamSessionPage() {
  const { sessionId } = useParams();
  const session = useExamSession(sessionId);
  const recorder = useRecorder();

  useTabDetector(sessionId);

  return (
    <MainLayout>
      <JitsiRoom sessionId={sessionId} />
    </MainLayout>
  );
}
```

---

## 10. Git

- Commits en español, descriptivos y cortos.
- Un commit por cambio lógico, no commits gigantes.
- No commitear `.env`, `node_modules/`, ni archivos con secrets.
