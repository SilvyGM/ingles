# Documento Base del Proyecto: Play-Learn

Version: 1.2
Fecha: 2026-04-13
Estado: Base estrategica actualizada segun implementacion real del MVP

## 1. Resumen ejecutivo
Play-Learn sera una plataforma web de aprendizaje de idiomas centrada en conversacion guiada por IA, feedback inmediato y evaluacion adaptativa.

Objetivo principal: cerrar la brecha entre aprender gramatica y usar el idioma en situaciones reales.

Hipotesis de producto: si el alumno recibe practica conversacional contextual + feedback breve y accionable + tests adaptados a sus errores reales, mejorara fluidez y retencion en menos tiempo que con plataformas de ejercicios estaticos.

### Snapshot del estado actual (13-04-2026)
1. Backend NestJS + Prisma operativo con CRUD modular completo.
2. Frontend Next.js con panel admin y experiencia alumno separadas.
3. Login por credenciales activo para admin; acceso alumno publico en fase MVP.
4. Conversacion de alumno en modo abierto (sin limite fijo de turnos), con cierre manual de sesion.
5. Analisis conversacional IA por texto activo, con opcion de simulacion (`USE_MOCK_AI=true`).
6. Generacion de test de seguimiento y actualizacion de skill progress activas al cerrar sesion.
7. Flujo de resolucion de test adaptativo en cliente aun pendiente (questions/test-answers).

## 2. Vision y propuesta de valor
### Vision
Convertirse en la plataforma de referencia para practicar ingles en contextos reales, con una experiencia tipo juego que premie constancia y progreso real.

### Propuesta de valor diferencial
1. Conversaciones por escenarios reales (aeropuerto, entrevista, restaurante).
2. Feedback en tiempo real sin romper el flujo de la conversacion.
3. Tests dinamicos generados segun errores del usuario.
4. Gamificacion que premia practica consistente, no solo respuestas correctas.

## 3. Analisis critico del enfoque
### Fortalezas
1. El problema que resuelve es claro y relevante.
2. El enfoque adaptativo tiene alto potencial de retencion.
3. La mezcla de voz + IA + juego es diferenciadora si se ejecuta bien.

### Riesgos reales (sin maquillar)
1. Latencia de voz: lograr feedback util en <2 segundos es dificil si todo depende de servicios externos.
2. Calidad del feedback: detectar errores foneticos de forma precisa requiere datos y validacion continua.
3. Complejidad temprana: microservicios desde dia 1 puede frenar al equipo.
4. Costo IA: STT + LLM por sesion puede crecer rapido sin control.
5. Privacidad: manejo de voz y transcripciones exige gobernanza estricta.

### Decisiones estrategicas recomendadas
1. Empezar con monolito modular y extraer microservicios por necesidad real.
2. Priorizar latencia y confiabilidad sobre sofisticacion del modelo en MVP.
3. Medir impacto pedagogico desde el primer sprint con KPIs claros.
4. Adoptar NestJS como base backend si el objetivo es crecer con orden, sockets, auth y modulos de negocio bien separados.

## 4. Usuario objetivo y casos de uso
### Segmento inicial
1. Adultos jovenes (18-35) con nivel A1-B1.
2. Objetivo: mejorar speaking para trabajo/estudio.
3. Uso principal en movil durante sesiones cortas (10-20 min).

### Jobs-to-be-done
1. "Quiero practicar hablar sin miedo a equivocarme".
2. "Quiero feedback claro sobre que mejorar hoy".
3. "Quiero sentir progreso real semana a semana".

## 5. Requerimientos funcionales
### RF1: Practica de conversacion con IA
Flujo base:
1. Usuario elige tema.
2. Inicia sesion conversacional en texto.
3. Envia turnos libres y recibe respuesta del coach + feedback puntual.
4. Motor de analisis evalua gramatica, vocabulario y fluidez por turno.
5. Usuario finaliza manualmente y recibe resumen de sesion.

Criterios de aceptacion MVP:
1. El usuario puede sostener una conversacion abierta y cerrarla cuando lo decida.
2. Recibe al menos 1 sugerencia clara por turno.
3. Se guarda transcripcion y puntaje de sesion.

### RF2: Generador de tests dinamicos
Flujo base:
1. Sistema consulta historial de errores por habilidad.
2. Genera test adaptado (multiple choice + cloze en MVP).
3. Evalua respuestas y actualiza progreso.

Criterios de aceptacion MVP:
1. Al cerrar sesion se genera instancia de test de seguimiento segun debilidades detectadas.
2. Se actualiza skill_progress con el resultado de la sesion.
3. La resolucion completa por reactivo en cliente queda como siguiente fase.

## 6. Requerimientos no funcionales
1. Latencia objetivo MVP: p95 < 3.5s (meta futura: <2s).
2. Disponibilidad MVP: 99.5% (objetivo fase madura: 99.9%).
3. Seguridad: cifrado en transito y reposo; control de acceso por roles.
4. Privacidad: consentimiento explicito para voz y politica de retencion.
5. Usabilidad: mobile-first, accesibilidad AA basica.

## 7. Arquitectura recomendada por fases
### Fase MVP (recomendada)
Arquitectura: monolito modular + servicios externos de IA.

Decision backend recomendada: NestJS.

Justificacion:
1. Permite separar dominios como conversacion, evaluacion, progreso, usuarios y gamificacion sin perder cohesion.
2. Da una estructura fuerte para escalar en equipo con controladores, servicios, DTOs, guards e interceptors.
3. Facilita integrar REST, WebSockets, colas y auth sin rehacer la base tecnica a mitad del proyecto.
4. Reduce el riesgo de que el backend se degrade rapidamente cuando aumenten las reglas de negocio.

Advertencia critica:
1. NestJS no debe usarse como excusa para sobrearquitectura temprana.
2. En MVP se recomienda una sola aplicacion Nest modular, no una red de microservicios.
3. La prioridad sigue siendo experiencia de usuario, latencia y calidad del feedback; el framework no resuelve eso por si solo.

Modulos:
1. Frontend Web (Next.js).
2. API Backend (NestJS).
3. Modulo Auth y Usuarios.
4. Modulo Conversacion.
5. Modulo Evaluacion Adaptativa.
6. Modulo Progreso y Gamificacion.
7. Modulo Integraciones IA (texto) y proveedor mock.

Infra:
1. PostgreSQL para datos principales.
2. Redis para sesion/colas cortas/cache (fase de endurecimiento).
3. Storage de audio (S3 compatible) para fase de voz.
4. WebSockets para feedback en tiempo real (fase de escalado).

Stack backend sugerido:
1. NestJS como framework principal.
2. Prisma como ORM recomendado por velocidad de desarrollo, tipado y claridad de schema.
3. Redis para cache, rate limiting y trabajos de corta duracion.
4. BullMQ o sistema equivalente para colas asincronas si crece el procesamiento.

### Fase Escalado
Separar a microservicios cuando haya evidencia:
1. Servicio de Conversacion.
2. Servicio de Tests.
3. Servicio de Progreso/Gamificacion.
4. API Gateway y eventos asincronos.

Criterios para separar servicios:
1. Cuellos de botella medibles por modulo.
2. Necesidad de escalado independiente sostenida.
3. Equipos trabajando en dominios con ciclos de despliegue distintos.
4. Coste operativo justificado por volumen o complejidad.

### Estructura recomendada en NestJS
1. modules/auth
2. modules/users
3. modules/topics
4. modules/conversation
5. modules/feedback
6. modules/tests
7. modules/progress
8. modules/gamification
9. modules/integrations
10. common

Principio de implementacion:
1. Cada modulo expone su API, su servicio y su capa de acceso a datos.
2. La logica de negocio debe vivir en servicios y no en controladores.
3. Las integraciones externas de IA y STT deben aislarse para permitir cambiar de proveedor sin romper el dominio.

## 8. Modelo de datos base (entidades)
1. users: perfil, nivel_idioma, xp_total, racha_actual.
2. topics: escenarios de conversacion.
3. convo_sessions: usuario, tema, transcripcion, puntaje_fluidez, audio_url.
4. voice_feedback: errores por sesion (gramatica/pronunciacion/semantica).
5. questions: banco de reactivos por nivel, tipo y habilidad.
6. generated_tests: instancia de test por usuario.
7. test_answers: respuestas, resultado, feedback.
8. skill_progress: maestria por habilidad/tema (0-100).
9. achievements y user_achievements: logros y desbloqueos.

## 9. Ideas creativas de alto impacto
1. Modo "Roleplay Director": el sistema cambia el guion segun emociones detectadas en el habla (pausas, dudas, seguridad).
2. "Boss Battles" semanales: retos de conversacion con tiempo limite y objetivos linguisticos.
3. "Shadow Mode": repetir frases de nativos con scoring de ritmo y entonacion.
4. "Error Replay": al final de la sesion, mini-resumen con 3 errores recurrentes y correccion guiada.
5. "Career Tracks": rutas por profesion (soporte, ventas, ingenieria, salud) con vocabulario contextual.
6. "Duelo amistoso": retos asincronos entre amigos con foco en constancia, no humillacion por puntaje.

## 10. Roadmap validado (voz al final)
### Fase 1 (cerrar MVP actual)
1. Estabilizar flujo alumno de conversacion abierta + cierre manual.
2. Completar UX de resumen y mensajes de estado/error.
3. Consolidar modo mock IA para demos y contingencias.
4. Endurecer QA funcional en rutas `login`, `learn` y `dashboard`.

### Fase 2 (cerrar ciclo adaptativo)
1. Implementar resolucion de test adaptativo en cliente (`questions` + `test-answers`).
2. Calificacion final de test y feedback por reactivo.
3. Refinar actualizacion de `skill_progress` con evidencia de test.
4. Completar cobertura E2E de RF1/RF2.

### Fase 3 (seguridad y producto)
1. Migrar auth learner de publico a JWT con ownership por `userId`.
2. Agregar endpoints `users/me` y restricciones de acceso por rol.
3. Incluir telemetria de aprendizaje y embudo de conversion.
4. Activar base de gamificacion (racha, XP, logros iniciales).

### Fase 4 (diferenciacion)
1. Roleplay avanzado por escenarios y prompts adaptativos.
2. Experimentos A/B de engagement y personalizacion.
3. Optimizacion de costo/latencia de IA en produccion.

### Fase 5 (ultima prioridad): voz
1. Captura de audio en cliente + STT robusto.
2. Evaluacion de pronunciacion y prosodia.
3. Politicas de privacidad y retencion de audio en entorno productivo.
4. Escalado de infraestructura especifica de voz.

## 11. KPIs de producto y tecnica
### Producto
1. D7 retention.
2. Minutos hablados por usuario/semana.
3. Tasa de finalizacion de sesiones.
4. Mejora de skill_progress por mes.

### Tecnica
1. Latencia p50/p95 de feedback.
2. Error rate STT/NLP.
3. Costo IA por usuario activo mensual.
4. Disponibilidad y tiempo de recuperacion.

## 12. Estrategia de calidad
1. Tests unitarios para reglas de evaluacion y scoring.
2. Tests de contrato API.
3. Pruebas E2E de flujo completo RF1/RF2.
4. Dataset de casos linguisticos para regresion.
5. Revision humana periodica del feedback IA.

## 13. Seguridad y cumplimiento
1. Consentimiento explicito para captura de voz.
2. Politica de retencion configurable (ej. 30/90 dias).
3. Derecho de borrado de datos del usuario.
4. Cifrado AES-256 en reposo y TLS en transito.
5. Registro de auditoria para accesos a datos sensibles.

## 14. Alcance fuera de MVP (no hacer aun)
1. Pronunciacion ultra-fina por fonema en todos los acentos.
2. Multi-idioma completo simultaneo.
3. Ranking global competitivo complejo.
4. Modo offline con IA local.

## 15. Plan de ejecucion inmediato
1. Cerrar flujo adaptativo en cliente (resolver test generado con questions/test-answers).
2. Ejecutar E2E de RF1/RF2 sobre estado actual para evitar regresiones.
3. Endurecer auth learner con JWT y ownership como siguiente release.
4. Definir metricas operativas minimas: latencia IA, costo por sesion, tasa de finalizacion.
5. Planificar fase de gamificacion basica antes de iniciar voz.
6. Mantener voz fuera del siguiente release y tratarla como fase de diferenciacion final.

## 16. Recomendacion tecnica sobre NestJS
NestJS es una eleccion fuerte para Play-Learn porque el proyecto no solo necesita exponer endpoints: necesita organizar reglas de negocio, tiempo real, autenticacion, progreso adaptativo e integraciones con IA.

No es la opcion mas ligera para validar una idea en dos dias, pero si es una base mucho mas seria para un producto que quiere escalar sin convertirse en un backend desordenado.

Postura recomendada:
1. Si el objetivo es construir un MVP con vocacion real de producto, NestJS es una decision correcta.
2. Si el objetivo fuera solo validar una demo muy pequeña, podria usarse algo mas simple.
3. Para este proyecto, la mejor relacion entre orden y velocidad la ofrece NestJS como monolito modular.

## 17. Conclusiones
Play-Learn tiene potencial real de producto si evita sobreingenieria temprana y se enfoca en experiencia: baja latencia, feedback util y progreso visible.

La ventaja competitiva no sera "usar IA", sino convertir esa IA en una rutina diaria de aprendizaje que sea efectiva, medible y motivante.

Elegir NestJS fortalece esa apuesta siempre que se use con disciplina: modulos claros, una sola aplicacion al inicio y decisiones de escalado basadas en evidencia, no en moda arquitectonica.

## 18. Artefactos del MVP
1. Modelo entidad-relacion del MVP disponible en [Modelo_Entidad_Relacion_MVP_Play-Learn.md](Modelo_Entidad_Relacion_MVP_Play-Learn.md).
2. Script SQL base PostgreSQL disponible en [play_learn_mvp_postgres.sql](play_learn_mvp_postgres.sql).
3. Seed inicial PostgreSQL disponible en [play_learn_mvp_seed.sql](play_learn_mvp_seed.sql).
