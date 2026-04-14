# Play-Learn Front (Next.js)

Frontend del proyecto Play-Learn con dos experiencias:

- Admin interno para operar el MVP.
- Alumno final para practicar conversacion y ver progreso.

## Estado actual

### Implementado

1. Login real contra backend (api/auth/login) con JWT para admin.
2. Dashboard con conteos por modulo.
3. CRUD completo para recursos del backend.
4. Flujo tecnico de validacion en session-completion.
5. Flujo alumno en learn con practica por turnos.
6. Integracion con analisis IA por texto por turno.
7. Resumen final visual con scores, recomendacion, mastery y test sugerido.
8. Arquitectura frontend separada por rutas, features y componentes compartidos.

### Pendiente para cerrar MVP producto

1. Auth completa de producto para alumno en todo el journey.
2. Conversacion por voz (STT) y evaluacion de pronunciacion real.
3. Pruebas e2e de UX del flujo alumno.
4. Pulido visual final orientado a demo comercial.

## Stack

- Next.js 16 (App Router)
- TypeScript
- React 19

## Requisitos

- Node.js 20+
- API NestJS de este repositorio en ejecucion
- Base URL por defecto: http://localhost:3000/api

## Configuracion

1. Copia variables de entorno:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta el frontend:

```bash
npm run dev
```

4. Abre:

- http://localhost:3000/login para admin
- http://localhost:3000/learn para alumno

## Rutas principales

- /login
- /dashboard
- /crud/[resource]
- /session-completion
- /learn

## Login y roles

1. El formulario de /login autentica contra api/auth/login solo para admin.
2. En /login existe boton "Continuar como alumno (sin login)" para entrar a /learn.
3. El proxy de Next protege rutas admin por sesion y rol.

### Siguiente fase recomendada (auth learner segura)

1. Reemplazar acceso learner sin login por login/registro learner real.
2. Consumir endpoints protegidos con JWT learner.
3. Resolver perfil desde `/api/users/me` en lugar de listar usuarios.
4. Manejar errores 401/403 con recovery UX (relogin y mensajes claros).

## Flujo alumno (learn)

1. Completa perfil basico (nombre, email, nivel, tema).
2. Inicia sesion de practica.
3. Responde turnos; cada turno se analiza con IA en backend.
4. Se guarda feedback por turno en base de datos.
5. Al cerrar sesion se dispara regla central:
	- actualiza skill_progress
	- genera generated_test de seguimiento
6. Se muestra resumen visual final.

Para que este flujo sea real por texto, el backend necesita OPENAI_API_KEY y endpoint api/conversation/analyze-turn activo.

## Recursos CRUD soportados

- users
- topics
- skills
- questions
- conversation-sessions
- conversation-feedback
- generated-tests
- test-answers
- skill-progress

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notas

1. Este frontend prioriza validacion funcional del MVP y experiencia base del alumno.
2. Para entrar como admin, configura ADMIN_EMAIL y ADMIN_PASSWORD en backend .env.
3. El flujo alumno actual es publico por diseno de MVP y no requiere credenciales backend.
