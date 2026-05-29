# Cercle App 📱✨

Este es el repositorio oficial de la aplicación móvil de Cercle, desarrollada sobre el stack de **React Native** con **Expo** y conectada a una infraestructura segura de **Supabase Edge Functions**.

---

## 🛠️ Guía de Commits y Versionado

Para mantener un historial de cambios limpio, estructurado y fácil de auditar, todos los commits de este proyecto deben seguir una nomenclatura de prefijos obligatoria según la naturaleza del cambio:

### Prefijos Principales
* **`ADD`** ➡️ **AÑADIR**: Se utiliza para la incorporación de nuevas funcionalidades, componentes, pantallas o archivos completos.
  * *Ejemplo:* `ADD: pantalla de carrito de compras premium con soporte interactivo`
* **`MOD`** ➡️ **MODIFICAR**: Se usa para cambios o actualizaciones sobre lógica, componentes o archivos ya existentes.
  * *Ejemplo:* `MOD: adaptado el flujo del carrito para consumir la Edge Function`
* **`DEL`** ➡️ **ELIMINAR**: Reservado para remover componentes, código deprecado, mock data o archivos del proyecto.
  * *Ejemplo:* `DEL: eliminado el componente huérfano CartItemRow y estilos antiguos`
* **`REF`** ➡️ **REFACTORIZAR**: Cambios estructurales del código que mejoran su legibilidad o modularidad sin alterar su comportamiento visual ni funcional.
  * *Ejemplo:* `REF: simplificada lógica de OfertaCard extrayendo consultas a hooks globales`

### Prefijos de Soporte
* **`FIX`** ➡️ **CORREGIR**: Solución de fallos, crashes, bugs de React Native o errores de compilación de TypeScript.
  * *Ejemplo:* `FIX: corregido bucle infinito de renderizados en useHomeData con useCallback`
* **`SEC`** ➡️ **SEGURIDAD**: Adición de validaciones Zero-Trust, sanitización de inputs o cerrojos de concurrencia contra condiciones de carrera.
  * *Ejemplo:* `SEC: añadido cerrojo transaccional Mutex y validación Zod en CartProvider`
* **`STY`** ➡️ **ESTILOS / UI**: Cambios estéticos, de diseño, hojas de estilos (`StyleSheet`), colores, tipografía o espaciados.
  * *Ejemplo:* `STY: unificado el redondeado corporativo a 22px en tarjetas de producto`
* **`DOC`** ➡️ **DOCUMENTACIÓN**: Creación o actualización de guías, ficheros Markdown (`README.md`, `AGENTS.md`) o comentarios extensivos del código.
  * *Ejemplo:* `DOC: actualizada la documentación de versionado y commits en el README`
* **`CFG`** ➡️ **CONFIGURACIÓN**: Modificación de dependencias en `package.json`, configuraciones de Expo, TypeScript o variables de entorno.
  * *Ejemplo:* `CFG: añadido tipado estricto para esquemas Zod de red en tsconfig`

---

## 🚀 Inicio Rápido (Desarrollo)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Levantar el entorno de Expo
```bash
npx expo start
```

### 3. Ejecutar en simuladores
En la consola interactiva podrás seleccionar:
* **`i`** para simulador de **iOS**
* **`a`** para emulador de **Android**
* **`w`** para iniciar en entorno **Web**
