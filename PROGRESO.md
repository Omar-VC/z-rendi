# Progreso — Guardar lo que el atleta realmente hizo

## Estado: En desarrollo (rama nueva, nada commiteado aún)

### Archivos creados
| Archivo | Qué hace |
|---------|----------|
| `src/features/admin/seguimiento/types/registroEjercicio.ts` | Tipos `SerieRealizada`, `EjercicioRealizado`, `RegistroEjercicio` (con `preparadorId`, `mejorPeso`, `volumen`, `e1RM`). |
| `src/features/admin/seguimiento/services/registrosEjercicio.service.ts` | `crearRegistrosEjercicio(batch, ...)` — calcula `mejorPeso`, `volumen`, `e1RM` (fórmula Epley) y agrega docs al batch. `obtenerUltimoRegistroEjercicio(clienteId, ejercicioId)` — query por cliente + ejercicio, fecha desc, limit 1. |
| `src/features/admin/seguimiento/hooks/useUltimoRegistroEjercicio.ts` | Hook que devuelve `{ registro, loading }` para el último registro de un ejercicio en un atleta. |

### Archivos modificados
| Archivo | Qué cambia |
|---------|------------|
| `src/features/admin/seguimiento/types/ejercicioSesion.ts` | Agregó `seriesObjetivo?`, `repsObjetivo?`, `pesoSugerido?` (opcionales). |
| `src/features/admin/seguimiento/types/seguimiento.ts` | Agregó `bloquesRealizados?`, `sesionPendienteId?`, `duracionPlanificada?`. |
| `src/features/admin/seguimiento/services/sesionesPendientes.service.ts` | `completarSesionPendiente` ahora usa `writeBatch` atómico: escribe doc en `sesiones` con el **mismo ID de la pendiente**, incluye `mes`/`anio`, crea registros de ejercicio, borra la pendiente al final. |
| `src/features/admin/seguimiento/services/seguimientoService.ts` | Agregó `suscribirseUltimaSesionCliente` con `onSnapshot`, sin filtro de mes. |
| `src/features/usuario/dashboard/components/CompletarSesionModal.tsx` | UI para cargar series (reps/peso) por ejercicio, duración editable, envía `ejerciciosRealizados` y `duracionPlanificada`. |
| `src/features/usuario/dashboard/pages/ClienteDashboard.tsx` | Pasa `clienteId` y `preparadorId` al modal; reenvía `ejerciciosRealizados` y `duracionPlanificada` al service. |
| `src/features/usuario/dashboard/hooks/useUltimaSesion.ts` | Usa `suscribirseUltimaSesionCliente` del service en lugar de consulta directa a Firestore. |

### Completado
- `firestore.indexes.json` (raíz): índices existentes exportados + nuevo índice `registrosEjercicio` (clienteId ASC, ejercicioId ASC, fecha DESC).
- `firebase.json`: agregada sección `firestore.indexes` referenciando a `firestore.indexes.json`.

### Completado
- Compilación TypeScript (`tsc --noEmit`): sin errores.
- Probar comportamiento manualmente (pendiente, requiere Firebase emulator o proyecto real).
