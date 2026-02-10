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
