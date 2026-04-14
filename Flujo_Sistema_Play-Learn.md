# Flujo del Sistema Play-Learn
Version: 1.2 — Abril 2026

---

## 1. Arquitectura general

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                                │
│                                                                 │
│   play-learn-front (Next.js 16 · App Router · Turbopack)        │
│   Puerto: 3001                                                  │
│                                                                 │
│   Cookies:  pl_session=1  |  pl_role=admin|learner              │
│   Storage:  playlearn_settings_v1 → { baseUrl, token, email }   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP + JWT Bearer
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVIDOR                                 │
│                                                                 │
│   play-learn-api (NestJS 11 · Prisma 7)                         │
│   Puerto: 3000   Prefijo: /api                                  │
│                                                                 │
│   Guardias globales: JwtAuthGuard → RolesGuard                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ Prisma ORM
                         ▼
              PostgreSQL (play_learn_mvp)
```

---

## 2. Roles y accesos

| Rol | Credencial (env) | Ruta de entrada | Qué puede hacer |
|---|---|---|---|
| `admin` | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `/dashboard` | CRUD completo de todos los módulos |
| `learner` | No requiere credenciales backend en MVP | `/learn` | Solo los endpoints marcados `@Public` |

> Los endpoints `@Public` NO requieren JWT. Cualquier petición con token válido también pasa.
> Los endpoints de admin requieren token con `role = admin`.

---

## 3. Flujo de autenticación

```
Usuario abre /
    │
    ├─► ¿Tiene cookie pl_session?
    │       NO → redirige a /login
    │       SÍ → ¿pl_role?
    │               admin   → /dashboard
    │               learner → /learn
    │
    └─► /login
            │
            ├── Ingresa email + password + baseUrl
            │
            ├── POST /api/auth/login
            │       └─ Valida contra ADMIN_EMAIL/PASSWORD  → role = admin
            │
            ├── Respuesta: { accessToken, role, email }
            │
            ├── Guarda en localStorage:
            │       { baseUrl, token: accessToken, email }
            │
            ├── Pone cookies:
            │       pl_session = 1
            │       pl_role    = admin | learner
            │
                └── Redirige admin a /dashboard

                Flujo alterno alumno en /login:
                ├── Click "Continuar como alumno (sin login)"
                ├── Guarda settings base: { baseUrl, token: '', email: '' }
                ├── Pone cookies: pl_session=1, pl_role=learner
                └── Redirige a /learn
```

---

## 4. Flujo del panel Admin (`/dashboard`)

El admin gestiona los datos del sistema. Todos los endpoints requieren JWT con `role=admin`.

```
/dashboard
  │
  ├─ GET /api/topics           → listar / crear / editar / eliminar temas
  ├─ GET /api/skills           → listar / crear / editar / eliminar habilidades
  ├─ GET /api/questions        → listar / crear / editar / eliminar preguntas
  ├─ GET /api/users            → ver alumnos registrados
  ├─ GET /api/conversation-sessions   → ver sesiones de práctica
  ├─ GET /api/conversation-feedback   → ver feedback generado por la IA
  ├─ GET /api/generated-tests  → ver tests adaptativos generados
  ├─ GET /api/test-answers     → ver respuestas de alumnos
  └─ GET /api/skill-progress   → ver progreso de habilidades por alumno
```

**Ciclo típico del admin antes de una demo:**
1. Crear `Skills` (grammar, fluency, vocabulary...).
2. Crear `Topics` (escenarios: aeropuerto, entrevista, restaurante...).
3. Crear `Questions` vinculadas a Topic + Skill (para el test adaptativo).
4. Compartir enlace directo a /learn para alumno de prueba.

---

## 5. Flujo del Alumno (`/learn`) — Implementado

```
/learn  carga  useLearnerExperience
    │
    ├─ [Init] Carga en paralelo:
    │       GET /api/topics   → poblar selector de escenario
    │       GET /api/users    → buscar si el alumno ya existe (por email)
    │
    ├─ Si el alumno existe:
    │       Pre-llena nombre, nivel, email (campo bloqueado)
    │       Muestra: "Bienvenido de nuevo, [nombre]. Elige un escenario."
    │
    ├─ Si es primera vez:
    │       Muestra formulario vacío (email pre-llenado del login, editable)
    │
    │
    ══════════════ PASO 1: CONFIGURAR ══════════════
    │
    ├─ Alumno completa: Nombre · Email · Nivel · Escenario
    │
    ├─ Click "Empezar práctica"
    │       POST /api/users  (crea o recupera usuario)
    │       POST /api/conversation-sessions  (crea sesión con status=started)
    │       → step: 'practice'
    │
    │
    ══════════════ PASO 2: PRACTICAR ══════════════
    │
    ├─ Se muestran 3 prompts de conversación:
    │       1. Preséntate y explica por qué quieres aprender inglés.
    │       2. Describe una situación en un aeropuerto y cómo la resolverías.
    │       3. Cierra la conversación proponiendo un plan para esta semana.
    │
    ├─ Por cada turno el alumno escribe su respuesta y hace click "Enviar turno"
    │       POST /api/conversation/analyze-turn
    │           body: { sessionId, userMessage, topicName,
    │                   learnerLevel, turnIndex, transcript }
    │           response: { assistantReply, feedbackType,
    │                       detectedIssue, suggestedCorrection,
    │                       fluencyScore, pronunciationScore, grammarScore }
    │
    ├─ La respuesta del coach aparece como burbuja en el chat
    ├─ El feedback se muestra como nota itálica debajo
    ├─ Los scores se acumulan como promedio turno a turno
    │
    ├─ En el último turno → botón cambia a "Finalizar sesión"
    │       PATCH /api/conversation-sessions/:id
    │           body: { status: completed, transcriptText,
    │                   fluencyScore, pronunciationScore,
    │                   grammarScore, overallScore, endedAt }
    │
    ├─ En paralelo: carga datos del resumen
    │       GET /api/generated-tests   → busca test creado para esta sesión
    │       GET /api/skill-progress    → busca mastery actualizado del alumno
    │       → step: 'summary'
    │
    │
    ══════════════ PASO 3: RESULTADOS ══════════════
    │
    └─ Muestra:
            Fluency / Pronunciation / Grammar  (con color: verde/ámbar/rojo)
            Overall score + nivel MCER estimado
            Recomendación de siguiente sesión
            Mastery bar (progreso acumulado)
            Reactivos del test de seguimiento generado
            Botón "Practicar otro escenario" → vuelve al paso 1
```

---

## 6. Flujo del Alumno — Fase 2 (pendiente de implementar)

Esta fase completa el ciclo adaptativo del producto.

```
Fin de sesión (resumen)
    │
    ├─ El sistema ya creó un GeneratedTest vinculado a la sesión
    │   (con generatedReason = session_followup)
    │
    ├─ [NUEVO] Mostrar botón "Resolver test adaptativo"
    │
    └─ /learn/test/:generatedTestId
            │
            ├─ GET /api/questions?topicId=X  → cargar preguntas del test
            │
            ├─ Por cada pregunta el alumno responde
            │       POST /api/test-answers
            │           body: { generatedTestId, questionId, userAnswer }
            │           response: { isCorrect, feedbackText }
            │
            ├─ Al terminar todas las preguntas
            │       PATCH /api/generated-tests/:id
            │           body: { status: submitted, score }
            │
            └─ Actualizar SkillProgress con el resultado del test
                    PATCH /api/skill-progress/:id
                        body: { masteryLevel, lastScore }
```

---

## 7. Mapa completo de endpoints por actor

### Endpoints públicos (alumno, sin JWT obligatorio)

| Método | Ruta | Uso |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión de admin |
| `GET` | `/api/topics` | Cargar escenarios disponibles |
| `GET` | `/api/users` | Buscar usuario existente por email |
| `POST` | `/api/users` | Crear nuevo usuario alumno |
| `POST` | `/api/conversation-sessions` | Iniciar sesión de práctica |
| `PATCH` | `/api/conversation-sessions/:id` | Cerrar sesión con scores finales |
| `POST` | `/api/conversation/analyze-turn` | Analizar turno con IA y obtener feedback |
| `GET` | `/api/generated-tests` | Leer test generado al finalizar |
| `GET` | `/api/skill-progress` | Leer mastery acumulado del alumno |

### Endpoints admin (requieren JWT con role=admin)

| Método | Ruta | Uso |
|---|---|---|
| `GET/POST/PATCH/DELETE` | `/api/topics` | Gestionar escenarios de práctica |
| `GET/POST/PATCH/DELETE` | `/api/skills` | Gestionar habilidades evaluadas |
| `GET/POST/PATCH/DELETE` | `/api/questions` | Gestionar banco de preguntas adaptativas |
| `GET/POST/PATCH/DELETE` | `/api/users` | Ver y gestionar alumnos |
| `GET/POST/PATCH/DELETE` | `/api/conversation-sessions` | Supervisar sesiones |
| `GET/POST/PATCH/DELETE` | `/api/conversation-feedback` | Revisar feedback de la IA |
| `GET/POST/PATCH/DELETE` | `/api/generated-tests` | Administrar tests generados |
| `GET/POST/PATCH/DELETE` | `/api/test-answers` | Ver respuestas de alumnos a tests |
| `GET/POST/PATCH/DELETE` | `/api/skill-progress` | Ver y ajustar mastery de alumnos |

---

## 8. Modelo de datos simplificado

```
User ──────────────────┐
  id, email, fullName  │
  currentLevel, xpTotal│
                       ├──► ConversationSession ──► ConversationFeedback
Topic ─────────────────┘         scores, status,
  id, name, category             transcriptText
  difficultyLevel
       │                              │
       │                              ▼
       │                         GeneratedTest ──► TestAnswer
       │                           totalQuestions       │
       │                           generatedReason      │
       │                                                ▼
       └──────────────────────► Question ◄─────── (linked via questionId)
                                   promptText
                                   correctAnswer
                                   questionType

Skill ◄──────────────── Question
  code, name              │
  category            SkillProgress
                        userId, skillId
                        masteryLevel, lastScore
```

---

## 9. Variables de entorno requeridas

### Backend (`play-learn-api/.env`)

```
DATABASE_URL="postgresql://..."

JWT_SECRET="playlearn-dev-secret"
JWT_EXPIRES_IN="12h"

ADMIN_EMAIL="admin@playlearn.app"
ADMIN_PASSWORD="admin123"
```

### Frontend

No necesita `.env` propio. La `baseUrl` del backend se configura en el formulario de login
y se guarda en `localStorage` como parte de `playlearn_settings_v1`.

---

## 10. Estado actual del MVP

| Funcionalidad | Estado |
|---|---|
| Autenticación JWT (admin) + acceso learner público | ✅ Implementado |
| Panel admin con CRUD de todos los módulos | ✅ Implementado |
| Flujo conversacional guiado (3 turnos) | ✅ Implementado |
| Análisis de turno con IA y feedback inmediato | ✅ Implementado |
| Resumen con scores y mastery al finalizar | ✅ Implementado |
| Pre-llenado de perfil al volver a /learn | ✅ Implementado |
| Test adaptativo (questions + test-answers) | ⏳ Fase 2 pendiente |
| Calificación automática del test | ⏳ Fase 2 pendiente |
| Gamificación (XP, streaks, badges) | ⏳ Fase 3 pendiente |
| Input de voz (STT) | ⏳ Fase 3 pendiente |

---

## 11. Endurecimiento de Auth Learner (fase siguiente recomendada)

Objetivo: pasar de modelo publico MVP a modelo seguro con JWT por alumno y reglas de ownership.

### 11.1 Cambios de autenticación

1. Mantener login admin por credenciales de entorno.
2. Agregar login/registro learner contra tabla users (email + password hash).
3. Emitir JWT learner con claims minimos:
  - `sub` = userId
  - `email`
  - `role = learner`
4. Eliminar acceso publico a endpoints de flujo learner.

### 11.2 Matriz de endpoints (actual -> objetivo)

| Endpoint | Estado actual | Estado objetivo |
|---|---|---|
| `GET /api/topics` | Publico | JWT learner o admin |
| `GET /api/users` | Publico | Solo admin (learner usa `/users/me`) |
| `POST /api/users` | Publico | `POST /api/auth/register-learner` |
| `POST /api/conversation-sessions` | Publico | JWT learner/admin + ownership |
| `PATCH /api/conversation-sessions/:id` | Publico | JWT learner/admin + ownership |
| `POST /api/conversation/analyze-turn` | Publico | JWT learner/admin + ownership |
| `GET /api/generated-tests` | Publico | JWT learner/admin + filtros por owner |
| `GET /api/skill-progress` | Publico | JWT learner/admin + filtros por owner |

### 11.3 Reglas de ownership requeridas

1. Si `role=learner`, solo puede operar recursos con `userId = jwt.sub`.
2. Si `role=admin`, puede operar cualquier recurso.
3. Validar ownership en service/casos de uso, no solo en controller.
4. No confiar en `userId` enviado por frontend sin comparar contra JWT.

### 11.4 Ajustes frontend esperados

1. En `/login` separar tabs: Admin y Alumno.
2. Alumno usa login/registro real (no boton sin credenciales).
3. Guardar token learner en settings y usar `Authorization: Bearer`.
4. En `/learn`, obtener perfil con endpoint `GET /api/users/me`.

### 11.5 Criterio de salida de la fase

1. Ningun endpoint learner queda con `@Public()`.
2. Un learner no puede leer/editar sesiones de otro learner.
3. E2E con dos alumnos distintos validando aislamiento de datos.
4. Logs de auditoria basicos para login y errores de autorización.
