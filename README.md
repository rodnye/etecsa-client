# etecsa-client

Cliente no oficial para la API de ETECSA (https://www.tienda.etecsa.cu).  
Permite autenticación, consulta de servicios móviles, gestión de perfil, nomencladores y más.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

> - [¿Para qué es esto?](./docs/WHY.md)
> - [¿Cómo funciona?](./docs/HOW.md)

## Características

- **Autenticación** – Inicio de sesión, manejo de cookies y recuperación de contraseña.
- **Perfil de usuario** – Obtener datos, editar perfil, cerrar sesión.
- **Servicios móviles** – Consultar saldo, paquetes, estado de línea (prepago/postpago/SIM datos).
- **Nomencladores** – Provincias, municipios, interrupciones de Nauta y STB.
- **Páginas públicas** – Obtener paquetes, planes, ofertas, preguntas frecuentes.
- **Manejo robusto de errores** – Errores tipados con códigos específicos.
- **TypeScript** – Tipos completos incluidos tanto de las solicitudes como de las respuestas.

## 🚀 Uso rápido

```typescript
import { etecsa } from 'etecsa-client';

// 1. Inicializar el cliente (solo una vez)
await etecsa.init();

// 2. Iniciar sesión
await etecsa.auth.login({
  user: '+53 5555555',
  pass: 'tu_contraseña',
});

// 3. Obtener datos del perfil
const perfil = await etecsa.profile.me();
console.log(perfil.usuario.nombre);

// 4. Consultar estado de un servicio móvil
const estadoMovil = await etecsa.mobile.status();
console.log(`Saldo: ${estadoMovil.balance}`);

// 5. Cerrar sesión
await etecsa.auth.logout();
```

---

## 📚 API Principal

### `etecsa.init()`

Debe llamarse **una sola vez** antes de cualquier otra operación.  
Carga el entorno virtual y prepara los métodos de comunicación.

```typescript
await etecsa.init();
```

---

### 🔐 `etecsa.auth` – Autenticación

| Método                         | Descripción                                             |
| ------------------------------ | ------------------------------------------------------- |
| `login({ user, pass })`        | Inicia sesión y devuelve cookies de sesión.             |
| `logout()`                     | Cierra la sesión actual.                                |
| `sendCode(user)`               | Envía código de verificación para recuperar contraseña. |
| `verifyCode(user, code)`       | Verifica el código enviado.                             |
| `resetPassword(user, newPass)` | Restablece la contraseña.                               |
| `save()`                       | Guarda las cookies actuales (serializables a JSON).     |
| `load(cookiesJson)`            | Restaura cookies desde JSON.                            |
| `clear()`                      | Limpia todas las cookies.                               |

**Ejemplo completo de recuperación:**

```typescript
await etecsa.auth.sendCode('+53 55555555');

// chequear el código de confirmación recibido
await etecsa.auth.verifyCode('+53 55555555', '123456');
await etecsa.auth.resetPassword('+53 55555555', 'nuevaPass123');
```

---

### 👤 `etecsa.profile` – Perfil de usuario

| Método                            | Descripción                                   |
| --------------------------------- | --------------------------------------------- |
| `me()`                            | Obtiene datos completos del perfil.           |
| `edit(data)`                      | Edita nombre, apellidos, dirección, etc.      |
| `mobileServices()`                | Lista de servicios móviles asociados.         |
| `landlineServices()`              | Servicios de telefonía fija.                  |
| `nautaHogar()`                    | Datos de Nauta Hogar.                         |
| `cashiersIds()`                   | IDs de cajeros disponibles.                   |
| `ownCard()`                       | Tarjeta propia asociada.                      |
| `verifyUser(id, tipo, usuario)`   | Verifica si un número/correo está disponible. |
| `generateCode(tipo, usuario)`     | Genera código para añadir servicio.           |
| `verifyCode(usuario, code, tipo)` | Verifica código para añadir servicio.         |

---

### 📱 `etecsa.mobile` – Servicios móviles

| Método             | Descripción                                 |
| ------------------ | ------------------------------------------- |
| `status(request?)` | Obtiene estado (saldo, paquetes, voz, SMS). |

**Uso:** Si no pasas parámetros, usa el primer servicio móvil del perfil.  
Puedes pasar `{ service, ci, typeci, sendSms }` para consultar una línea específica.

```typescript
// Usar el primer servicio del perfil
const estado = await etecsa.mobile.status();

// Consultar línea específica
const estado2 = await etecsa.mobile.status({
  service: '+53 55555555',
  sendSms: false,
});
```

---

### 🗺️ `etecsa.nom` – Nomencladores

| Método                       | Descripción                        |
| ---------------------------- | ---------------------------------- |
| `provinces()`                | Lista de provincias.               |
| `municipalities(provinceId)` | Municipios de una provincia.       |
| `nautaInterruptions()`       | Interrupciones del servicio Nauta. |
| `stbInterruptions()`         | Interrupciones de STB.             |

---

### 🌐 `etecsa.page` – Datos públicos

| Método              | Descripción                                                   |
| ------------------- | ------------------------------------------------------------- |
| `home()`            | Datos de la página principal (banners, productos destacados). |
| `packages()`        | Paquetes de datos disponibles.                                |
| `plans()`           | Planes de telefonía.                                          |
| `bags()`            | Bolsas de datos.                                              |
| `specialPlans()`    | Planes especiales.                                            |
| `additionalPlans()` | Planes adicionales.                                           |
| `offers()`          | Ofertas y promociones.                                        |
| `faq()`             | Preguntas frecuentes.                                         |

---

## Manejo de errores

Todos los errores de API lanzan una instancia de `EtecsaApiError`:

```typescript
import { etecsa, EtecsaApiError } from 'etecsa-client';

try {
  await etecsa.auth.login({ user: 'invalido', pass: 'xxx' });
} catch (error) {
  if (error instanceof EtecsaApiError) {
    console.error(`Error ${error.status}: ${error.message}`);
    console.error('Detalles:', error.details);
  }
}
```

**Códigos de error comunes:**

- `203` – Usuario o contraseña incorrectos
- `226` – Límite de intentos excedido o ya registrado
- `403` – Sesión expirada
- `204` – Usuario no encontrado
- `423` – Servicio no disponible

---

## Persistencia de sesión

Puedes guardar las cookies después de `login()` y restaurarlas después:

```typescript
// Guardar después de login
const cookiesGuardadas = etecsa.auth.save();

// En otra ejecución
await etecsa.init();
await etecsa.auth.load(cookiesGuardadas);
// Ahora la sesión sigue activa
```
