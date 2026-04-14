# Play-Learn API (NestJS + Prisma)

Backend del MVP de Play-Learn.

## Estado actual

### Implementado

1. API modular CRUD para usuarios, temas, skills, sesiones, feedback, preguntas, tests y progreso.
2. Validacion global con DTO y class-validator.
3. Swagger activo en docs.
4. Auth JWT con roles y endpoint auth/login (login por credenciales para admin).
5. Regla central Sprint 1 al completar sesion:
   - actualiza skill_progress
   - genera generated_test de seguimiento
6. Analisis conversacional por texto con IA en endpoint dedicado.

### Pendiente para cierre MVP completo

1. STT/voz real y pipeline de audio.
2. Pulido auth end to end en todos los flujos de alumno.
3. Suite e2e completa para RF1 y RF2.
4. Telemetria de costo/latencia de IA.

## Auth (JWT + roles)

POST api/auth/login

Credenciales por entorno:

```bash
ADMIN_EMAIL=admin@playlearn.app
ADMIN_PASSWORD=admin123
JWT_SECRET=playlearn-dev-secret
JWT_EXPIRES_IN=12h
```

Reglas actuales:

1. Login por credenciales se usa solo para admin.
2. Endpoints CRUD admin requieren rol admin.
3. Endpoints usados por experiencia learner quedan publicos en esta fase MVP.
4. El front permite entrar a /learn sin credenciales desde el boton "Continuar como alumno".

### Siguiente fase recomendada (endurecimiento learner)

1. Crear auth learner real contra base de datos (`register/login learner`).
2. Emitir JWT learner con `sub=userId` y aplicar ownership por recurso.
3. Reemplazar endpoints publicos de learner por endpoints autenticados.
4. Agregar endpoint `GET /users/me` para evitar `GET /users` publico.
5. Cubrir aislamiento de datos con pruebas e2e multiusuario.

## Endpoint IA de conversacion (texto)

POST api/conversation/analyze-turn

Hace lo siguiente por turno:

1. Envia el mensaje del alumno al modelo IA.
2. Recibe respuesta del coach.
3. Recibe feedback pedagogico estructurado.
4. Guarda feedback en conversation_feedback.
5. Devuelve scores por turno: fluency, pronunciation, grammar.

Variables en env (modo hibrido):

```bash
# Cloud (OpenAI u otro proveedor remoto):
OPENAI_API_KEY=tu_api_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# Local (Ollama/LM Studio OpenAI-compatible):
OPENAI_API_KEY=local-dev
OPENAI_MODEL=llama3.2
OPENAI_BASE_URL=http://localhost:11434/v1
```

Regla aplicada por backend:

1. Si OPENAI_BASE_URL apunta a localhost, la key real no es obligatoria.
2. Si OPENAI_BASE_URL es remoto, OPENAI_API_KEY si es obligatoria.

## Setup

1. Instalar dependencias:

```bash
npm install
```

2. Configurar entorno:

```bash
Copy-Item .env.example .env
```

3. Ajustar DATABASE_URL y configurar IA en .env (cloud o local).

4. Generar cliente Prisma:

```bash
npm run prisma:generate
```

## Ejecutar

```bash
npm run start:dev
```

Base local esperada: http://localhost:3000
Prefijo global API: /api
Swagger: /docs

## Scripts utiles

```bash
npm run build
npm run start:dev
npm run prisma:generate
npm run prisma:push
npm run test
npm run test:e2e
```

## Notas tecnicas importantes

1. Prisma 7 usa adapter postgres en PrismaService.
2. El schema de esta base usa varchar con checks para estados/niveles.
3. Si falla autenticacion DB, revisar DATABASE_URL y credenciales locales de PostgreSQL.

## Alineacion con documento base

1. RF1 parcialmente cubierto en texto (sin voz).
2. RF2 parcialmente cubierto con generacion de test de seguimiento.
3. Arquitectura monolito modular alineada con fase MVP recomendada.
