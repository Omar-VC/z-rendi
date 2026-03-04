# 📱 Z-Rendi

## 📌 Qué es
Z-Rendi es una aplicación de gestión para entrenadores físicos y administradores de atletas.  
Permite centralizar la información de cada cliente-usuario en un solo lugar, ofreciendo una interfaz clara y segura para el manejo de:

- **Fichas personales** (datos básicos y de salud).
- **Cuotas** (estado de pagos).
- **Sesiones de entrenamiento** (registro y seguimiento de rutinas).

---

## 🎯 Para qué sirve
- Facilita el trabajo del entrenador al tener toda la información de cada cliente organizada.  
- Permite a los clientes visualizar sus datos de manera segura y privada.  
- Ofrece a los administradores control total sobre la gestión de usuarios y sus registros.  

---

## ✅ Qué resuelve
- Evita el uso disperso de planillas y documentos sueltos.  
- Centraliza la información en Firestore con reglas de seguridad basadas en roles.  
- Diferencia claramente entre **clientes** (solo lectura de sus propios datos) y **administradores** (gestión global).  

---

## 🚀 Estado actual
La aplicación ya está funcional y permite:
- Registro y autenticación de usuarios con Firebase Auth.  
- Visualización de fichas, cuotas y sesiones de entrenamiento.  
- Diferenciación de permisos entre clientes y administradores mediante **custom claims** (`role: "admin"`).  
- Seguridad implementada en Firestore Rules para garantizar privacidad y control de acceso.  

---


## 📌 Próximos pasos
- Crear un módulo de administración que permita eliminar usuarios desde la app.  
- Validar la experiencia de cliente: que al iniciar sesión vea únicamente sus datos.  
- Completar pruebas de seguridad y permisos para garantizar que las reglas de Firestore se cumplen en todos los casos.  

---

## 🛡️ Roles
- **Cliente**:  
  - Puede ver únicamente sus propios datos (ficha, cuotas, sesiones).  
  - No puede modificar ni eliminar información global.  

- **Administrador**:  
  - Puede ver y gestionar todos los clientes.  
  - Puede crear, editar y próximamente eliminar usuarios.  
  - Acceso completo a fichas, cuotas y sesiones.  

---

## 📖 Notas de desarrollo
Este proyecto está en evolución. Se recomienda mantener un archivo `NOTAS.md` para registrar pendientes, ideas y mejoras futuras.  

----

## ⚠️ Errores actuales en el build
Durante la compilación con `npm run build` se detectan **39 errores de TypeScript**, principalmente relacionados con:

- Uso de tipos incorrectos (`"pagada"` vs `"pagado"`, `string` vs `number`).  
- Propiedades faltantes en los tipos (`mes` en `Cuota`, `estado` y `completadaAt` en `Sesion`, `deporte`, `puesto`, `telefono` en `Ficha`).  
- Props sin tipar (`any`) en componentes como `CuotaDetailCliente`.  
- Duplicación de `id` en los hooks (`useCliente`, `useCuotas`, `useFichas`, `useSesiones`).  
- Inconsistencias de casing en imports (`Cuotas` vs `cuotas`, `Sesiones` vs `sesiones`).  
- Formularios que envían strings donde el tipo espera números (`edad`, `peso`, etc.).  

👉 La solución pasa por **alinear los tipos en `types.ts` con los componentes**, tipar correctamente las props y ajustar los hooks para evitar sobrescribir `id`. Con estas correcciones, la mayoría de los errores deberían resolverse.