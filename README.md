# Z-Rendi 🏋️‍♂️

Z-Rendi es una aplicación personal diseñada para preparadores físicos y entrenadores que trabajan con atletas y alumnos.  
Su objetivo es centralizar la gestión de **fichas de deportistas**, **sesiones de entrenamiento** y **cuotas**, de manera simple y práctica.

---

## ✨ Funcionalidades principales

### 1. Fichas de atletas
- Registro de datos personales: nombre, apellido, edad, peso, altura, posición en deporte, historial de lesiones.
- Parámetros iniciales: evaluaciones de rendimiento para establecer un punto de partida.
- Seguimiento de progresión: comparación entre evaluaciones iniciales y actuales.

### 2. Sesiones de entrenamiento
- Clasificación por tipo: fuerza, resistencia, técnica, recuperación, etc.
- Asignación de sesiones a personas o posiciones específicas.
- Registro de fecha, ejercicios, cargas y observaciones.
- Visualización de progresión individual y, opcionalmente, tarjetas de rendimiento compartidas.

### 3. Cuotas
- Gestión de pagos de cada cliente.
- Estado de cuota: pagado o pendiente.
- Fechas de vencimiento y historial de pagos.

---

## 🔒 Roles y permisos
- **Administrador (vos):** puede crear, editar y gestionar fichas, sesiones y cuotas.
- **Clientes:** acceden únicamente a su propia información (ficha, rendimiento y cuota).  
  - Opcional: acceso a tarjetas de rendimiento generales visibles para todos, sin datos personales ni cuotas.

---

## 🛠️ Tecnologías utilizadas
- **Vite + React + TypeScript** → frontend rápido y moderno.
- **TailwindCSS v3** → estilos simples y personalizables.
- **Firebase** → base de datos (Firestore), autenticación y almacenamiento en la nube.

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/z-rendi.git
   cd z-rendi

   📋 Informe de estado – Z-Rendi (Módulo Fichas)
✅ Lo implementado
Autenticación con Firebase Auth: los usuarios pueden iniciar sesión con su correo y contraseña.

Reglas de seguridad en Firestore:

Cada usuario solo puede leer su propia ficha (fichas/{uid}).

Las colecciones cuotas y sesiones están restringidas a documentos donde clienteId == uid.

Migración de fichas: se creó el documento de Alex con su UID como ID, cumpliendo las reglas de seguridad.

Modificación de FichasPage.tsx:

Ahora consulta directamente fichas/{uid} en lugar de intentar leer toda la colección.

Se usa setDoc para crear/editar la ficha directamente en el documento del usuario.

Se ajustó el estado para manejar Ficha | undefined y evitar errores de tipado.

⚠️ Problemas actuales
Error de permisos en Firestore

Antes: FirebaseError: Missing or insufficient permissions al intentar leer toda la colección.

Solución: ya corregido en FichasPage.tsx usando getDoc(doc("fichas", user.uid)).

Errores de tipado en TypeScript

Type 'Ficha | null' is not assignable to type 'Ficha | undefined'.

Ajustado el estado a Ficha | undefined para coincidir con lo que espera FichaDetail.

Datos demo locales

Cuando las reglas bloqueaban la lectura, se mostraban datos mock (fichasIniciales).

Ahora, si el usuario no tiene ficha, se muestra un mensaje claro: “No existe ficha para este usuario”.

🔧 Faltante por implementar
Sesiones y cuotas:

Ajustar las páginas correspondientes para que consulten Firestore filtrando por clienteId = user.uid.

Ejemplo:

ts
const q = query(collection(db, "sesiones"), where("clienteId", "==", user.uid));
const querySnapshot = await getDocs(q);
Esto permitirá que Alex vea solo sus sesiones y cuotas.

UI/UX:

Mostrar mensajes más claros cuando no existan datos (ejemplo: “Todavía no tenés sesiones registradas”).

Posibilidad de crear nuevas sesiones/cuotas desde la interfaz y que se guarden con el clienteId correcto.

Roles y permisos:

Implementar lógica para que un admin pueda ver todas las fichas, cuotas y sesiones.

Los clientes solo ven su propia información.

Validaciones extra:

Evitar que se creen fichas duplicadas para el mismo UID.

Validar campos obligatorios antes de guardar.

🚀 Próximos pasos
Ajustar las páginas de Sesiones y Cuotas para que usen el uid del usuario logueado.

Probar login con Alex y verificar que se carguen sus datos reales en lugar de los demo.

Implementar roles (admin vs cliente) para diferenciar vistas.

Mejorar mensajes de error y estados de carga.
