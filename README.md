# Z-Rendi

Aplicación web para la gestión de atletas y el seguimiento de su entrenamiento. Está construida con React, TypeScript, Vite, Tailwind CSS y Firebase.

## Funcionalidades

### Para el entrenador / administrador

- Gestionar atletas, sus fichas y datos de seguimiento.
- Registrar cuotas, pagos y asistencias.
- Crear y consultar sesiones de entrenamiento, cargas y registros de ejercicios.
- Configurar barreras de progreso. El procesamiento automático disponible se aplica a barreras de fuerza; las de velocidad y resistencia se gestionan manualmente.
- Consultar informes, relevamientos y pruebas físicas.
- Administrar biblioteca de ejercicios, libros de entrenamiento y planteles/equipos.
- Enviar avisos a los atletas.

### Para el atleta

- Consultar su panel, ficha, avisos, cuotas, asistencia y sesiones asignadas.
- Completar los registros de sus sesiones.
- Consultar la sección **Mi rendimiento**.
- Registrar marcas personales de running desde la sección **Running**.
- Completar check-ins disponibles en su cuenta.

## Tecnologías

- React 19 y TypeScript.
- Vite y Tailwind CSS.
- Firebase Authentication y Cloud Firestore.
- Cloudinary para la carga de imágenes.

## Requisitos

- Node.js y npm instalados.
- Acceso a los servicios de Firebase y Cloudinary configurados para el proyecto.

## Desarrollo local

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación.

## Comandos disponibles

```bash
npm run dev      # servidor local
npm run lint     # análisis estático con ESLint
npm run build    # chequeo de TypeScript y compilación de producción
npm run preview  # previsualización local de la compilación
```

El proyecto no define actualmente un comando de tests automatizados en `package.json`.

## Configuración de servicios

La aplicación lee la configuración pública de Firebase desde `src/firebase/firebase.ts` y las variables de Cloudinary desde variables de entorno con prefijo `VITE_`. No se deben agregar claves privadas, credenciales de cuentas de servicio ni secretos al frontend ni al repositorio.

La subida a Cloudinary se realiza desde el navegador con un preset. El modo y las restricciones de ese preset se configuran en Cloudinary y deben revisarse allí.

## Seguridad y despliegue

La interfaz separa las rutas de administrador y atleta según el perfil cargado. Esa separación visual no reemplaza la autorización de Firestore: las reglas del servicio deben validar identidad, rol, propiedad y campos permitidos para cada operación.

En este repositorio, `firebase.json` referencia los índices de Firestore, pero no configura archivos de reglas de Firestore ni de Storage. Los archivos de reglas `.txt` que puedan existir son borradores y no prueban cuáles reglas están activas en el proyecto remoto. Antes de desplegar o modificar datos, verificar las reglas efectivas desde la configuración del proyecto Firebase y mantener las reglas aprobadas versionadas y enlazadas a la configuración de despliegue.

Para publicar la aplicación, generar primero la compilación con `npm run build` y desplegar el directorio configurado en Firebase Hosting (`dist`). Revisar la configuración del proyecto y las reglas antes de cada despliegue.

## Estructura general

- `src/features/admin`: herramientas de gestión para entrenador/administrador.
- `src/features/usuario`: vistas y funciones del atleta, incluyendo rendimiento y running.
- `src/features/avisos` y `src/features/checkins`: avisos y check-ins.
- `src/auth`: autenticación, contexto y registro.
- `src/firebase`: inicialización del cliente Firebase.
- `public`: recursos estáticos.

## Estado del proyecto

Z-Rendi está en evolución. Las funcionalidades y permisos disponibles pueden variar con cada versión. Para cambios en seguridad, validar las reglas de Firestore y probar los flujos con cuentas de distintos roles antes de publicar.
