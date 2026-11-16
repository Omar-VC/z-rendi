# AUDITORÍA — Flujo "Asignar Sesión a un Atleta"

**Proyecto:** Z-RENDI  
**Rama:** `pruebas` (commit `89f225a`)  
**Fecha:** 16/11/2026  
**Modo:** Solo lectura (ningún archivo modificado)  
**Alcance:** `src/features/admin/seguimiento/**`, `src/features/admin/asistencia/**`, `src/features/admin/biblioteca/pruebas/**`, `src/features/usuario/dashboard/components/CompletarSesionModal.tsx` y hooks relacionados, `src/types/seguimiento.ts` y `src/features/admin/seguimiento/types/seguimiento.ts`.

---

## 1. FLUJO ACTUAL DE ASIGNACIÓN (paso a paso)

### 1.1. ¿Qué componente abre el modal?

- **`SesionesPendientesPanel.tsx`** (`src/features/admin/seguimiento/components/SesionesPendientesPanel.tsx`)
  - Renderiza el botón `+ Asignar Sesión` (línea ~74-80).
  - Al hacer clic, abre `NuevaSesionPendienteModal` (línea ~166-172).
- `SesionesPendientesPanel` es invocado desde **`SeguimientoPanel.tsx`** (`src/features/admin/seguimiento/components/SeguimientoPanel.tsx`, líneas ~46-49), que se monta en `ClienteDetailV2.tsx` (tab "seguimiento", línea ~171).

### 1.2. ¿Qué datos recibe el modal?

**`NuevaSesionPendienteModal`** (`src/features/admin/seguimiento/components/NuevaSesionPendienteModal.tsx`) recibe por Props:
- `clienteId: string`
- `onClose: () => void`
- `onGuardado: () => void`

Internamente obtiene:
- `preparadorId` de `useAuth()` (usuario autenticado).
- `libros` de `useTrainingBooks(preparadorId)` (biblioteca de libros de entrenamiento).
- `ejercicios` de `useExercises(preparadorId)` (catálogo de ejercicios).
- Historial reciente: `obtenerUltimasSesionesCliente(clienteId, 3)` para clonar la última sesión como plantilla.

### 1.3. ¿Qué campos guarda?

Campos del formulario en `NuevaSesionPendienteModal`:
- `libroId` (string) — libro seleccionado.
- `fecha` (string ISO) — fecha de la sesión.
- `objetivo` (string) — objetivo de la sesión.
- `observaciones` (string) — indicaciones generales del preparador.
- `bloques: BloqueSesion[]` — cada bloque tiene:
  - `id`, `nombre`, `duracion` (number), `ejercicios: EjercicioSesion[]`
  - Cada ejercicio: `ejercicioId`, `nombre`, `repeticiones` (string), `pausa` (string), `indicaciones` (string).

Al guardar, llama a **`crearSesionPendiente(payload)`** (`src/features/admin/seguimiento/services/sesionesPendientes.service.ts`) que escribe en Firestore con:
- `estado: "pendiente"`
- `createdAt: new Date()`
- Resto de campos del payload (`clienteId`, `preparadorId`, `fecha`, `libroId`, `libroNombre`, `gruposMusculares`, `bloques`, `objetivo`, `observacionesPreparador`).

### 1.4. Colección y documento de Firestore (ruta exacta)

- **Colección:** `sesionesPendientes` (const `SESIONES_COLLECTION` en `sesionesPendientes.service.ts`, línea 20).
- **Documento:** auto-generado por `addDoc` (ID aleatorio de Firestore).
- **Ruta:** `/sesionesPendientes/{docId}`.

### 1.5. Esquema usado al guardar

Tipo `SesionPendiente` (`src/features/admin/seguimiento/types/sesionPendiente.ts`):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | ID del documento Firestore |
| `clienteId` | string | |
| `preparadorId` | string | UID del preparador (auth) |
| `fecha` | Date | |
| `estado` | `"pendiente" \| "completada"` | Al crear se fuerza `"pendiente"` |
| `libroId` | string | |
| `libroNombre` | string | |
| `gruposMusculares` | `GrupoMuscular[]` | |
| `bloques` | `BloqueSesion[]` | Ver tipo `bloqueSesion.ts` |
| `objetivo` | string | |
| `observacionesPreparador?` | string | |
| `duracion?` | number | Se completa al finalizar (cliente) |
| `rpe?` | number | Se completa al finalizar (cliente) |
| `carga?` | number | Se completa al finalizar (cliente) |
| `observacionesCliente?` | string | Se completa al finalizar (cliente) |
| `createdAt` | Date | |


---

## 2. MODELO DE DATOS EN FIRESTORE (colecciones y subcolecciones)

No se detectaron subcolecciones. Todas son colecciones de nivel superior.

### 2.1. `sesionesPendientes` — Sesiones asignadas pendientes de completar

Esquema: `SesionPendiente` (`src/features/admin/seguimiento/types/sesionPendiente.ts`). Ver sección 1.5.

### 2.2. `sesiones` — Sesiones completadas (historial)

Esquema: `SesionEntrenamiento` (`src/features/admin/seguimiento/types/seguimiento.ts`):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | |
| `clienteId` | string | |
| `preparadorId` | string | |
| `fecha` | Date | |
| `mes` | number | Mes (1-12) |
| `anio` | number | Año |
| `libroId` | string | |
| `libroNombre` | string | |
| `gruposMusculares?` | string[] | |
| `ejercicios?` | string[] | Solo IDs de ejercicios (sin peso/series/reps reales) |
| `duracion` | number | Minutos |
| `rpe` | number | Esfuerzo percibido (1-10) |
| `carga` | number | Carga calculada (sRPE = duración × RPE) |
| `observaciones?` | string | |
| `createdAt?` | Date | |
| `updatedAt?` | Date | |

**Servicio:** `seguimientoService.ts` — const `COLLECTION = "sesiones"`. Ruta: `/sesiones/{docId}`.

**Nota importante:** Al completar una sesión pendiente (`completarSesionPendiente`), el servicio **crea un nuevo documento en `sesiones` con `createdAt: new Date()` y luego ELIMINA el documento de `sesionesPendientes`** (líneas ~179-182 de `sesionesPendientes.service.ts`). No se conserva el detalle de bloques/ejercicios realizados en el documento de `sesiones` — solo se guarda `duracion`, `rpe`, `carga` y `observacionesCliente`.

### 2.3. `barrerasProgreso` — Barreras / objetivos de progreso

Esquema: `Barrera` (`src/features/admin/seguimiento/types/barrera.ts`):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | |
| `clienteId` | string | |
| `preparadorId` | string | |
| `pruebaId?` | string | Referencia a `physicalTests` |
| `nombre` | string | Nombre de la prueba |
| `categoria?` | string | Ej: "Fuerza" |
| `subcategoria?` | string | Ej: "Superior" |
| `unidad?` | string | Ej: "kg", "seg" |
| `objetivo` | string | Meta a alcanzar |
| `resultado?` | string | Resultado registrado |
| `estado` | `"pendiente" \| "superada"` | |
| `observaciones?` | string | |
| `historial?` | `HistorialBarrera[]` | Array embebido |
| `createdAt?` | any | |
| `updatedAt?` | any | |

`HistorialBarrera`:
| Campo | Tipo |
|---|---|
| `fecha` | string |
| `objetivo` | string |
| `resultado` | string |
| `observaciones?` | string |

**Servicio:** `barrerasService.ts` — const `COLLECTION = "barrerasProgreso"`. Ruta: `/barrerasProgreso/{docId}`.

### 2.4. `asistencias` — Registro de asistencia

Esquema: `Asistencia` (`src/features/admin/asistencia/types/asistencia.types.ts`):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | |
| `clienteId` | string | |
| `fecha` | string | Formato YYYY-MM-DD |
| `estado` | `"presente" \| "falta"` | |
| `frecuenciaSemanalMes` | number | |
| `createdAt?` | string | |

**Servicio:** `asistenciaService.ts` — const `ASISTENCIAS_COLLECTION = "asistencias"`. Ruta: `/asistencias/{docId}`.

### 2.5. `physicalTests` — Biblioteca de pruebas físicas

Esquema: `PhysicalTest` (`src/features/admin/biblioteca/pruebas/types/physicalTest.ts`):

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | |
| `preparadorId` | string | |
| `nombre` | string | |
| `categoria` | `"Fuerza" \| "Potencia" \| "Velocidad" \| "Resistencia" \| "Movilidad"` | |
| `subcategoria` | `"Superior" \| "Inferior" \| "General"` | |
| `unidad` | string | |
| `createdAt?` | any | |
| `updatedAt?` | any | |

**Servicio:** `physicalTestsService.ts` — const `COLLECTION = "physicalTests"`. Ruta: `/physicalTests/{docId}`.

### 2.6. Colecciones fuera del alcance directo pero relacionadas

- `sesionesPlantel` (módulo `planteles`, colección separada de `sesiones`) — usada por `planteles/services/sesiones.service.ts`. Es un modelo distinto de `SesionEntrenamiento` (ver duplicados en punto 6).


---

## 3. CARGA (cargaUtils.ts)

### 3.1. Archivo

**`src/features/admin/seguimiento/utils/cargaUtils.ts`**

### 3.2. Funciones

| Función | Umbrales | Texto | Variant |
|---|---|---|---|
| `obtenerEstadoCargaSesion(carga)` | `<= 250` | Baja | `success` |
| | `<= 500` | Moderada | `warning` |
| | `> 500` | Alta | `danger` |
| `obtenerEstadoCargaSemanal(carga)` | `<= 1000` | Baja | `success` |
| | `<= 2000` | Moderada | `warning` |
| | `> 2000` | Alta | `danger` |

### 3.3. Fórmula de cálculo

En **`CompletarSesionModal.tsx`** (línea 38):
```
carga = (rpeSeleccionado || 0) * duracionTotal
```
En **`ClienteDashboard.tsx`** (línea 95):
```
const carga = datos.duracion * datos.rpe;
```
Es decir: **sRPE = duración (min) × RPE (1-10)**. Unidad: **UA** (Unidades Arbitrarias).

### 3.4. Ventanas de tiempo

- **Semanal:** `CargaResumen.tsx` y `CargaSemanalCard.tsx` filtran con `estaEnSemanaActual(sesion.fecha)` (util `fechaUtils`).
- **Mensual:** `CargaResumen.tsx` filtra por `mes === hoy.getMonth() && anio === hoy.getFullYear()`.

### 3.5. ¿Existe RPE / esfuerzo percibido / volumen / tonelaje?

| Métrica | ¿Existe? | Dónde |
|---|---|---|
| RPE (esfuerzo percibido 1-10) | **Sí** | `SesionEntrenamiento.rpe`, `SesionPendiente.rpe`, capturado en `CompletarSesionModal` |
| Volumen (series × reps × peso) | **No** | `EjercicioSesion.repeticiones` es `string` (ej: "4 x 10"), no hay campo de peso |
| Tonelaje | **No** | No hay cálculo |
| Carga (sRPE) | **Sí** | `carga = duracion × rpe` |

### 3.6. ¿El cliente lo registra al completar la sesión?

**Sí.** En `CompletarSesionModal` el cliente selecciona RPE (1-10) y escribe observaciones. La duración se calcula automáticamente sumando los `duracion` de los bloques (`sesion.bloques.reduce(...)`). La carga se deriva (`duracion × rpe`). Todo se envía a `completarSesionPendiente` desde `ClienteDashboard.tsx` (líneas ~94-102).

---

## 4. PROGRESIÓN DE LEVANTAMIENTOS

### 4.1. ¿Dónde se guarda el historial de pesos/reps/series por ejercicio y atleta?

**No existe un historial dedicado de pesos/reps/series por ejercicio y atleta.**

- `EjercicioSesion` (`src/features/admin/seguimiento/types/ejercicioSesion.ts`):
  | Campo | Tipo |
  |---|---|
  | `ejercicioId` | string |
  | `nombre` | string |
  | `repeticiones?` | string |
  | `pausa?` | string |
  | `indicaciones?` | string |

- `SesionEntrenamiento.ejercicios?` es `string[]` (solo IDs de ejercicios, sin peso ni series reales).
- Al completar la sesión, `completarSesionPendiente` solo guarda `duracion`, `rpe`, `carga` y `observacionesCliente` en `sesiones`. **Los bloques y ejercicios con sus repeticiones/pausa no se persisten en la sesión completada.**

### 4.2. ¿Qué calcula `ProgresionPanel`?

**`ProgresionPanel.tsx`** (`src/features/admin/seguimiento/components/ProgresionPanel.tsx`) **no calcula nada.** Solo compone dos sub-paneles:
- `BarrerasPanel` (muestra barreras y su historial)
- `IndicadoresPanel` (muestra la mejor barrera superada por categoría: Fuerza, Velocidad, Resistencia, Potencia)

No calcula:
- ❌ 1RM estimado
- ❌ Tendencia de carga
- ❌ PRs (máximos personales)
- ❌ Volumen por ejercicio

### 4.3. ¿Se puede obtener "la última vez que hizo el ejercicio X con qué peso"?

**No.** No hay campo de peso por ejercicio ni una colección que relacione atleta + ejercicio + peso + fecha. Únicamente se puede obtener la última sesión completa del atleta (`useUltimaSesion` / `obtenerUltimasSesionesCliente`), pero no el detalle ejercicio por ejercicio con cargas reales.

---

## 5. BARRERAS (modelo completo)

### 5.1. Tipo `Barrera` (`src/features/admin/seguimiento/types/barrera.ts`)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | string | |
| `clienteId` | string | |
| `preparadorId` | string | |
| `pruebaId?` | string | FK a `physicalTests` |
| `nombre` | string | |
| `categoria?` | string | |
| `subcategoria?` | string | |
| `unidad?` | string | |
| `objetivo` | string | |
| `resultado?` | string | |
| `estado` | `"pendiente" \| "superada"` | `EstadoBarrera` |
| `observaciones?` | string | |
| `historial?` | `HistorialBarrera[]` | Array embebido |
| `createdAt?` | any | |
| `updatedAt?` | any | |

### 5.2. Estados

- `pendiente`: creada, sin evaluar.
- `superada`: evaluada y cumplida.

### 5.3. Evaluación e historial

- Al evaluar (`actualizarBarrera` en `barrerasService.ts`), si se pasa `resultado`, se empuja un registro al `historial` con `{fecha, objetivo, resultado, observaciones}` y se actualizan los campos de la barrera.
- Al crear nuevo objetivo (`guardarNuevoObjetivo`), se resetea `estado: "pendiente"`, `resultado: ""`, `observaciones: ""` y se empuja el registro anterior al historial.

### 5.4. ¿Cómo consultarse "barreras activas de un atleta"?

- Hook: `useBarreras(clienteId)` (`src/features/admin/seguimiento/hooks/useBarreras.ts`) — llama a `obtenerBarreras(clienteId)` que queryea `barrerasProgreso` filtrando por `clienteId`.
- Barreras activas = aquellas con `estado !== "superada"` (filtrado en componente, ej: `ObjetivosCard.tsx` línea 25-26).
- Ruta Firestore: `/barrerasProgreso` con filtro `where("clienteId", "==", clienteId)`.
- **No hay consulta nativa por `estado`**; se traen todas y se filtra en memoria.


---

## 6. DUPLICADOS Y DEUDA TÉCNICA

### 6.1. Tipos duplicados

| Duplicado | Archivo A | Archivo B | Diferencia clave |
|---|---|---|---|
| `SesionEntrenamiento` | `src/features/admin/seguimiento/types/seguimiento.ts` | `src/features/admin/planteles/types/plantel.ts` | En plantel: `fecha: string` (YYYY-MM-DD), `equipoId`, `bloques: BloqueSesion[]` con `categoria`, `duracionMinutos`, `orden`, `completada`. En seguimiento: `fecha: Date`, `mes`, `anio`, `libroId`, `rpe`, `carga`. |
| `BloqueSesion` | `src/features/admin/seguimiento/types/bloqueSesion.ts` | `src/features/admin/planteles/types/plantel.ts` | En seguimiento: `id`, `nombre`, `duracion`, `ejercicios: EjercicioSesion[]`. En plantel: `id?`, `titulo`, `categoria` (enum), `duracionMinutos`, `descripcion`, `ejercicios?: string[]`, `orden`. |
| `Atleta` | `src/types/seguimiento.ts` | (implícito) `Cliente` en `src/features/admin/clientes/types` | `Atleta` en types raíz tiene campos antropométricos; `Cliente` es distinto. |
| `Registro` | `src/types/seguimiento.ts` | — | Tipo `Registro` con `rpe`, `carga`, `fuerzaPress`, etc. No parece usado en el flujo de sesiones. |

**Nota:** El usuario mencionó `plantel.types.ts` pero **ese archivo no existe** en el códigobase. El duplicado real es `planteles/types/plantel.ts`.

### 6.2. Componentes repetidos

| Componente | Ruta A | Ruta B |
|---|---|---|
| `UltimaSesionCard` | `src/features/admin/seguimiento/components/UltimaSesionCard.tsx` | `src/features/usuario/dashboard/components/UltimaSesionCard.tsx` |
| `ClienteHeader` | `src/features/admin/clientes/components/ClienteHeader.tsx` | `src/features/usuario/dashboard/components/ClienteHeader.tsx` |

Ambos pares tienen propósitos similares (mostrar última sesión / cabecera de atleta) pero son implementaciones separadas y no comparten código.

### 6.3. Código muerto o sin usar (indicios)

- `src/types/seguimiento.ts` exporta `Atleta`, `RegistroTipo`, `Registro` — no se observó uso de `Registro` ni `RegistroTipo` en los módulos de seguimiento revisados. Podría ser legado.
- `src/features/admin/seguimiento/types/seguimiento.ts` (`SesionEntrenamiento`) tiene `ejercicios?: string[]` que no se popula con detalle real de ejercicios (solo IDs).


---

## 7. ACOPLAMIENTO (llamadas directas a Firestore vs services)

### 7.1. Hooks que hacen llamadas DIRECTAS a Firestore (sin pasar por service)

| Hook | Archivo | Colección consultada | Problema |
|---|---|---|---|
| `useUltimaSesion` | `src/features/usuario/dashboard/hooks/useUltimaSesion.ts` | `sesiones` | Importa `db` y usa `collection`, `query`, `where`, `orderBy`, `limit`, `onSnapshot` directamente. Lógica de consulta duplicada de `obtenerSesionesCliente`. |

### 7.2. Hooks que usan service (bien acoplados)

| Hook | Archivo | Service usado |
|---|---|---|
| `useSeguimiento` | `seguimiento/hooks/useSeguimiento.ts` | `obtenerSesionesCliente` |
| `useSesionesPendientes` | `seguimiento/hooks/useSesionesPendientes.ts` | `suscribirseSesionesPendientes` |
| `useBarreras` | `seguimiento/hooks/useBarreras.ts` | `obtenerBarreras` |
| `useAsistencia` | `asistencia/hooks/useAsistencia.ts` | `obtenerAsistenciaMensual` |
| `useSesionDeHoy` | `usuario/dashboard/hooks/useSesionDeHoy.ts` | `obtenerSesionPendiente` |
| `useSesionesPendientesCliente` | `usuario/dashboard/hooks/useSesionesPendientesCliente.ts` | `suscribirseSesionesPendientesCliente` |
| `usePhysicalTests` | `biblioteca/pruebas/hooks/usePhysicalTests.ts` | `obtenerPruebas` |

### 7.3. Consultas repetidas entre hooks

1. **`useSesionesPendientes` vs `useSesionesPendientesCliente`**: ambas consultan la colección `sesionesPendientes` filtrando por `clienteId` y `estado == "pendiente"`. La primera añade filtro por `preparadorId`; la segunda no. Lógica de mapeo de documentos duplicada en el service (`suscribirseSesionesPendientes` y `suscribirseSesionesPendientesCliente` son casi idénticas).

2. **`useUltimaSesion` vs `obtenerSesionesCliente`**: ambas consultan la colección `sesiones` filtrando por `clienteId` y ordenando por `fecha` descendente. Una lo hace vía hook directo a Firestore, la otra vía service.


---

## 8. GAPS (datos que NO están disponibles hoy)

Para responder "¿en qué estado está el atleta?" se necesitarían datos que actualmente **no se registran**:

| Dato necesario para decidir la sesión | ¿Existe hoy? | Comentario |
|---|---|---|
| Peso real usado en cada ejercicio de la sesión | ❌ No | `EjercicioSesion.repeticiones` es `string`; no hay campo `peso` ni `series` numéricas |
| Series realizadas por ejercicio | ❌ No | No se guarda |
| Volumen de entrenamiento (series × reps × peso) | ❌ No | No se calcula |
| Tonelaje acumulado | ❌ No | No se calcula |
| 1RM estimado por ejercicio | ❌ No | No hay historial de cargas por ejercicio |
| Última vez que hizo el ejercicio X con qué peso | ❌ No | No hay relación atleta–ejercicio–peso–fecha |
| RPE por ejercicio (solo por sesión) | ⚠️ Parcial | RPE es a nivel de sesión, no por ejercicio |
| Relación entre sesión pendiente asignada y sesión completada (historial de bloques realizados) | ❌ No | Al completarse, la pendiente se borra y en `sesiones` solo se guarda resumen (duración, RPE, carga) |
| Carga aguda:crónica (ratio semanal/mensual) | ⚠️ Parcial | Se calcula carga semanal/mensual en `CargaResumen`, pero no el ratio ACWR |


---

## 9. TABLA FINAL: DATO NECESARIO PARA DECIDIR LA SESIÓN

| Dato necesario | ¿Existe? | Dónde | ¿Es fácil de consultar? |
|---|---|---|---|
| Sesiones pendientes asignadas al atleta | ✅ Sí | Colección `sesionesPendientes`, hook `useSesionesPendientes` / `useSesionesPendientesCliente` | Sí (snapshot en tiempo real) |
| Última sesión completada del atleta | ✅ Sí | Colección `sesiones`, hook `useUltimaSesion` (llamada directa a Firestore) | Sí, pero hook está acoplado a Firestore |
| Carga semanal del atleta | ✅ Sí | `CargaResumen` / `CargaSemanalCard` (cálculo en cliente sobre array de sesiones) | Sí (cálculo local) |
| Carga mensual del atleta | ✅ Sí | `CargaResumen` | Sí (cálculo local) |
| RPE de la última sesión | ✅ Sí | `SesionEntrenamiento.rpe` | Sí |
| Asistencia (presente/falta) del mes | ✅ Sí | Colección `asistencias`, hook `useAsistencia` | Sí |
| Barreras activas del atleta | ✅ Sí | Colección `barrerasProgreso`, hook `useBarreras` (filtro de `estado` en cliente) | Sí (pero filtra en memoria) |
| Peso usado en cada ejercicio (historial) | ❌ No | — | N/A |
| Volumen / tonelaje por ejercicio | ❌ No | — | N/A |
| 1RM estimado | ❌ No | — | N/A |
| Última vez que hizo ejercicio X con peso Y | ❌ No | — | N/A |
| RPE por ejercicio (no solo por sesión) | ❌ No | — | N/A |
| Relación bloque asignado vs bloque realizado | ❌ No | — | N/A |

---

## Evidencia de archivos revisados

| Archivo | Rol en la auditoría |
|---|---|
| `src/features/admin/seguimiento/components/SesionesPendientesPanel.tsx` | Abre `NuevaSesionPendienteModal`, lista sesiones pendientes |
| `src/features/admin/seguimiento/components/NuevaSesionPendienteModal.tsx` | Formulario de asignación (libro, fecha, objetivo, bloques, ejercicios) |
| `src/features/admin/seguimiento/services/sesionesPendientes.service.ts` | CRUD de `sesionesPendientes`, `completarSesionPendiente`, `obtenerUltimasSesionesCliente` |
| `src/features/admin/seguimiento/types/sesionPendiente.ts` | Tipo `SesionPendiente` |
| `src/features/admin/seguimiento/types/bloqueSesion.ts` | Tipo `BloqueSesion` |
| `src/features/admin/seguimiento/types/ejercicioSesion.ts` | Tipo `EjercicioSesion` |
| `src/features/admin/seguimiento/types/seguimiento.ts` | Tipo `SesionEntrenamiento` (sesiones completadas) |
| `src/features/admin/seguimiento/services/seguimientoService.ts` | Lectura de `sesiones` (colección `sesiones`) |
| `src/features/admin/seguimiento/utils/cargaUtils.ts` | Umbrales de carga (sesional y semanal) |
| `src/features/admin/seguimiento/components/CargaResumen.tsx` | Carga semanal/mensual agregada |
| `src/features/admin/seguimiento/components/CargaSemanalCard.tsx` | Carga semanal resumida |
| `src/features/admin/seguimiento/components/ProgresionPanel.tsx` | Compone `BarrerasPanel` + `IndicadoresPanel` (sin cálculos) |
| `src/features/admin/seguimiento/components/BarrerasPanel.tsx` | UI de barreras, historial, evaluar |
| `src/features/admin/seguimiento/hooks/useBarreras.ts` | Hook de barreras |
| `src/features/admin/seguimiento/types/barrera.ts` | Tipo `Barrera`, `HistorialBarrera`, `EstadoBarrera` |
| `src/features/admin/seguimiento/services/barrerasService.ts` | CRUD de `barrerasProgreso` |
| `src/features/admin/seguimiento/components/IndicadoresPanel.tsx` | Indicadores por categoría (mejor barrera superada) |
| `src/features/admin/seguimiento/components/UltimaSesionCard.tsx` (admin) | Tarjeta última sesión (admin) |
| `src/features/admin/seguimiento/components/RegistroSesiones.tsx` | Historial de sesiones completadas |
| `src/features/admin/seguimiento/hooks/useSeguimiento.ts` | Hook de sesiones completadas |
| `src/features/admin/asistencia/hooks/useAsistencia.ts` | Hook de asistencia (cálculo porcentaje) |
| `src/features/admin/asistencia/services/asistenciaService.ts` | CRUD de `asistencias` |
| `src/features/admin/asistencia/types/asistencia.types.ts` | Tipo `Asistencia`, `EstadoAsistencia` |
| `src/features/admin/biblioteca/pruebas/types/physicalTest.ts` | Tipo `PhysicalTest` |
| `src/features/admin/biblioteca/pruebas/services/physicalTestsService.ts` | CRUD de `physicalTests` |
| `src/features/admin/biblioteca/pruebas/hooks/usePhysicalTests.ts` | Hook de pruebas físicas |
| `src/features/admin/planteles/types/plantel.ts` | Duplicado de `SesionEntrenamiento` y `BloqueSesion` |
| `src/features/usuario/dashboard/components/CompletarSesionModal.tsx` | Modal cliente: RPE, observaciones, cálculo de carga |
| `src/features/usuario/dashboard/pages/ClienteDashboard.tsx` | Orquesta `CompletarSesionModal` + `completarSesionPendiente` |
| `src/features/usuario/dashboard/hooks/useUltimaSesion.ts` | Hook acoplado directamente a Firestore (colección `sesiones`) |
| `src/features/usuario/dashboard/hooks/useSesionDeHoy.ts` | Hook de sesión del día (vía service) |
| `src/features/usuario/dashboard/hooks/useSesionesPendientesCliente.ts` | Hook de sesiones pendientes del cliente |
| `src/features/usuario/dashboard/components/SesionDeHoyCard.tsx` | Tarjeta sesión de hoy (cliente) |
| `src/features/usuario/dashboard/components/UltimaSesionCard.tsx` (usuario) | Duplicado de UltimaSesionCard |
| `src/features/usuario/dashboard/components/ClienteHeader.tsx` | Duplicado de ClienteHeader |
| `src/features/admin/clientes/components/ClienteHeader.tsx` | Duplicado de ClienteHeader |
| `src/features/admin/clientes/pages/ClienteDetailV2.tsx` | Integra `SeguimientoPanel` en tab seguimiento |
| `src/types/seguimiento.ts` | Tipos `Atleta`, `Registro`, `RegistroTipo` (posible legado)

---

## 10. SECCIÓN ADICIONAL — DETALLES TÉCNICOS COMPLEMENTARIOS

### A. Campos que completa el atleta hoy en `CompletarSesionModal.tsx`, y cálculo de duración

**Archivo:** `src/features/usuario/dashboard/components/CompletarSesionModal.tsx`

El atleta completa exactamente dos campos:

| Campo | Tipo | Quién lo llena | Origen |
|---|---|---|---|
| `rpeSeleccionado` | `number \| null` (1-10) | Atleta (selector táctil 1-10) | Estado local del modal |
| `observaciones` | `string` | Atleta (textarea libre) | Estado local del modal |

**¿Cómo se calcula la duración?**

En el modal, la duración **no es ingresada por el atleta**, sino calculada automáticamente sumando los bloques planificados de la sesión asignada (líneas 33-36):

```ts
const duracionTotal = sesion.bloques.reduce(
  (total, bloque) => total + bloque.duracion,
  0
);
```

Esto significa que:
- Es la **duración planificada** (suma de `duracion` de cada `BloqueSesion` del libro asignado).
- **No es una duración real** registrada por el atleta (no hay campo de "tiempo actual entrenado" ni cronómetro que el atleta detenga).
- El atleta no puede editar la duración; solo ve el resultado en pantalla.

**Carga calculada:**

```ts
const carga = (rpeSeleccionado || 0) * duracionTotal;
```

Fórmula: **sRPE = duración (min) × RPE (1-10)**. Unidad: **UA**.

**Envío al service:**

Desde `ClienteDashboard.tsx` (líneas ~94-102), se llama a `completarSesionPendiente` con:
- `duracion: datos.duracion` (el `duracionTotal` del modal)
- `rpe: datos.rpe` (el RPE seleccionado)
- `carga: datos.duracion * datos.rpe` (recalculado en el dashboard)
- `observacionesCliente: datos.observaciones` (las observaciones del atleta)

No se envía ningún otro dato del atleta (no hay peso, ni RPE por ejercicio, ni series, ni bienestar).



### B. Verificación de bug de mes: `SesionEntrenamiento.mes` (1-12) vs `getMonth()` (0-11)

#### 1. Definición del tipo `SesionEntrenamiento`

**Archivo:** `src/features/admin/seguimiento/types/seguimiento.ts`

```ts
export interface SesionEntrenamiento {
  id: string;
  clienteId: string;
  preparadorId: string;
  fecha: Date;
  mes: number;      // <<--- se asume 1-12 (enero=1, ..., diciembre=12)
  anio: number;
  libroId: string;
  libroNombre: string;
  // ...
}
```

#### 2. Cómo se escribe `mes` al completar una sesión

**Archivo:** `src/features/admin/seguimiento/services/sesionesPendientes.service.ts`, función `completarSesionPendiente` (líneas ~130-183)

Al convertir una sesión pendiente en completada, el documento escrito en la colección `sesiones` **NO incluye los campos `mes` ni `anio`**. Los campos escritos son:

- `clienteId`, `preparadorId`, `fecha`, `estado` (`"completada"`), `libroId`, `libroNombre`, `gruposMusculares`, `bloques`, `objetivo`, `observacionesPreparador`, `duracion`, `rpe`, `carga`, `observacionesCliente`, `createdAt`.

**Conclusión:** Los campos `mes` y `anio` del tipo `SesionEntrenamiento` **nunca se poblan** al completar una sesión mediante `completarSesionPendiente`. Quedan indefinidos.

#### 3. Cómo se compara/filtra `mes` en `obtenerSesionesCliente`

**Archivo:** `src/features/admin/seguimiento/services/seguimientoService.ts`, función `obtenerSesionesCliente` (líneas 20-65)

```ts
const hoy = new Date();
const mesActual = hoy.getMonth() + 1;   // 1-12
const anioActual = hoy.getFullYear();

const q = query(
  collection(db, COLLECTION),
  where("clienteId", "==", clienteId),
  where("mes", "==", mesActual),   // <<--- compara contra 1-12
  where("anio", "==", anioActual),
  orderBy("fecha", "desc"),
);
```

Como `mes` nunca se escribe al completar, esta consulta **no devolverá resultados** para sesiones completadas vía `completarSesionPendiente`.

#### 4. Cómo se filtra mes en `CargaResumen.tsx`

**Archivo:** `src/features/admin/seguimiento/components/CargaResumen.tsx` (líneas 43-47)

```ts
const sesionesMes = sesiones.filter(
  (sesion) =>
    sesion.fecha.getMonth() === hoy.getMonth() &&   // getMonth() = 0-11
    sesion.fecha.getFullYear() === hoy.getFullYear()
);
```

Aquí se usa `getMonth()` (0-11) directamente sobre el `Date` de `fecha`. Esta comparación **es consistente internamente** (ambos lados son 0-11), pero **no usa el campo `mes` del tipo** ni coincide con la lógica de `obtenerSesionesCliente` (que usa 1-12).

#### Resumen de la inconsistencia

| Origen | Valor de mes | Rango | ¿Se escribe al completar? |
|---|---|---|---|
| Tipo `SesionEntrenamiento.mes` | campo declarado | 1-12 (asumido) | ❌ No se escribe |
| `obtenerSesionesCliente` | `hoy.getMonth() + 1` | 1-12 | Filtra contra campo que no existe |
| `CargaResumen.tsx` | `fecha.getMonth()` | 0-11 | Filtra sobre `Date.fecha` (sí existe) |

**Bug potencial:** Si se depende de `obtenerSesionesCliente` para listar sesiones del mes actual, no devolverá nada porque `mes`/`anio` nunca se guardan. La carga mensual en `CargaResumen` funciona solo porque filtra sobre `fecha.getMonth()` en memoria, no sobre el campo `mes`.


### C. Existencia de `plantel.types.ts` frente a `plantel.ts`

**Sí existe** el archivo `src/features/admin/planteles/types/plantel.types.ts`. Es distinto de `src/features/admin/planteles/types/plantel.ts`.

| Aspecto | `plantel.ts` | `plantel.types.ts` |
|---|---|---|
| Ruta | `src/features/admin/planteles/types/plantel.ts` | `src/features/admin/planteles/types/plantel.types.ts` |
| Tipos exportados | `AtletaPlantel`, `BloqueSesion`, `Equipo`, `SesionEntrenamiento`, `PlanificacionGeneral` | `Deporte`, `EstadoJugador`, `JugadorPlantel`, `Equipo`, `BloqueEjercicio`, `SesionDiaEquipo`, `PlanMesocicloEquipo` |
| `BloqueSesion` / `BloqueEjercicio` | `id?`, `titulo`, `categoria` (enum con 7 valores), `duracionMinutos`, `descripcion`, `ejercicios?: string[]`, `orden` | `id`, `equipoId?`, `titulo`, `categoria` (enum con 5 valores: entrada_en_calor, fuerza, velocidad, resistencia, prevencion), `descripcion` |
| `SesionEntrenamiento` / `SesionDiaEquipo` | `id?`, `equipoId`, `preparadorId?`, `fecha: Date`, `mes`, `anio`, `libroId`, `libroNombre`, `gruposMusculares?`, `ejercicios?: string[]`, `duracion`, `rpe`, `carga`, `observaciones?` | `id`, `equipoId`, `fecha: string` (YYYY-MM-DD), `matchDayTag?`, `orientacion`, `duracionMinutos`, `bloques: BloqueEjercicio[]`, `notasPF?`, `completada` |

Son dos modelos paralelos y no compartidos: uno para el módulo de seguimiento individual de atletas (`plantel.ts`) y otro para el módulo de planteles/equipos (`plantel.types.ts`).


### D. Búsqueda de modelos de bienestar, sueño, dolor, lesión, partidos, eventos, resultados de pruebas por atleta, velocidad/tiempos/intentos

Se buscó en todo `src/` mediante regex. Resultados:

| Modelo buscado | ¿Existe? | Ruta y campos | Estado |
|---|---|---|---|
| Bienestar / ánimo | ⚠️ Parcial | `src/types/seguimiento.ts` — tipo `Registro` con `estadoAnimo?: number \| null` | Tipo huérfano: no hay colección, service ni hook que lo use en el flujo actual de sesiones. |
| Sueño | ❌ No existe | — | No hay ningún modelo, campo o colección. |
| Dolor | ❌ No existe | — | No hay ningún modelo, campo o colección. |
| Lesión | ⚠️ Parcial | `src/types/seguimiento.ts` — tipo `Atleta` con `lesiones?: string \| null` | Solo un campo estático de texto en el perfil del atleta, sin fecha ni seguimiento temporal. |
| Partidos / eventos / fechas objetivo | ❌ No existe | — | No hay colección ni modelo dedicado. `plantel.types.ts` tiene `SesionDiaEquipo.matchDayTag` (MD-4…MD+2) pero es para planteles de equipo, no para seguimiento individual de atleta. |


| Resultados de pruebas por atleta con fecha (más allá de `barrerasProgreso`) | ❌ No existe | — | `barrerasProgreso` guarda `historial` embebido con `fecha`, pero no hay una colección independiente de resultados de pruebas por atleta. `physicalTests` solo define la prueba (nombre, categoría, unidad), no guarda resultados por atleta. |
| Velocidad / tiempos / intentos | ⚠️ Parcial | `src/types/seguimiento.ts` — tipo `Registro` con `velocidadDistancia?: number \| null` y `velocidadTiempo?: number \| null` | Tipo huérfano (no usado). `physicalTests` tiene categoría `"Velocidad"` pero no guarda resultados por atleta con fecha ni intentos. |

**Conclusión:** No existe ningún modelo dedicado para registrar bienestar diario, sueño, dolor, lesiones con fecha, partidos, o resultados de pruebas físicas por atleta con seguimiento temporal. El tipo `Registro` en `src/types/seguimiento.ts` parece ser un modelo legado que no está conectado al flujo actual.


### E. Reglas de seguridad de Firestore (`firestore.rules`)

**El archivo `firestore.rules` NO existe en el repositorio.**

Se buscó en la raíz del proyecto y en `src/`; no se encontró. El `README.md` menciona (línea 32) que existe seguridad implementada en Firestore Rules, pero el archivo de reglas no está presente en el código entregado.

**Consecuencia:** No se puede reportar quién puede leer ni escribir cada colección (`sesiones`, `sesionesPendientes`, `barrerasProgreso`, `asistencias`) porque no hay reglas definidas en el repo. Las consultas se realizan desde el cliente con el SDK de Firebase, sin evidencia de restricciones de acceso por rol (atleta vs preparador) en el código de reglas.


### F. Índices compuestos definidos (`firestore.indexes.json`)

**El archivo `firestore.indexes.json` NO existe en el repositorio.**

Se buscó en la raíz del proyecto y no se encontró. Los únicos archivos de configuración de Firebase presentes son:
- `.firebaserc`
- `firebase.json` (234 bytes)

No hay definición de índices compuestos para las consultas con múltiples filtros (por ejemplo, `where("clienteId", "==", ...) + where("mes", "==", ...) + where("anio", "==", ...) + orderBy("fecha", "desc")` en `obtenerSesionesCliente`, o los filtros compuestos de `sesionesPendientes` por `clienteId`, `preparadorId` y `estado`).
